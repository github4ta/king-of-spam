import { BUTTON_ACCEPT_COOKIE } from "../constants/constants";
export class AnyPage {
  constructor(page) {
    this.page = page;
    this.acceptCookieButton = page.locator(BUTTON_ACCEPT_COOKIE);
  }

  async open(url) {
    await this.page.goto(url, {
      waitUntil: "networkidle",
    });
  }

  async clickAcceptCookieButton() {
    try {
      await this.page.waitForSelector("#ccc-notify-accept", {
        timeout: 10000,
        state: "visible",
      });

      await this.page.click("#ccc-notify-accept");
      await this.page.waitForTimeout(1000);
    } catch {
      console.log("Cookie button not found");
    }
  }

  async scrollPage() {
    await this.page.evaluate(async () => {
      const scrollStep = 500;
      const scrollHeight = document.body.scrollHeight;

      for (let i = 0; i < scrollHeight; i += scrollStep) {
        window.scrollBy(0, scrollStep);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      window.scrollTo(0, 0);
    });
  }

  // async scrollPage() {
  //   const screenHeight = 700;
  //   const scrollStep = 500;
  //   const scrollDelay = 200;

  //   const scrollHeight = await this.page.evaluate(
  //     () => document.body.scrollHeight,
  //   );
  //   console.log("Scroll HEIGHT = " + scrollHeight);

  //   const scrollTimes = Math.floor(scrollHeight / screenHeight);
  //   console.log("Scroll TIMES = " + scrollTimes);

  //   for (let i = 1; i < scrollTimes; i++) {
  //     console.log(
  //       "i = " + i + " - " + (i <= scrollTimes) + " -> " + scrollTimes,
  //     );
  //     await this.page.evaluate((step) => {
  //       window.scrollBy(
  //         {
  //           top: step,
  //           behavior: "smooth",
  //         },
  //         scrollStep,
  //       );
  //     });
  //   }
  //   console.log("Pages Scrolled");

  //   await this.page.evaluate(() => {
  //     window.scrollTo(0, document.body.scrollHeight);
  //   });
  //   await this.page.waitForTimeout(scrollDelay);

  //   console.log("Pages Scrolled to Top");
  //   await this.page.evaluate(() => {
  //     window.scrollTo(0, 0);
  //   });
  //   await this.page.waitForTimeout(scrollDelay);
  // }

  async doScreenshot(path) {
    await this.page.screenshot({
      path: path,
      fullPage: true,
    });
  }

  async openPageAndDoSnapshot(url) {
    console.log(url);

    await this.open(url);
    await this.clickAcceptCookieButton();
    await this.scrollPage();
  }
}

module.exports = { AnyPage };
