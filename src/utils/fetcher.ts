import puppeteer from 'puppeteer';

const fetcher = async (url: string) => {
    const browser = await puppeteer.launch()

    const page = await browser.newPage()
    await page.goto(url)
    await page.waitForSelector('.at-mcc-entry', { timeout: 10000 });

    const content = await page.content()

    console.log(content)

    await browser.close();

    const response = {
        status: 200,
        data: content
    }

    return Promise.resolve(response)
}
export default fetcher