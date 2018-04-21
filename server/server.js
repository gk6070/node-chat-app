const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname + '/../public');

const port = process.env.PORT || 3000;
// console.log(__dirname + '/../public');
// console.log(publicPath);
var app =express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();	

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

	// //socket.emit from admin text Welcome to the chat app

	// socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
	
	// //socket.emit from admin text New User joined
	// socket.broadcast.emit('newMessage', generateMessage('Admin','New User joined'));

	socket.on('join', (params,callback) => {

		if(!isRealString(params.name) || !isRealString(params.room)){

			return callback('Name and room are required');
		}

		socket.join(params.room);

		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);
		//io.emit to all -- > io.to('The Office Fans').emit()
		//socket.boradcast.emit to all expect one --> socket.broadcast.to('The Office fans').emit()
		//socket.emit to only one --> 

		//socket.emit from admin text Welcome to the chat app
		console.log('updateUserList', users.getUserList(params.room));
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));

		socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
		
		//socket.emit from admin text New User joined
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined`));
		callback();

	});

	socket.on('createMessage', (message,callback) =>{

		console.log('createMessage' ,message);

		io.emit('newMessage', generateMessage(message.from,message.text));

		callback('This is from server');

		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
	});

	socket.on('createLocationMessage', (coords) =>{

		io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));

	});

	socket.on('disconnect',() => {

		var user = users.removeUser(socket.id);
		if(user){
			io.to(user.room).emit('updateUserList',users.getUserList(user.room));
			io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
		}
		console.log('User was disconnected');
	});
});

server.listen(port, () => {
	console.log(`Server is up on ${port}`);
});