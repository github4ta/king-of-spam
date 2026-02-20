import fs from "fs";
import path from "path";
import { expect } from "@playwright/test";
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
  paths,
  PageObject,
}) {
  const prodContext = await browser.newContext();
  const stageContext = await browser.newContext();

  const prodPage = await prodContext.newPage();
  const stagePage = await stageContext.newPage();

  const prod = new PageObject(prodPage);
  const stage = new PageObject(stagePage);

  await prod.open(productionUrl);
  await prod.clickAcceptCookieButton();
  await prod.scrollPage();
  const prodBuffer = await prodPage.screenshot({ fullPage: true });
  fs.writeFileSync(paths.production, prodBuffer);

  await stage.open(stagingUrl);
  await stage.clickAcceptCookieButton();
  await stage.scrollPage();
  const stageBuffer = await stagePage.screenshot({ fullPage: true });
  fs.writeFileSync(paths.staging, stageBuffer);

  await expect(stageBuffer).toMatchSnapshot(prodBuffer);

  await prodContext.close();
  await stageContext.close();
}
