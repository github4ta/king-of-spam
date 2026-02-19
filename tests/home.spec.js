import { test, expect } from '@playwright/test';
import { AnyPage } from '../pages/AnyPage.js';

const prodUrl = 'https://www.kingspan.com/pl/pl/kontakt/';
const stageUrl = 'https://stage.kingspan.com/pl/pl/kontakt/';

test('home page pl', async ({ page }) => {
    test.setTimeout(600000);

    const prodPage = new AnyPage(page, prodUrl);
    await prodPage.openPageAndDoSnapshot();

    const stagePage = new AnyPage(page, stageUrl);
    await stagePage.openPageAndDoSnapshot();

    await expect(page).toHaveScreenshot('fullpage.png', {
        fullPage: true,
        threshold: 0.2,
    });
});
