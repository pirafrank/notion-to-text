const puppeteer = require('puppeteer');

let url = process.argv[2];
if (!url) {
    throw new Error("Please provide a URL as the first argument");
}

if (!url.includes('http')){
  console.log("url misses protocol, going with HTTPS");
  url = "https://" + url;
}

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
  console.log(pageContent)

  if (browser !== undefined) browser.close();
}

run()
  .then(r => { console.log("Done")})
  .catch(e => console.log("Error", e))
