// Echte Karten im Browser prüfen. (Проверяем настоящие карточки в браузере.)
const { chromium, webkit } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.argv[2] || 'http://127.0.0.1:4173/';
const expected = { all: 16, Protein: 6, Performance: 4, Strength: 3, Wellness: 3 };
async function main() {
 const engine = process.env.BROWSER === 'webkit' ? webkit : chromium;
 const browser = await engine.launch({headless:true});
 try {
  for (const size of [{width:1440,height:1000},{width:768,height:1024},{width:390,height:844},{width:320,height:568}]) {
   const page = await browser.newPage({viewport:size,deviceScaleFactor:1});
   const errors=[];page.on('pageerror',error=>errors.push(error.message));
   await page.goto(base,{waitUntil:'networkidle'});
   assert.equal(await page.locator('.flavor-art').count(),13,'13 individual flavor scenes are required');
   assert.equal(await page.locator('.scene-art').count(),3,'All three hero cards must remain');
   assert.equal(await page.locator('.snow-art').count(),0,'Snow card system must be removed');
   for(const [filter,count] of Object.entries(expected)) {
    await page.locator(`.catalog-filter[data-filter="${filter}"]`).click();
    assert.equal(await page.locator('.cards .card').count(),count,filter);
    assert.equal(await page.locator('.catalog-filter[aria-pressed="true"]').count(),1);
   }
   await page.locator('.catalog-filter[data-filter="all"]').click();
   for(const image of await page.locator('.cards img').all()) {
    await image.scrollIntoViewIfNeeded();await image.evaluate(async img=>{await img.decode();});
    assert(await image.evaluate(img=>img.naturalWidth>0),'Broken product image');
   }
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Horizontal page overflow');
   assert.deepEqual(errors,[],'Browser errors');
   assert(!/Frost|Snow|Schnee|die Karte|die dunkle FORMONE-Szene/i.test(await page.locator('.cards').innerText()),'Design notes leaked into product descriptions');
   const art=await page.locator('[data-flavor="cookies"].flavor-art').evaluate(el=>({clip:getComputedStyle(el.querySelector('img')).clipPath,blend:getComputedStyle(el.querySelector('img')).mixBlendMode}));
   assert.equal(art.clip,'none');assert.equal(art.blend,'normal');
   if(size.width===1440) {
    fs.mkdirSync('qa',{recursive:true});await page.locator('.cards').screenshot({path:'qa/catalog-desktop.png'});
   }
   console.log(`PASS ${process.env.BROWSER || 'chromium'} ${size.width}x${size.height}: 16 images, filters, three heroes, no overflow/errors`);
   await page.close();
  }
 } finally {await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
