import { test } from "@playwright/test";
import { LANGS } from "../../constants/constants.js";
import {
  buildUrl,
  getSnapshotPaths,
  compareEnvs,
} from "../../helpers/helpers.js";
import { AnyPage } from "../../pages/AnyPage.js";

const pageKey = "contact";

test.describe(`${pageKey} prod vs stage`, () => {
  for (const lang of Object.keys(LANGS)) {
    test(`lang: ${lang}`, async ({ browser }, testInfo) => {
      const device = testInfo.project.name.split("-")[1];

      const productionUrl = buildUrl("production", pageKey, lang);
      const stagingUrl = buildUrl("staging", pageKey, lang);

      const paths = getSnapshotPaths({ lang, device, pageKey });

      await compareEnvs({
        browser,
        productionUrl,
        stagingUrl,
        paths,
        PageObject: AnyPage,
      });
    });
  }
});
