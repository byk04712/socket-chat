
const express = require('express');
const sio = require('socket.io');
const bodyParser = require('body-parser');
const http = require('http');

const PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = sio(server);

io.on('connection', socket => {
	console.log('Someone connected!');
	// 服务端监听 join 事件，并将收到的消息通知给其他人
	socket.on('join', name => {
		socket.nickname = name;
		socket.broadcast.emit('announcement', name + ' 加入聊天室');
	});

	socket.on('text', (msg, fn) => {
		socket.broadcast.emit('text', socket.nickname, msg);
		// 确认消息已接收
		fn(Date.now());
	});

});

app.use(express.static('public'));
app.use(bodyParser.json());

server.listen(PORT, () => console.log('The server started on ' + PORT));
