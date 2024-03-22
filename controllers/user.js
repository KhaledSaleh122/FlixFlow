import { User } from "../models/User.js";

export async function signin(req,res){
    const { username, password } = req.body;
    const user = new User({ username, password });
    const authenticate = User.authenticate();
    authenticate(username,password,
        (err,result)=>{
            if(err){
                res.status(400).json({
                    err: err.message || "Oops! Something went wrong during processing. Please try again."
                })
                return;
            }
            if(!result){
                res.status(401).json({
                    err: 'Invalid credentials. Please check your username and password and try again.',
                });
                return;
            }
            req.login(user,
                (err)=>{
                    if(err){
                        res.status(400).json({
                            err: err.message || "Oops! Something went wrong during processing. Please try again."
                        })
                        return;
                    }
                    res.sendStatus(200);
                    return;
                }
            )
        }
    )
}


export async function signup(req,res){
    const { username, password, confirmPassword, email, subtitle } = req.body;
    if (password !== confirmPassword) {
        res.status(400).json({
            err: "Password and confirm password don't match.",
        });
        return;
    }
    User.register({ username, email, subtitle },password,
        (err,user)=>{
            if (err) {
                res.status(400).json({
                    err: err.message || "Oops! Something went wrong during processing. Please try again."
                })
                return;
            }
            res.sendStatus(200);
            return;
        }
    )
}

export function details(req,res){
    const {username,subtitle,email} = req.user;
    res.status(200).json({username,subtitle,email});
}


export function signout(req,res){
    req.logOut((err)=>{
        if(err){
            res.status(400).json({
                err: err.message || "Oops! Something went wrong during processing. Please try again."
            })
            return;
        }
        res.clearCookie('session');
        res.sendStatus(200);
        return;
    })
}