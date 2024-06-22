// Node Server
console.log("index.js");
const express = require("express");
const app = express()
const { createServer } = require("http")
const path = require("path");
const server = createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const users = {};

//use api and render frontend file
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/index.html"));
})
//make connection with socket 
io.on("connection", socket => {
    socket.on("new-user-joined", name => {
        users[socket.id] = name;
        io.emit("connectedUserList", users);
    });
    socket.on("sendMsg", (data) => {
        const socketId = data.receiverUser
        io.to(socketId).emit("receive", { message: data.msg, name: users[socket.id] })
    });
    socket.on("disconnect", message => {
        delete users[socket.id];
    });

})
server.listen(8000, () => {
    console.log("server listen on 8000--> ");
});

