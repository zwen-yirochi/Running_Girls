const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// 서버와 Socket.IO 초기화
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 포트 설정
const port = process.env.PORT || 8080;

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));


//클라이언트 네임스페이스
const clientNamespace = io.of('/client');
clientNamespace.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('client message', (message) => {
        console.log('Message from client:', message);
        if (displayNamespace) {
            displayNamespace.emit('display message', message);
            console.log('Send to display:', message);
        } else {
            console.log('Display namespace not found!');
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});


// 전시용 네임스페이스
const displayNamespace = io.of('/display');
displayNamespace.on('connection', (socket) => {
    console.log('Display connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Display disconnected:', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});