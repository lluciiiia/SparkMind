import puppeteer from 'puppeteer';

export class Scraper {
  private constructor(private readonly url: string) {}

  public static async run(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    await browser.close();
  }

  public static async runWithSelector(url: string, selector: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const element = await page.$(selector);
    await element?.screenshot({ path: 'screenshot.png' });
    await browser.close();
  }
}
