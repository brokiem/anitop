import fetcher from "../utils/fetcher"
import cheerio from "cheerio"
import { TopAnime, DataError } from "../../types/common"
import {getInfoFromName} from 'mal-scraper'

const promises:Promise<any>[] = [];

const TopAnimeScrape = async (url: string) => {
    try{
        const getUrl = await fetcher(url)
        const response = getUrl

        if(response.status == 200) {
            const html = response.data
            const $ = cheerio.load(html)
            const listAnimes = $('.at-mcc-entry')

            listAnimes.each((_, el) => {
                const title: string = $(el).find('div.at-mcc-e-details > div.entry-title').text().trim()
                const imageUrl: string = $(el).find('div.at-mcc-e-details > div.at-mcc-e-thumbnail > img').attr('src')
                const studio: string = $(el).find('div.at-mcc-e-details > div.entry-detail').text().trim()
                const rank: number = +$(el).find('div.at-mcc-e-rank > div.main-rank').text().trim().replaceAll(' Vote', '')
                const peak: number = +$(el).find('div.at-mcc-e-movement > div.stats > div.peak.stats-entry > span').text().trim()
                let previously: string | number = $(el).find('div.at-mcc-e-movement > div.stats > div.prev.stats-entry > span').text().trim()
                previously = previously === '-' ? '-' : +previously
                const weeksOnTop: number = +$(el).find('div.at-mcc-e-movement > div.stats > div.weeks.stats-entry > span').text().trim()
                const status: string = $(el).find('div.at-mcc-e-movement > div.arrow-container > img').attr('alt')
                const stat: string = $(el).find('div.at-mcc-e-movement > div.arrow-number').text().trim()

                const containRoman = title.split(" ").pop().match('(?:X(?:X(?:V(?:I(?:I?I)?)?|X(?:I(?:I?I)?)?|I(?:[VX]|I?I)?)?|V(?:I(?:I?I)?)?|I(?:[VX]|I?I)?)?|V(?:I(?:I?I)?)?|I(?:[VX]|I?I)?)')

                if(containRoman !== null) {
                    const roman = containRoman[0]
                    const romanToNumber = romanToInt(roman)
                    const titleWithoutRoman = title.replace(roman, romanToNumber.toString())
                    const data = getInfoFromName(titleWithoutRoman)
                    promises.push(data)
                    return;
                }
                promises.push(getInfoFromName(title));
            })

            const data = await Promise.all(promises);

            return Promise.resolve(data)
        }
    }catch(e){
        return Promise.reject(e)
    }
}

const values = new Map([
    ['I', 1],
    ['V', 5],
    ['X', 10]
]);

const romanToInt = (string: string ) => {
    let result = 0, current, previous = 0;
    for (const char of string.split("").reverse()) {
        current = values.get(char);
        if (current >= previous) {
            result += current;
        } else {
            result -= current;
        }
        previous = current;
    }
    return result;
}

export default TopAnimeScrape