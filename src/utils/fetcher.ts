import axios, { AxiosRequestConfig } from "axios";
import edgeChromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';

const axiosInstance = axios.create()
const fetcher = async (url: string) => {
    const executablePath = await edgeChromium.executablePath;

    const browser = await puppeteer.launch({
        executablePath,
        args: edgeChromium.args,
        headless: false,
    })

    const page = await browser.newPage()
    await page.goto(url)

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