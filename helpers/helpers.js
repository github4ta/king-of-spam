import path from "path";
import fs from "fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { LANGS, PAGES, BASE_URLS } from "../constants/constants.js";

export function buildUrl(env, pageKey, lang) {
  return `${BASE_URLS[env]}${LANGS[lang]}${PAGES[pageKey][lang]}`;
}

export function getSnapshotPaths({ lang, device, pageKey }) {
  const dir = path.join("snapshots", lang, device, pageKey);
  fs.mkdirSync(dir, { recursive: true });

  return {
    production: path.join(dir, "production.png"),
    staging: path.join(dir, "staging.png"),
    diff: path.join(dir, "diff.png"),
  };
}

export async function compareEnvs({
  browser,
  productionUrl,
  stagingUrl,
  lang,
  device,
  pageKey,
  PageObject,
}) {
  const { production, staging, diff } = getSnapshotPaths({
    lang,
    device,
    pageKey,
  });

  // ---------- PRODUCTION ----------
  const prodContext = await browser.newContext();
  const prodPage = await prodContext.newPage();
  const prodObj = new PageObject(prodPage);

  await prodObj.openPageAndDoSnapshot(productionUrl);
  await prodObj.doScreenshot(production);

  await prodContext.close();

  // ---------- STAGING ----------
  const stageContext = await browser.newContext();
  const stagePage = await stageContext.newPage();
  const stageObj = new PageObject(stagePage);

  await stageObj.openPageAndDoSnapshot(stagingUrl);
  await stageObj.doScreenshot(staging);

  await stageContext.close();

  // ---------- COMPARE ----------
  const prodImage = PNG.sync.read(fs.readFileSync(production));
  const stageImage = PNG.sync.read(fs.readFileSync(staging));

  if (
    prodImage.width !== stageImage.width ||
    prodImage.height !== stageImage.height
  ) {
    throw new Error("Images have different sizes");
  }

  const { width, height } = prodImage;
  const diffImage = new PNG({ width, height });

  const mismatchPixels = pixelmatch(
    prodImage.data,
    stageImage.data,
    diffImage.data,
    width,
    height,
    {
      threshold: 0.15,
      includeAA: false,
    },
  );

  const totalPixels = width * height;
  const diffPercent = (mismatchPixels / totalPixels) * 100;

  const allowedThreshold = 0.3; // допустимые 0.3%

  if (diffPercent > allowedThreshold) {
    fs.writeFileSync(diff, PNG.sync.write(diffImage));

    throw new Error(
      `Visual difference detected: ${mismatchPixels} pixels (${diffPercent.toFixed(
        2,
      )}%) differ`,
    );
  }
}

// export function buildUrl(env, pageKey, lang) {
//   return `${BASE_URLS[env]}${LANGS[lang]}${PAGES[pageKey][lang]}`;
// }

// export function getSnapshotPaths({ lang, device, pageKey }) {
//   const dir = path.join("snapshots", lang, device, pageKey);
//   fs.mkdirSync(dir, { recursive: true });

//   return {
//     production: path.join(dir, "production.png"),
//     staging: path.join(dir, "staging.png"),
//   };
// }

// export async function compareEnvs({
//   browser,
//   productionUrl,
//   stagingUrl,
//   lang,
//   device,
//   pageKey,
//   PageObject,
// }) {
//   const dir = path.join("snapshots", lang, device, pageKey);
//   fs.mkdirSync(dir, { recursive: true });

//   const productionPath = path.join(dir, "production.png");
//   const stagingPath = path.join(dir, "staging.png");
//   const diffPath = path.join(dir, "diff.png");

//   // PRODUCTION
//   const prodContext = await browser.newContext();
//   const prodPage = await prodContext.newPage();
//   const prodObj = new PageObject(prodPage);

//   await prodObj.openPageAndDoSnapshot(productionUrl);
//   await prodObj.doScreenshot(productionPath);

//   await prodContext.close();

//   // STAGING
//   const stageContext = await browser.newContext();
//   const stagePage = await stageContext.newPage();
//   const stageObj = new PageObject(stagePage);

//   await stageObj.openPageAndDoSnapshot(stagingUrl);
//   await stageObj.doScreenshot(stagingPath);

//   await stageContext.close();

//   // COMPARE
//   const prodBuffer = fs.readFileSync(productionPath);
//   const stageBuffer = fs.readFileSync(stagingPath);

//   if (!prodBuffer.equals(stageBuffer)) {
//     fs.copyFileSync(stagingPath, diffPath);
//     throw new Error("Visual difference detected");
//   }
// }
