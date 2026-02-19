export class AnyPage {

    time_to_wait = 200;
    screen_height = 700;

    constructor(page, url) {
        this.url = url;
        this.page = page;
        this.acceptCookieButton = page.locator('#ccc-notify-accept');
    }

    async open() {
        await this.page.goto(this.url, {
            waitUntil: 'networkidle'
        });

        await this.page.waitForTimeout(this.time_to_wait);
    }

    async clickAcceptCookieButton() {
        await this.acceptCookieButton.click();

        await this.page.waitForTimeout(this.time_to_wait);
    }

    async scrollPage() {
        const scrollHeight = await this.page.evaluate(() => document.body.scrollHeight);
        console.log("Scroll HEIGHT = " + scrollHeight);
        const scrollTimes = Number.parseInt(scrollHeight / this.screen_height);
        console.log("Scroll TIMES = " + scrollTimes);

        for (var i = 1; i < scrollTimes; i++) {
            console.log("i = " + i + " - " + (i <= scrollTimes) + " -> " + scrollTimes);
            await this.page.evaluate(() => {
                window.scrollBy({
                    top: 500,
                    behavior: 'smooth'
                });
            });
            await this.page.waitForTimeout(this.time_to_wait);
        }

        console.log("Pages Scrolled");
        await this.page.evaluate(async () => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        await this.page.waitForTimeout(this.time_to_wait);

        console.log("Pages Scrolled to Top");
        await this.page.evaluate(async () => {
            window.scrollTo(0, 0);
        });

        await this.page.waitForTimeout(this.time_to_wait);
    }

    async doScreenshot(path) {
        await this.page.screenshot({
            path: path,
            fullPage: true
        });
    }

    async openPageAndDoSnapshot() {
        console.log(this.url);

        await this.open(this.url);
        await this.scrollPage();

        if (this.url.startsWith('https://www')) {
            await this.doScreenshot('snapshots/prod/fullpage.png');
        }

        if (this.url.startsWith('https://stage')) {
            await this.doScreenshot('snapshots/stage/fullpage.png');
        }
    }
}
