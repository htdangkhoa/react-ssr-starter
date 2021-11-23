const appConfig = {
  baseUrl: process.env.REACT_APP_BASE_URL || 'http://localhost:9090/api/',
  seo: {
    htmlAttributes: { lang: 'en' },
    defaultTitle: '⚛️ React SSR Starter',
    titleTemplate: '%s - ⚛️ React SSR Starter',
    meta: [
      {
        name: 'description',
        content: 'The best react universal starter boilerplate in the world.',
      },
    ],
  },
};

export default appConfig;
