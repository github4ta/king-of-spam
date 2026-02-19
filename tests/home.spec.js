import { test, expect } from "@playwright/test";
import { buildUrl, button_accept_cookie } from "../constants/constants";

const prodUrlContact = buildUrl("prod", "pl", "contact");
const stageUrlContact = buildUrl("stage", "pl", "contact");

const time_to_wait = 200;
const screen_height = 700;

async function openPageAndDoSnapshot(page, url) {
  console.log(url);
  await page.goto(url, {
    waitUntil: "networkidle",
  });

  // await page.click(button_accept_cookie);
  await page.waitForTimeout(time_to_wait);

  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log("Scroll HEIGHT = " + scrollHeight);
  const scrollTimes = Number.parseInt(scrollHeight / screen_height);
  console.log("Scroll TIMES = " + scrollTimes);

  for (var i = 1; i < scrollTimes; i++) {
    console.log("i = " + i + " - " + (i <= scrollTimes) + " -> " + scrollTimes);
    await page.evaluate(() => {
      window.scrollBy({
        top: 500,
        behavior: "smooth",
      });
    });
    await page.waitForTimeout(time_to_wait);
  }

  console.log("Pages Scrolled");
  await page.evaluate(async () => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await page.waitForTimeout(time_to_wait);

  console.log("Pages Scrolled to Top");
  await page.evaluate(async () => {
    window.scrollTo(0, 0);
  });

  await page.waitForTimeout(time_to_wait);

  if (url.startsWith("https://www")) {
    await page.screenshot({
      path: "snapshots/prod/fullpage.png",
      fullPage: true,
    });

    if (url.startsWith("https://stage")) {
      await page.screenshot({
        path: "snapshots/stage/fullpage.png",
        fullPage: true,
      });
    }
  }
}

test.use({
  viewport: { width: 1920, height: 1080 }, // Fake "maximized"
  deviceScaleFactor: 1.25,
});

test("home page pl", async ({ page }) => {
  test.setTimeout(600000);
  /*
    await page.goto(prodUrlContact, {
        waitUntil: 'networkidle'
    });

    await await page.click(button_accept_cookie);
    await page.waitForTimeout(time_to_wait);

    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    console.log("Scroll HEIGHT = " + scrollHeight);
    const scrollTimes = Number.parseInt(scrollHeight / 500);
    console.log("Scroll TIMES = " + scrollTimes);

    for (var i = 1; i < scrollTimes; i++) {
        console.log("i = " + i + " - " + (i <= scrollTimes) + " -> " + scrollTimes);
        await page.evaluate(() => {
            window.scrollBy({
                top: 500,
                behavior: 'smooth'
            });
        });
        await page.waitForTimeout(time_to_wait);
    }

    console.log("Pages Scrolled");
    await page.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight);
    });

    await page.waitForTimeout(time_to_wait);

    console.log("Pages Scrolled to Top");
    await page.evaluate(async () => {
        window.scrollTo(0, 0);
    });

    await page.waitForTimeout(time_to_wait);
    */

  await openPageAndDoSnapshot(page, prodUrlContact);

  await openPageAndDoSnapshot(page, prodUrlContact);
  // const timestamp = Date.now();

  /*
    await page.screenshot({
        path: 'snapshots/prod/fullpage' + timestamp + '.png',
        fullPage: true
    });
    */

  await expect(page).toHaveScreenshot("snapshots/prod/fullpage.png", {
    fullPage: true,
    threshold: 0.2,
  });
  console.log("========== LINKS ==========");
  console.log("Number of a = " + urls.length);
  console.log("Number of LINKS = " + validUrls.length);
  validUrls.forEach((validUrl) => {
    console.log(validUrl.href);
    console.log(validUrl.status_code);
    console.log("----------");
  });
});
