import { test, expect } from "@playwright/test";
import { AnyPage } from "../../pages/AnyPage.js";
import { LANGS } from "../../constants/constants.js";
import { buildPath, buildSnapshotPath } from "../../helpers/helpers.js";

const pageKey = "contact";

test.describe(`${pageKey} page screenshot`, () => {
  for (const lang of Object.keys(LANGS)) {
    test(`lang: ${lang}`, async ({ page }, testInfo) => {
      const [env, device] = testInfo.project.name.split("-");

      testInfo.title = `${pageKey} | lang: ${lang} | device: ${device} | env: ${env}`;

      const anyPage = new AnyPage(page);
      const path = buildPath(pageKey, lang);

      const screenshotPath = buildSnapshotPath({
        lang,
        device,
        pageKey,
        env,
      });

      await anyPage.open(path);
      await anyPage.clickAcceptCookieButton();
      await anyPage.scrollPage();

      await expect(page).toHaveScreenshot(screenshotPath, {
        fullPage: true,
      });
    });
  }
});
