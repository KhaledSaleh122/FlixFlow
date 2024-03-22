import { errorHandler } from "./errors.js";
import { getMovieById } from "./movie.js";
import { getTVShowById } from "./tv.js";

export const genreMovie = [{ "id": 28, "name": "Action" }, { "id": 12, "name": "Adventure" }, { "id": 16, "name": "Animation" }, { "id": 35, "name": "Comedy" }, { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" }, { "id": 18, "name": "Drama" }, { "id": 10751, "name": "Family" }, { "id": 14, "name": "Fantasy" }, { "id": 36, "name": "History" }, { "id": 27, "name": "Horror" }, { "id": 10402, "name": "Music" }, { "id": 9648, "name": "Mystery" }, { "id": 10749, "name": "Romance" }, { "id": 878, "name": "Science Fiction" }, { "id": 10770, "name": "movie Movie" }, { "id": 53, "name": "Thriller" }, { "id": 10752, "name": "War" }, { "id": 37, "name": "Western" }];

export function getMovieGenreName(id) {
    return (genreMovie.find((item) => item.id === id)).name || ''
}

export const genreTV = [{ "id": 10759, "name": "Action & Adventure" }, { "id": 16, "name": "Animation" }, { "id": 35, "name": "Comedy" }, { "id": 80, "name": "Crime" }, { "id": 99, "name": "Documentary" }, { "id": 18, "name": "Drama" }, { "id": 10751, "name": "Family" }, { "id": 10762, "name": "Kids" }, { "id": 9648, "name": "Mystery" }, { "id": 10763, "name": "News" }, { "id": 10764, "name": "Reality" }, { "id": 10765, "name": "Sci-Fi & Fantasy" }, { "id": 10766, "name": "Soap" }, { "id": 10767, "name": "Talk" }, { "id": 10768, "name": "War & Politics" }, { "id": 37, "name": "Western" }]

export function getTVGenreName(id) {
    return (genreTV.find((item) => item.id === id)).name || '';
}


export function getGenreName(id,type) {
    return type === "tv"? getTVGenreName(id) : getMovieGenreName(id);
}

export const addGenreNameAlongWithId = (response) =>{
    if(response.data.results){
        for (var item of response.data.results){
            if(item.genre_ids){
                item.genre_ids = item.genre_ids.map( (genreid) => {return {id : genreid,name : getGenreName(genreid,item.media_type)}});
            }
        }
    }else if(response.data.id){
        response.data.genre_ids = response.data.genres;
    }
}

export async function isMediaIdExist(id,type){
    try {
        return type === "movie" ? await getMovieById(id) : await getTVShowById(id);
    } catch (ex) {
        const error = errorHandler(ex.response|| ex.request);
        if(error.err_status_code === 404){
            return {err: "Please ensure that the ID is accurate.",status:400};
        }
        return {err: "Oops! Something went wrong. Please try again.",status:500};
    }
}

export const subtitleLanguages = [
    "Albanian",
    "Arabic",
    "Bengali",
    "Brazillian Portuguese",
    "Bulgarian",
    "Burmese",
    "Chinese BG code",
    "Croatian",
    "Czech",
    "Danish",
    "Dutch",
    "English",
    "Estonian",
    "Farsi/Persian",
    "Finnish",
    "French",
    "German",
    "Greek",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Icelandic",
    "Indonesian",
    "Italian",
    "Japanese",
    "Korean",
    "Latvian",
    "Lithuanian",
    "Macedonian",
    "Malay",
    "Norwegian",
    "Polish",
    "Portuguese",
    "Romanian",
    "Russian",
    "Serbian",
    "Sinhala",
    "Slovak",
    "Slovenian",
    "Spanish",
    "Swedish",
    "Tagalog",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Urdu",
    "Vietnamese",
];