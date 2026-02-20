import fs from "fs";
import path from "path";
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
  const dir = path.join("snapshots", lang, device, pageKey);
  fs.mkdirSync(dir, { recursive: true });

  const productionPath = path.join(dir, "production.png");
  const stagingPath = path.join(dir, "staging.png");
  const diffPath = path.join(dir, "diff.png");

  // PRODUCTION
  const prodContext = await browser.newContext();
  const prodPage = await prodContext.newPage();
  const prodObj = new PageObject(prodPage);

  await prodObj.openPageAndDoSnapshot(productionUrl);
  await prodObj.doScreenshot(productionPath);

  await prodContext.close();

  // STAGING
  const stageContext = await browser.newContext();
  const stagePage = await stageContext.newPage();
  const stageObj = new PageObject(stagePage);

  await stageObj.openPageAndDoSnapshot(stagingUrl);
  await stageObj.doScreenshot(stagingPath);

  await stageContext.close();

  // COMPARE
  const prodBuffer = fs.readFileSync(productionPath);
  const stageBuffer = fs.readFileSync(stagingPath);

  if (!prodBuffer.equals(stageBuffer)) {
    fs.copyFileSync(stagingPath, diffPath);
    throw new Error("Visual difference detected");
  }
}
