import express from 'express'
import { validateResult } from '../controllers/validation.js';
import { body, param } from 'express-validator';
import { newFavorite } from '../controllers/favorite.js';
const router = express.Router();

router.use((req,res,next)=>{
    if(req.isAuthenticated()){
        next();
        return;
    }
    res.status(401).json({
        err: 'Authentication required.',err_status_code: 401
    })
})

const newFavoriteValidator = [
    param('id').exists().isInt().toInt(),
]

router.post('/:id/favorite',newFavoriteValidator,validateResult,newFavorite);
export default router;