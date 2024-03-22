import dotenv from 'dotenv'
import { APIKEY, tmdbURL } from '../config/config.js';
import { errorHandler } from './errors.js';
import axios from 'axios';
import { getTVGenreName } from './tools.js';
dotenv.config();


export async function viewOne(req,res){
    const {id} = req.params;
    try {
        const response = await getTVShowById(id);
        addGenreNameAlongWithId(response);
        res.status(200).json(
            {
                result: response.data,
            }
        );
    } catch (ex) {
        const error = errorHandler(ex.response|| ex.request);
        res.status(error.err_status_code).json(error);
    }
}

function getTVShowQueryUrl(){
    const url = new URLSearchParams();
    url.append("api_key",APIKEY);
    url.append("include_adult","false");
    url.append("include_video","true");
    return url;
}

export async function getTVShowById(id){
    try {
        const endpoint = `tv/${id}?${getTVShowQueryUrl().toString()}`
        return await axios.get(tmdbURL+endpoint);
    } catch (ex) {
        throw ex
    }
}

export async function viewSimilar(req,res){
    const {id} = req.params;
    const {page} = req.query;
    const url = new URLSearchParams();
    url.append("api_key",APIKEY);
    url.append("include_adult","false");
    url.append("include_video","true");
    url.append("page", page || 1);
    const endpoint = `tv/${id}/recommendations?${url.toString()}`
    try {
        const response = await axios.get(tmdbURL+endpoint);
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
        const error = errorHandler(ex.response|| ex.request);
        res.status(error.err_status_code).json(error);
    }
}


export async function viewTrending(req,res){
    const {page} = req.query;
    const url = new URLSearchParams();
    url.append("api_key",APIKEY);
    url.append("page", page || 1);
    url.append("include_adult","false");
    url.append("include_video","true");
    const endpoint = `trending/tv/day?${url.toString()}`
    try {
        const response = await axios.get(tmdbURL+endpoint);
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
        const error =  errorHandler(ex);
        res.status(error.err_status_code).json(error);
    }
}

export async function viewTopRated(req,res){
    const {page} = req.query;
    const url = new URLSearchParams();
    url.append("api_key",APIKEY);
    url.append("page", page || 1);
    url.append("include_adult","false");
    url.append("include_video","true");
    const endpoint = `tv/top_rated?${url.toString()}`
    try {
        const response = await axios.get(tmdbURL+endpoint);
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
        const error =  errorHandler(ex);
        res.status(error.err_status_code).json(error);
    }
}

export async function viewAll(req,res){
    const {page,genres,vote_avg_range,max_release_data,lowest_release_data,origin_country,sort} = req.query;
    const url = new URLSearchParams();
    url.append("include_adult","false");
    url.append("include_video","true");
    url.append("vote_average.lte","9.8");
    url.append("without_poster","false");
    url.append("min_vote_avaragre",vote_avg_range || 2);
    url.append("page", page || 1);
    url.append("sort_by",sort || "popularity.desc");
    url.append("api_key",APIKEY);
    if(genres)url.set("with_genres",genres);
    if(origin_country)url.append("with_original_language",origin_country);
    if(max_release_data)url.append("release_date.lte",max_release_data)
    if(lowest_release_data)url.append("release_date.gte",lowest_release_data)
    const endpoint = `discover/tv?${url.toString()}`
    try {
        const response = await axios.get(tmdbURL+endpoint);
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
        const error =  errorHandler(ex);
        res.status(error.err_status_code).json(error);
    }
}

const addGenreNameAlongWithId = (response) =>{
    if(response.data.results){
        for (var item of response.data.results){
            if(item.genre_ids){
                item.genre_ids = item.genre_ids.map( (genreid) => {return {id : genreid,name : getTVGenreName(genreid)}});
            }
        }
    }else if(response.data.id){
        response.data.genre_ids = response.data.genres;
    }
}