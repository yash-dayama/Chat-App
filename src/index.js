const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// let count = 0

io.on('connection', (socket) => {
    console.log('New connection for Web Socket');

    socket.emit('message', 'Welcome') 
    socket.broadcast.emit('message', 'A new user has join')

    socket.on('sendMessage', (message, callback)=> {
       
        io.emit('message', message)
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
    socket.on('disconnect', () => {
        io.emit('message', 'A User has left!')
        
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