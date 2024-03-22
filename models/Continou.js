import mongoose from "mongoose"

export const conSchema = new mongoose.Schema({
    tmdbId: Number,
    userId: {type : String,ref : 'User'},
    type : String,
    time : {type : Number,default : 0},
    episode : {type : Number,default : 0},
    season : {type : Number,default : 0},
    name: String,
    release_date:Date,
    poster_path:String,
    original_language:String
});


export default Continuo = new mongoose.model("continou", conSchema);