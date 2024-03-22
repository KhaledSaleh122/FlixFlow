import { Favorite } from "../models/favorite.js";
import { errorHandler } from "./errors.js";
import { getMovieById } from "./movie.js";
import { isMediaIdExist } from "./tools.js";

export async function newFavorite(req,res){
    const {id} = req.params;
    const type = req.typeMedia
    const exists = await Favorite.exists({
        tmdbId : id,
        userId : req.user._id,
        type
    });
    if(exists){ res.sendStatus(200); return; }
    const response = await isMediaIdExist(id,type);
    if(response.err){ res.status(response.status).json({err: response.err}); return; }
    const media = response.data;
    if(!media){ res.status(500).json({err: "Oops! Something went wrong. Please try again."});return; }
    try {
        await Favorite.create({
            tmdbId : id,
            userId :  req.user._id,
            type,
            name: media.name || media.title,
            release_date : media.release_date,
            poster_path:  media.poster_path,
            original_language :  media.original_language
        });
        res.sendStatus(200);
        return;
    } catch (ex) {
        const error = errorHandler(ex);
        res.status(error.err_status_code).json(error);
        return;
    }
}


export async function viewAll(req,res){
    try {
        const Favorites = await Favorite.find({
            userId:  req.user._id
        });
        res.status(200).json({
            result: Favorites
        })
        return;
    } catch (ex) {
        const error = errorHandler(ex);
        res.status(error.err_status_code).json(error);
        return;
    }
}


export async function deleteOne(req,res){
    const {id} = req.params;
    try {
        const query = await Favorite.deleteOne({
            userId : req.user._id,
            _id:id
        }).exec();
        if(query.deletedCount < 1){
            res.status(500).json({
                err: "Oops! Something went wrong. Please try again."
            })
            return;
        }
        res.sendStatus(200);
        return;
    } catch (ex) {
        const error = errorHandler(ex);
        res.status(error.err_status_code).json(error);
        return;
    }
}
