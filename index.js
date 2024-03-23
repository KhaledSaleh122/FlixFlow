import express from "express";
import mongoose from "mongoose"
import session from 'express-session'
import passport from 'passport'
import { User } from "./models/User.js";
import MongoStore from 'connect-mongo';
import cors from 'cors'
import { createServer } from "http";
import { corsOptions } from "./cors.js";
import cookieParser from 'cookie-parser'
import { socketEstablishConnection } from "./controllers/socket.js";
import dotenv from 'dotenv'
dotenv.config();
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

//MongoDB connection
await mongoose.connect(process.env.MONGODB_LINK)
    .then(async () => { console.log('Database connected ✔'); }).catch(err => { throw err; });

const app = express();
const httpServer = createServer(app);
socketEstablishConnection(httpServer);
httpServer.listen(process.env.SERVERPORT, () => { console.log(`Server Started  on port ${process.env.SERVERPORT} ✔`); });

app.use(express.static('dist'));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    name: "session",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // Set session expiration time to mounth hour (in milliseconds)
        secure: false,
        httpOnly: true
    },
    store : MongoStore.create({mongoUrl:process.env.MONGODB_LINK})
}))

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

import movieRouter from './routers/movie.js'
import tvshowRouter from './routers/tv.js'
import searchRouter from './routers/search.js'
import accountRouter from './routers/user.js'

const baseRoute = express.Router();
app.use("/api/v1",baseRoute);
//app.use(saveContinouWatch);
//baseRoute.use('/f',videoRouter)
baseRoute.use("/movies",movieRouter);
baseRoute.use("/tv-shows",tvshowRouter);
baseRoute.use("/search",searchRouter);
// baseRoute.use('/s',subRouter)
baseRoute.use("/user",accountRouter);

baseRoute.use("/flixflow-extension",(req,res)=>{
    res.sendFile(__dirname+"/FF-extension.rar",{
        headers: {
            'Content-Type': 'application/x-rar-compressed',
            'Content-Disposition': 'attachment; filename=flixflow-extension.rar'
        }
    });
})

app.use(function (req, res, next) {
    res.sendFile(__dirname+'/dist/index.html');
});


