const https = require('https');
const striptags = require('striptags');

export default async function handler(req, res) {
  try {
    const html = await fetchPage("https://www.economist.com/business/2023/03/26/big-tech-and-the-pursuit-of-ai-dominance");
    const text = striptags(html)
      .replace(/(\r\n|\n|\r)/gm, '') // Remove newlines
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove <script> tags and their contents
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '') // Remove <style> tags and their contents
      .replace(/\bclass\s*=\s*("|')[^"']*("|')/gi, '')
      .replace(/<!--[^>]*-->/gi, ''); // Remove HTML comments
    res.status(200).json({ text: text.trim() })
  } catch (error) {
    console.error(error);
    res.status(300).json({ error: error })
  }
}


async function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}
