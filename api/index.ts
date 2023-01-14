import { NowResponse } from "@vercel/node"

type characters = {
    maleCharacter: String,
    femaleCharacter: String
}
type ostSongs = {
    openingSong: String,
    endingSong: String
}
type listApi = {
    musicChart: String,
    coupleShip: String,
    characters: characters,
    ostSongs: ostSongs,
    topAnime: String
}
interface Data {
    listApi: listApi,
    author: String,
    note: String,
    source: String
}

export default (_, response: NowResponse) => {
    const data: Data = {
        listApi: {
            musicChart: "https://anitop-brokiem.vercel.app/api/v1/music-chart",
            coupleShip: "https://anitop-brokiem.vercel.app/api/v1/couple-ship",
            characters: {
                maleCharacter: "https://anitop-brokiem.vercel.app/api/v1/male-character",
                femaleCharacter: "https://anitop-brokiem.vercel.app/api/v1/female-character"
            },
            ostSongs: {
                openingSong: "https://anitop-brokiem.vercel.app/api/v1/opening-song",
                endingSong: "https://anitop-brokiem.vercel.app/api/v1/ending-song"
            },
            topAnime: "https://anitop-brokiem.vercel.app/api/v1/top-anime"
        },
        note: "Every endpoint API has a query params named limit and type data of limit is number",
        author: "",
        source: ""
    }

    response.status(200).send(data)
}