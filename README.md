# The remix-i18n demo

A [Remix](https://remix.run/) application demonstrating path-based localization on both the client and the server.

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

``` sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Build for deployment

First, build your app for production:

``` sh
npm run build
```

Then run the app in production mode:

``` sh
npm start
```

## Build container image

The easiest way to build a container image is to use the following commands:

``` sh
docker build . --file containerfile --tag remix-i18n             \
    --build-arg BUILD_DATE="$(date -u +%Y-%m-%dT%H:%M:%SZ)"      \
    --build-arg BUILD_ID="0001"                                  \
    --build-arg BUILD_REVISION="$(git rev-parse --short=8 HEAD)" \
    --build-arg BUILD_VERSION="1.0.0"
docker inspect remix-i18n
docker run --init --interactive --tty --rm --publish 3000:3000 --name remix-i18n remix-i18n
```

## Tips and tricks

- **Loading namespaces:** you need to tell i18next which i18n translation files to load in the browser. This is handled
  by using (abusing?) Remix route handlers. Specify all i18n namespaces by exporting a `handle` object:

  ``` typescript
  export const handle = {
    i18nNamespaces: ['common'],
  } satisfies RouteHandle;
  ```

- **Translating page metadata (ie: `<title>`):** to translate page metadata, expose the translated string via a Remix
  loader:

  ``` typescript
  export const loader: LoaderFunction = async ({ request }) => {
    const language = getLang(request);
    const t = await getFixedT(request, handle.i18nNamespaces);
    return json({ pageTitle: t('application:page-title') });
  };

  export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data.pageTitle }];
  }
  ```

## Credits

Some of the code in this application is based on the work of [Sergio Xalambrí](https://github.com/sergiodxa) and his
[remix-i18next](https://github.com/sergiodxa/remix-i18next) project. Remix-i18next does not directly support path-based
i18n, which is why it was not used directly.
