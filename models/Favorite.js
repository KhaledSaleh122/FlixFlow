import mongoose from "mongoose"

export const favSchema = new mongoose.Schema({
    tmdbId: String,
    userId: {type : String,ref : 'User'},
    type : String,
    name:String,
    release_date:Date,
    poster_path:String,
    original_language:String
});


export const Favorite = new mongoose.model("favorite", favSchema);