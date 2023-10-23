import { createReadableStreamFromReadable, type EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import crypto from 'crypto';
import { createInstance } from 'i18next';
import I18NexFsBackend from 'i18next-fs-backend';
import isbot from 'isbot';
import { resolve } from 'node:path';
import { renderToPipeableStream } from 'react-dom/server';
import { initReactI18next } from 'react-i18next';
import { PassThrough } from 'stream';

import { NonceContext } from '~/components/nonce-context';
import { getLocale, getNamespaces } from '~/utils/locale-utils';

const ABORT_DELAY = 5000;

function generateContentSecurityPolicy(nonce: string): string {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return [
    `default-src 'none'`,
    `base-uri 'self'`,
    `connect-src 'self'` + (isDevelopment ? ` ws://localhost:8002` : ''),
    `font-src 'self' fonts.gstatic.com canada.ca www.canada.ca`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `img-src 'self' canada.ca www.canada.ca`,
    `script-src 'self' 'nonce-${nonce}'`,
    `style-src 'self' canada.ca www.canada.ca`,
  ].join('; ');
}


async function handleRequest(request: Request, responseStatusCode: number, responseHeaders: Headers, remixContext: EntryContext) {
  const handlerFnName = isbot(request.headers.get('user-agent')) ? 'onAllReady' : 'onShellReady';
  const nonce = crypto.randomBytes(32).toString('hex');

  responseHeaders.set('Content-Security-Policy', generateContentSecurityPolicy(nonce));
  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('X-Content-Type-Options', 'nosniff');
  responseHeaders.set('X-Frame-Options', 'sameorigin');

  await createInstance()
    .use(initReactI18next)
    .use(I18NexFsBackend)
    .init({
      backend: { loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json') },
      debug: process.env.NODE_ENV === 'development',
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      lng: getLocale(request.url),
      ns: getNamespaces(remixContext.routeModules),
      supportedLngs: ['en', 'fr'],
    });

  return new Promise((resolve, reject) => {

    const { pipe, abort } = renderToPipeableStream(
      <NonceContext.Provider value={{ nonce }}>
        <RemixServer context={remixContext} url={request.url} abortDelay={ABORT_DELAY} />
      </NonceContext.Provider>,
      {
        [handlerFnName]() {
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          resolve(new Response(stream, { headers: responseHeaders, status: responseStatusCode }));
          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          console.error(error);
          responseStatusCode = 500;
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

export default handleRequest;
