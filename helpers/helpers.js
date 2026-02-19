import { LANGS, PAGES } from "../constants/constants";

export function buildPath(pageKey, lang) {
  return `${LANGS[lang]}${PAGES[pageKey][lang]}`;
}

export function buildSnapshotPath({ lang, device, pageKey, env }) {
  return [lang, device, pageKey, env, `${pageKey}.png`];
}

// module.exports = { buildPath, buildSnapshotPath };
/**
 * ===================== HOW TO RUN TESTS =====================
 *
 * 1. First run (create baseline screenshots):
 *    npx playwright test --project=prod-desktop --update-snapshots
 *    → Creates folders in /snapshots
 *    → Saves baseline screenshots
 *    → Overwrites existing baselines
 *
 * 2. Regular run (comparison mode):
 *    npx playwright test --project=prod-desktop
 *    → Does NOT overwrite screenshots
 *    → Compares current UI with baseline
 *    → If different → test fails
 *    → Diff images saved in /test-results
 *
 * 3. Stage verification:
 *    npx playwright test --project=stage-desktop
 *    → Uses the same baseline as prod
 *    → Compares stage against prod baseline
 *    → Baseline is NOT modified
 *
 * IMPORTANT:
 * --update-snapshots should be used ONLY for prod.
 * Never update snapshots from stage.
 *
 * Snapshots structure:
 * snapshots/{lang}/{device}/{pageKey}/{file}.png
 * snapshots/
 └── pl/
     └── desktop/
         └── contact/
             ├── prod/
             └── stage/

 * ============================================================
 */
