
        // socket.emit  specific client
        // io.emit  every connected client
        // socket.broadcast.emit everyone except socket
        // io.to.emit every in room
        // socket.broadcast.to.emit everyone except specific chat room

const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// let count = 0

io.on('connection', (socket) => {
    console.log('New connection for Web Socket');

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({id: socket.id, ...options})

        if(error){
            return callback(error)
        }
        socket.join(user.room) 
    
        socket.emit('message', generateMessage('Admin','Welcome!')) 
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined !`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback)=> {
       
        const user = getUser(socket.id)
        

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {

        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        
        if(user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
        
    })

    // socket.emit('countUpdated', count)

    // socket.on('increment', () =>{
    //     count++
    //     // socket.emit('countUpdated', count) (as when we open many web localhost it starts form where it let)
    //     io.emit('countUpdated', count)
    // })
})

server.listen(port, () =>{
    console.log(`Server listening on port ${port}!`);
})