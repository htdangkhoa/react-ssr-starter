import serialize from 'serialize-javascript';
import { minify } from 'html-minifier';

const renderHtml = (head, canonical, extractor, markup, initialState = {}) => {
  let googleMetaTag = '';

  if (process.env.GOOGLE_SITE_VERIFICATION) {
    googleMetaTag = `<meta name="google-site-verification" content="${process.env.GOOGLE_SITE_VERIFICATION}" />`;
  }

  const html = `
    <!DOCTYPE html>
    <html ${head.htmlAttributes.toString()}>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">
        <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="manifest" href="/site.webmanifest">
        <meta name="msapplication-TileColor" content="#ffffff">
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
        <meta name="theme-color" content="#ffffff">
        <link rel="canonical" href="${canonical}" />
        
        ${googleMetaTag}

        ${process.env.SECRET}

        ${head.title.toString()}
        ${head.base.toString()}
        ${head.meta.toString()}
        ${head.link.toString()}
        
        <!-- Insert bundled styles into <link> tag -->
        ${extractor.getLinkTags()}
        ${extractor.getStyleTags()}
      </head>
      <body ${head.bodyAttributes.toString()}>
        <noscript>You need to enable JavaScript to run this app.</noscript>

        <div id="app">${markup}</div>

        <script>window.__INITIAL_STATE__ = ${serialize(initialState)}</script>

        <!-- Insert bundled scripts into <script> tag -->
        ${extractor.getScriptTags()}

        ${head.script.toString()}
      </body>
    </html>
  `;

  const minifyConfig = {
    collapseWhitespace: true,
    removeComments: true,
    trimCustomFragments: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
  };

  return __DEV__ ? html : minify(html, minifyConfig);
};

export default renderHtml;
