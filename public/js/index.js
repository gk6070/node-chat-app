var socket = io();

socket.on('connect', function() {
	console.log('Connected to server');

	// socket.emit('createEmail',{
	// 	to : 'kv6070@gmail.com',
	// 	text : 'Hey. This is Venu'
	// });

	socket.emit('createMessage',{
		from: 'gopal',
		text: 'Yup, that works for me'
	});
});

socket.on('disconnect', function() {
	console.log('server Disconnected');
});

// socket.on('newEmail', function(email) {
// 	console.log('New Email',email);
// });

socket.on('newMessage', function(message){
	console.log('newMessage',message);
});