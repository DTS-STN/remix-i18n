# The remix-i18n demo

A [Remix](https://remix.run/) application demonstrating path-based localization on both the client and the server.

- [Remix Docs](https://remix.run/docs)

## ⚠️ IMPORTANT NOTE ⚠️

This project was created in April 2023 as a means to explore how the
[Remix](https://remix.run/) framework integrates with various i18n solutions.
Since then, Remix has been used to build the [**Canadian Dental Care
Plan**](https://github.com/DTS-STN/canadian-dental-care-plan) application, which
contains a more robust and fully-featured i18n solution.

While this project still has some value as a barebones reference, it is no
longer actively maintained. Please refer to the CDCP application for the most
up-to-date i18n reference.

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

The easiest way to build a container image is to use [Cloud Native Buildpacks](https://buildpacks.io/):

``` sh
pack build registry.localtest.me/remix-i18n --builder paketobuildpacks/builder:full --env BP_NODE_VERSION=18.16.1 --env NODE_ENV=production
docker run --rm --publish 3000:3000 registry.localtest.me/remix-i18n
```

## Tips and tricks

- **Loading namespaces:** you need to tell i18next which i18n translation files to load in the browser. This is handled
  by using (abusing?) Remix route handlers. Specify all i18n namespaces by exporting a `handle` object:

  ``` typescript
  export const handle = {
    i18nNamespaces: ['common'],
  };
  ```

- **Translating page metadata (ie: `<title>`):** to translate page metadata, expose the translated string via a Remix
  loader:

  ``` typescript
  export const loader: LoaderFunction = async ({ request }) => {
    const t = await getFixedT(request, 'common');
    return json({ pageTitle: t('app-title') });
  };

  export const meta: MetaFunction<typeof loader> = ({ data }) => [
    { title: data.pageTitle },
  ];
  ```

## Credits

Some of the code in this application is based on the work of [Sergio Xalambrí](https://github.com/sergiodxa) and his
[remix-i18next](https://github.com/sergiodxa/remix-i18next) project. Remix-i18next does not directly support path-based
i18n, which is why it was not used directly.
