import express from 'express'
import { validateResult } from '../controllers/validation.js';
import { details, signin, signout, signup } from '../controllers/user.js';
import { subtitleLanguages } from '../controllers/tools.js';
import { body } from 'express-validator';
import { deleteOne, viewAll } from '../controllers/favorite.js';
const router = express.Router();

const loginValidation = [
    body('password').isString().isLength({ min: 6, max: 20 }),
    body('username').isString().isLength({ min:3,max: 20 }),
]

const signupValidation = [
    body('password').isString().isLength({ min: 6, max: 20 }),
    body('confirmPassword').isString().isLength({ min: 6, max: 20 }),
    body('username').isString().isLength({ min:3,max: 20 }),
    body('email').isEmail(),
    body('subtitle').isString().isIn(subtitleLanguages),
]

router.post('/signin',loginValidation,validateResult,signin);
router.post('/signup',signupValidation,validateResult,signup);
router.use((req,res,next)=>{
    if(req.isAuthenticated()){
        next();
        return;
    }
    res.status(401).json({
        err: 'Authentication required.',statusCode: 401
    })
})
router.post("/signout",signout);
router.get('/',details);
router.get('/favorites',viewAll);
router.delete('/favorites/:id',deleteOne);
export default router;