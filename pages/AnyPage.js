import { button_accept_cookie } from "../constants/constants";
export class AnyPage {
  constructor(page) {
    this.page = page;
    this.acceptCookieButton = page.locator(button_accept_cookie);
  }

  async open(url) {
    await this.page.goto(url, {
      waitUntil: "networkidle",
    });
  }

  async clickAcceptCookieButton() {
    let visibleCookie = await this.acceptCookieButton.isVisible();
    if (visibleCookie) {
      await this.acceptCookieButton.click();
    }
  }

  async scrollPage() {
    const screenHeight = 700;
    const scrollStep = 500;
    const scrollDelay = 200;

    const scrollHeight = await this.page.evaluate(
      () => document.body.scrollHeight,
    );
    console.log("Scroll HEIGHT = " + scrollHeight);

    const scrollTimes = Math.floor(scrollHeight / AnyPage.screenHeight);
    console.log("Scroll TIMES = " + scrollTimes);

    for (let i = 1; i < scrollTimes; i++) {
      console.log(
        "i = " + i + " - " + (i <= scrollTimes) + " -> " + scrollTimes,
      );
      await this.page.evaluate((step) => {
        window.scrollBy(
          {
            top: step,
            behavior: "smooth",
          },
          scrollStep,
        );
      });
    }
    console.log("Pages Scrolled");

    await this.page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await this.page.waitForTimeout(scrollDelay);

    console.log("Pages Scrolled to Top");
    await this.page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    await this.page.waitForTimeout(scrollDelay);
  }

  async doScreenshot(path) {
    await this.page.screenshot({
      path: path,
      fullPage: true,
    });
  }

  async openPageAndDoSnapshot(url) {
    console.log(url);

    await this.open(url);
    await this.scrollPage();
  }
}

module.exports = { AnyPage };
