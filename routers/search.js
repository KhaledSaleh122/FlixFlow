import express from 'express';
import { validateResult } from '../controllers/validation.js';
import { search } from '../controllers/search.js';
import { query } from 'express-validator';
const router  = express.Router();

const searchValidator = [
    query("page").optional().default(1).toInt().isInt({min:1,max:500}),
    query("q").optional()
]
router.get('/',searchValidator,validateResult,search)

export default router;