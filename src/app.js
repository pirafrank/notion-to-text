const puppeteer = require('puppeteer');
const html2text = require('html-to-text');
const fs = require('fs');

async function run () {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  console.log("URL is", url);
  await page.setViewport({ width: 1920, height: 1080});
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });

  //await page.screenshot({path: 'screenshot.png'});

  console.log(await page.evaluate(() => document.title));

  await page.waitForSelector('.notion-page-content', { timeout: 1000 });
  /*
  await page.evaluate(() => {
    document.querySelectorAll('.notion-page-content').forEach(
      node => { console.log(node.innerHTML) }
    )
  })
  */
  /*
  const body = await page.evaluate(() => {
    return document.querySelector('body').innerHTML;
  });
  console.log(body);
  */

  const pageContent = await page.evaluate(() => {
    return document.querySelector('.notion-page-content').innerHTML;
  });
  //console.log(pageContent)

  const text = html2text.convert(pageContent, {
    wordwrap: 80,
    selectors: [
      { selector: 'img', format: 'skip' },
      { selector: 'a', options: { hideLinkHrefIfSameAsText: true, noAnchorUrl: true } }
    ],
  });

  // delete file if it exists
  if(fs.existsSync('output.txt'))
    fs.unlinkSync("output.txt")

  // write converted output to file
  fs.writeFileSync(
    'output.txt',
    text,
    ((err) => {
      if(err) return console.error(err);
      console.log("Output written to file")
    })
  )

  if (browser !== undefined) browser.close();
}

let url = process.argv[2];
if (!url) {
    throw new Error("Please provide a URL as the first argument");
}

function main() {
  if (!url.includes('http')){
    console.log("url misses protocol, going with HTTPS");
    url = "https://" + url;
  }
  run()
    .then(r => { console.log("Done")})
    .catch(e => console.log("Error", e))
}

main()
