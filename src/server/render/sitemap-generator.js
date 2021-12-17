import fs from 'fs';
import path from 'path';

/**
 * @param {string} xml
 */
const formatXml = (xml) => {
  let s = xml;

  // Create the padding element
  const spaces = ' '.repeat(2);

  // Regex to match xml tags.
  const attrib = '\\s*\\w+(?:\\s*=\\s*(?:\\w+|"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"))?';
  const anyTag = new RegExp(`(<\\/?\\w+(?:${attrib})*\\s*\\/?>)`, 'g');

  // Split into 'clean' new lines.
  s = s
    .split(anyTag)
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((line) => line.split(/\r?\n|\r/));

  let pad = 0;
  // 'flatten' the array.
  return []
    .concat(...s)
    .map((line) => {
      if (line[0] === '<' && line[1] === '/') pad -= 1;
      const out = spaces.repeat(pad) + line;
      if (line[0] === '<' && line[1] !== '/') pad += 1;

      return out;
    })
    .join('\n');
};

/**
 * @param {import('pure-http').IRequest} req
 * @param {any[]} routesMatch
 */
const sitemapGenerator = (req, routesMatch = []) => {
  const baseUrl = [`${req.protocol}://`, req.hostname, ![80, 443].includes(req.port) && `:${req.port}`]
    .filter(Boolean)
    .join('');

  const urls = routesMatch.map(({ pathname }, i) => {
    let s = `<url>\n<loc>${baseUrl}${pathname}</loc>\n</url>`;

    if (i !== routesMatch.length - 1) {
      s += '\n';
    }

    return s;
  });

  let beautyXml = '<?xml version="1.0" encoding="UTF-8"?>\n';

  const template = `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join('')}
  </urlset>
  `;

  beautyXml += formatXml(template);

  const sitemapPath = path.resolve(process.cwd(), 'public/sitemap.xml');

  fs.writeFileSync(sitemapPath, beautyXml, 'utf8');

  return beautyXml;
};

export default sitemapGenerator;
