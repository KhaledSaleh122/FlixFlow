import express from 'express';
import {viewAll, viewOne, viewSimilar, viewTopRated, viewTrending} from '../controllers/tv.js'
import { param, query } from 'express-validator';
import { validateResult } from '../controllers/validation.js';
import favoriteRouter from './favorite.js'
const router  = express.Router();



const trendingValidator = [
    query("page").optional().default(1).toInt().isInt({min:1,max:500})
]

const topRatedValidator = [
    query("page").optional().default(1).toInt().isInt({min:1,max:500})
]

const viewOneValidator = [
    param("id").exists().toInt().isInt()
]

const viewSimilarValidator = [
    param("id").exists().toInt().isInt(),
    query("page").optional().default(1).toInt().isInt({min:1,max:500}),
]

const viewAllValidator = [
    query("page").optional().default(1).toInt().isInt({min:1,max:500}),
    query("genres").optional(),
    query("vote_avg_range").optional().default(2).toInt().isInt({min:2,max:9}),
    query("max_release_data").optional().default(new Date()).toDate().isDate(),
    query("lowest_release_data").optional().default(new Date("2024-03-01")).toDate().isDate(),
    query("origin_country").optional().default("US"),
    query("sort").optional().default("popularity.desc")
]
router.get("/",viewAllValidator,validateResult,viewAll);
router.get("/trending",trendingValidator,validateResult,viewTrending);
router.get("/top_rated",topRatedValidator,validateResult,viewTopRated)
router.get("/:id",viewOneValidator,validateResult,viewOne);
router.get("/:id/similar",viewSimilarValidator,validateResult,viewSimilar);
router.use((req,res,next)=>{
    req.typeMedia = "tv";
    next();
})
router.use('/',favoriteRouter);

export default router;