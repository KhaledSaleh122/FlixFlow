import { Server } from "socket.io";
import dotenv from 'dotenv'
dotenv.config();
const rateLimitWindowMs = 60 * 1000;
const rateLimitMaxRequests = 170;
const rooms = {};
const emitCounts = {};
export const socketEstablishConnection = (server) =>{
    const io = new Server(server, {
        cors: {
          origin: `${process.env.SERVERURL}:${process.env.PORT}`,
          methods: ['GET', 'POST'],
        }
    });
    io.on("connection", (socket) => {
        socket.on("IsAuthenticated",(user)=>{ isAuthenticated(user,socket);});
        socket.on("JoinRoom",(action)=>{ joinRoom(action,socket,io);})
        socket.on("UpdateData",(action)=>{updateRoomData(action,socket,io)});
        socket.on('collect_can_play',(action)=>{collectReadyHandler(action,socket,io)});
        socket.on('change_video_state',(action)=>{newStateHandler(action,socket,io)});
        socket.on('disconnect', () => {
            if(!socket.roomId || !socket.auth)return;
            setTimeout(() => {
                const room = io.sockets.adapter.rooms.get(socket.roomId);
                if (!room || (room && room.size <= 0)) {
                  delete rooms[socket.roomId];
                  console.log(`room ${socket.roomId} deleted duo no user in it`);
                }
            }, 60000 * 3)
            if (emitCounts[socket.user.username]) {
                console.log('user data removed');
                delete emitCounts[socket.user.username];
            }
        })
    })
}

function limitRequests(emitCounts,socket){
    const username = socket.user.username;
    const currentTime = Date.now();
    const elapsedTime = currentTime - emitCounts[username].timestamp;
    if (elapsedTime <= rateLimitWindowMs && emitCounts[username].count > rateLimitMaxRequests) {
        sendMessage(socket,"You sending too many requests, You will be redirected to home.",true,true);
        return;
    }
    if (elapsedTime > rateLimitWindowMs) {
        emitCounts[username].count = 1;
        emitCounts[username].timestamp = currentTime;
      }
}

function userInfoSaver(emitCounts,socket,io){
    const username = socket.user.username;
    if (!emitCounts[username]) {
        emitCounts[username] = {
            name: username,
            count: 0,
            timestamp: Date.now(),
            socketId: socket.id
        };
    }else{
        io.to(emitCounts[socket.user.username].socketId).emit('Message',{ 
            message: "You already connected to other room, You will be redirected to home.",
            error:true,
            redirect: true 
        });
        sendMessage(socket,"You already connected to other room, You will be redirected to home.",true,true);
    }
}

function newStateHandler(info,socket,io){
    checkConnection(socket,()=>{
        limitRequests(emitCounts,socket);
        io.to(socket.roomId).emit('new_video_state', info);
    })
}
function collectReadyHandler(info,socket,io){
    checkConnection(socket,()=>{
        limitRequests(emitCounts,socket);
        const room = io.sockets.adapter.rooms.get(socket.roomId);
        const numUsersInRoom = room ? room.size : 0;
        io.to(socket.roomId).emit('new_video_state_check_all_ready', { id: info.id, users: numUsersInRoom });
    })
}

function updateRoomData(action,socket,io){
    if(!action)return
    checkConnection(socket,()=>{
        if(!rooms[socket.roomId]){
            rooms[socket.roomId] = {
                password : (Math.random() * 1000000).toFixed(0),
                roomId : socket.roomId
            };
        }
        rooms[socket.roomId].url = action.url;
        rooms[socket.roomId].subtitles = action.subtitles;
        rooms[socket.roomId].mediaType = action.type;
        io.to(socket.roomId).emit('UpdateData',{data : rooms[socket.roomId]});
    });
}
function isAuthenticated(user,socket){
    if(!user.isLogin)socket.emit("IsAuthenticated",false);
    socket.emit("IsAuthenticated",true);
    socket.auth = true;
    socket.user = user;
}

function joinRoom(action,socket,io){
    if(!action)return
    const {guest,id,password} = action;
    if(!socket.auth){
        sendMessage(socket,"You are not authinticated",true,true);
        return;
    }
    if(socket.roomId){
        sendMessage(socket,"You already joined a room.",true);
        return;
    }
    userInfoSaver(emitCounts,socket,io);
    limitRequests(emitCounts,socket);
    if(guest){
        if(!rooms[id]){
            socket.emit("Room_Vaildation",{err:"Room id doesn't exist."});
            return;
        }
        if(rooms[id].password !== password){
            socket.emit("Room_Vaildation",{err:"Password is worng."});
            return;
        }
        socket.join(id);
        socket.roomId = id;
    }else{
        socket.join(socket.user.username);
        socket.roomId = socket.user.username;
        if(!rooms[socket.roomId]){
            rooms[socket.roomId] = {
                password : (Math.random() * 1000000).toFixed(0),
                roomId : socket.roomId
            };
        }
        //updateRoomData(data,type,season,episode,socket,rooms,io);
    }
    socket.emit("JoinRoom",{data : rooms[socket.roomId]});
}


function checkConnection(socket,callback){
    if(!socket.auth){
        sendMessage(socket,"You are not authinticated",true,true);
        return;
    }
    if(!socket.roomId){
        sendMessage(socket,"You need to join a room.",true);
        return;
    }
    callback();
}


function sendMessage(socket,message,error,redirect){
    const action = {message,error,redirect};
    socket.emit("Message",action);
    if(redirect){
        socket.disconnect(true);
    }
}