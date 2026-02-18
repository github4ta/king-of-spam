// @ts-check
import { test, expect } from '@playwright/test';
// const { chromium } = require('playwright');

// const home_url_pl = 'https://www.kingspan.com/pl/';
const home_url_pl = 'https://www.kingspan.com/pl/pl/o-nas/';
const button_accept_cookie = '#ccc-notify-accept';

test.skip('home page pl', async ({ page }) => {
    /*const browser = await chromium.launch({
        channel: 'chrome',
        headless: false // Set to true if you don't want to see the window
    });*/

    await page.goto(home_url_pl, {
        waitUntil: 'networkidle'
    });
    //await page.goto(home_url_pl, { waitUntil: 'load' });
    //await page.waitForTimeout(4000);
    await await page.click(button_accept_cookie);

    await page.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight);
    });

    await page.emulateMedia({ media: 'screen' });

    const timestamp = Date.now();
    await page.screenshot({
        path: 'fullpage' + timestamp + '.png',
        fullPage: true
    });
    /* await expect(page).toHaveScreenshot({
        fullPage: true,
        threshold: 0.2
    }); */
});

test('get img', async ({ page }) => {
    await page.goto(home_url_pl, {
        waitUntil: 'networkidle'
    });

    await page.click(button_accept_cookie);


    /*await page.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight);
    });*/
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log('Total HEIGHT:', scrollHeight);

    await page.evaluate(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });

    var pics = await page.$$eval('img', imgs => imgs.map(img => ({
        file_name: img.src.split('/').pop() || 'unknown',
        src: img.src,
        alt: img.alt,
        title: img.title
    })
    ));

    pics.sort((a, b) => a.file_name.localeCompare(b.file_name));

    console.log("========== IMAGES ==========")
    console.log('Number of images = ' + pics.length);
    pics.forEach(pic => {
        console.log(pic.file_name);
        console.log(pic.src);
        console.log(pic.alt);
        console.log(pic.title);
        console.log('----------')
    });

    const headers = await page.$$eval('h1, h2, h3, h4, h5, h6', tags =>
        tags.map(tag => ({
            level: tag.tagName.toLowerCase(), // 'h1', 'h2' и т.д.
            text: tag.textContent.trim()
        }))
    );

    headers.sort((a, b) => a.level.localeCompare(b.level));

    console.log("========== H1...6 ==========")
    console.log('Number of images = ' + headers.length);
    headers.forEach(header => {
        console.log(header.level);
        console.log(header.text);
        console.log('----------')
    });

    /*var srcs = await page.$$eval('img', imgs => imgs.map(img => img.src));
    console.log('Number of images = ' + srcs.length);
    srcs.forEach(src => console.log(src));

    srcs = await page.$$eval('video', videos => videos.map(video => video.src));
    srcs.forEach(src => console.log(src));*/
});
