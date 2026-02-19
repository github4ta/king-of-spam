import { test, expect } from "@playwright/test";

const { buildUrl } = require("../constants/constants.js");

const prodUrlHome = buildUrl("prod", "pl", "home");
const stageUrlHome = buildUrl("stage", "pl", "home");
const prodUrlAbout = buildUrl("prod", "pl", "about");

const time_to_wait = 500;

async function openPageAndDoSnapshot(page, url) {
  await page.goto(url, {
    waitUntil: "networkidle",
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
  }

  if (url.startsWith("https://stage")) {
    await page.screenshot({
      path: "snapshots/stage/fullpage.png",
      fullPage: true,
    });
  }
}

test.use({
  viewport: { width: 1920, height: 1080 }, // Fake "maximized"
  deviceScaleFactor: 1.25,
});

test.skip("home page pl", async ({ page }) => {
  test.setTimeout(120000);
  /*
    await page.goto(prodUrlHome, {
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

  openPageAndDoSnapshot(page, prodUrlHome);

  openPageAndDoSnapshot(page, stageUrlHome);
  // const timestamp = Date.now();

  /*
    await page.screenshot({
        path: 'snapshots/prod/fullpage' + timestamp + '.png',
        fullPage: true
    });
    */

  await expect(page).toHaveScreenshot({
    fullPage: true,
    threshold: 0.2,
  });
});

test.skip("get img", async ({ page }) => {
  await page.goto(home_url_pl, {
    waitUntil: "networkidle",
  });

  await page.click(button_accept_cookie);

  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log("Total HEIGHT:", scrollHeight);

  await page.evaluate(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  });

  var pics = await page.$$eval("img", (imgs) =>
    imgs.map((img) => ({
      file_name: img.src.split("/").pop() || "unknown",
      src: img.src,
      alt: img.alt,
      title: img.title,
    })),
  );

  pics.sort((a, b) => a.file_name.localeCompare(b.file_name));

  console.log("========== IMAGES ==========");
  console.log("Number of images = " + pics.length);
  pics.forEach((pic) => {
    console.log(pic.file_name);
    console.log(pic.src);
    console.log(pic.alt);
    console.log(pic.title);
    console.log("----------");
  });

  const headers = await page.$$eval("h1, h2, h3, h4, h5, h6", (tags) =>
    tags.map((tag) => ({
      level: tag.tagName.toLowerCase(), // 'h1', 'h2' и т.д.
      text: tag.textContent.trim(),
    })),
  );

  headers.sort((a, b) => a.level.localeCompare(b.level));

  console.log("========== H1...6 ==========");
  console.log("Number of images = " + headers.length);
  headers.forEach((header) => {
    console.log(header.level);
    console.log(header.text);
    console.log("----------");
  });

  /*var srcs = await page.$$eval('img', imgs => imgs.map(img => img.src));
    console.log('Number of images = ' + srcs.length);
    srcs.forEach(src => console.log(src));

    srcs = await page.$$eval('video', videos => videos.map(video => video.src));
    srcs.forEach(src => console.log(src));*/
});

test.skip("check links", async ({ page }) => {
  await page.goto(home_url_pl, {
    waitUntil: "networkidle",
  });

  await page.click(button_accept_cookie);

  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log("Total HEIGHT:", scrollHeight);

  await page.evaluate(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  });

  // 1. Extract all links
  const urls = await page.$$eval("a", (tags) =>
    tags.map((tag) => ({
      href: tag.href,
      status_code: -1, // JavaScript allows changing this to a number later
    })),
  );

  // 2. Filter to only valid web URLs (ignores mailto:, tel:, #, etc.)
  const validUrls = urls.filter((link) => link.href.startsWith("http"));

  // 3. Perform GET requests (using a loop to avoid hitting rate limits too hard)
  for (const item of validUrls) {
    try {
      // Use Playwright's built-in request context
      const response = await page.request.get(item.href, {
        failOnStatusCode: false, // Prevents throwing if 404/500
      });
      item.status_code = response.status();

      // console.log(`Checked: ${item.status_code} - ${item.href}`);
    } catch (error) {
      // Treat error as 'any' to bypass the 'unknown' check
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      item.status_code = 0;
      console.error(`Error fetching ${item.href}:`, errorMessage);
    }
  }

  console.log("========== LINKS ==========");
  console.log("Number of a = " + urls.length);
  console.log("Number of LINKS = " + validUrls.length);
  validUrls.forEach((validUrl) => {
    console.log(validUrl.href);
    console.log(validUrl.status_code);
    console.log("----------");
  });
});
