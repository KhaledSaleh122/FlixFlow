import { APIKEY, tmdbURL } from "../config/config.js";
import { errorHandler } from "./errors.js";
import { addGenreNameAlongWithId } from "./tools.js";
import axios from 'axios'

export async function search(req,res){
    const {q,page} = req.query;
    const url = new URLSearchParams();
    url.append("api_key",APIKEY);
    url.append("include_adult","false");
    url.append("include_video","true");
    url.append("page", page || 1);
    url.append("query", q || "");
    const endpoint = `search/multi?${url.toString()}`
    try {
        const response = await axios.get(tmdbURL+endpoint);
        response.data.results = response.data.results.filter((el)=>el.media_type === "tv" || el.media_type === "movie");
        addGenreNameAlongWithId(response);
        res.status(200).json(
            {
                result: response.data.results,
                total_pages: response.data.total_pages,
                total_results: response.data.total_results,
                page: response.data.page
            }
        );
    } catch (ex) {
        console.log(ex);
        const error = errorHandler(ex.response|| ex.request||ex);
        res.status(error.err_status_code).json(error);
    }
}
