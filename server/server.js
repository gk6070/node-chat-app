const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname + '/../public');

const port = process.env.PORT || 3000;
// console.log(__dirname + '/../public');
// console.log(publicPath);
var app =express();
var server = http.createServer(app);
var io = socketIO(server);	

app.use(express.static(publicPath));

io.on('connection',(socket) => {
	console.log('New User connected');

	// socket.emit('newEmail', {
	// 	from : 'gk6070@gmail.com',
	// 	text : 'Hey what is going on',
	// 	createdAt : 123
	// });

	// socket.emit('newMessage', {

	// 	from: 'Venu',
	// 	text: 'See you soon',
	// 	createdAt : 123123
	// });

	// socket.on('createEmail',(newEmail) =>{
	// 	console.log('create Email',newEmail);
	// });

	socket.on('createMessage', (message) =>{

		console.log('createMessage' ,message);

		io.emit('newMessage', {
			from : message.from,
			text : message.text,
			createdAt : new Date().getTime()
		});
	});

	socket.on('disconnect',() => {
		console.log('User was disconnected');
	});
});

server.listen(port, () => {
	console.log(`Server is up on ${port}`);
});