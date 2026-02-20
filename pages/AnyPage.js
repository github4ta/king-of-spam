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
    await this.waitForFonts();
    await this.disableAnimations();
    await this.scrollPage();
    await this.hideDynamicElements();
    await this.page.waitForTimeout(300);

    // await this.open(url);
    // await this.clickAcceptCookieButton();
    // await this.scrollPage();
  }

  async disableAnimations() {
    await this.page.addStyleTag({
      content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `,
    });
  }
  async hideDynamicElements() {
    await this.page.addStyleTag({
      content: `
      .swiper,
      .slider,
      .carousel,
      video,
      iframe,
      [data-dynamic] {
        visibility: hidden !important;
      }
    `,
    });
  }

  async waitForFonts() {
    await this.page.evaluateHandle("document.fonts.ready");
  }
}

module.exports = { AnyPage };
