const description = 'The best react universal starter boilerplate in the world.';

const appConfig = {
  baseUrl: process.env.REACT_APP_BASE_URL || 'http://localhost:9090/api/',
  seo: {
    htmlAttributes: { lang: 'en' },
    defaultTitle: '⚛️ React SSR Starter',
    titleTemplate: '%s - ⚛️ React SSR Starter',
    meta: [
      {
        name: 'keywords',
        content:
          'react, redux, unit-testing, boilerplate, performance, webpack, universal, es6+, jest, seo, ssr, server-side-rendering, supertest, react-router, react-hooks, redux-toolkit, react-testing-library, offline-first, pwa, best-practices, eslint, prettier, swc',
      },
      {
        name: 'description',
        content: description,
      },
    ],
  },
};

export default appConfig;
