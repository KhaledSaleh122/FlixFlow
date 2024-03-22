import { validationResult } from "express-validator";

export function validateResult (req,res,next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(400).json({ err: `${result.array()[0].path} : ${result.array()[0].msg}` });
        return;
    }
    next();
}
