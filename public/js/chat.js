var socket = io();


function scrollToBottom(){

	//Selectors
	var messages = jQuery("#messages");
	var newMessage = messages.children('li:last-child');
	//Heights
	var clientheight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if(clientheight + scrollTop +newMessageHeight + lastMessageHeight >= scrollHeight){

		messages.scrollTop(scrollHeight);
	}

}
socket.on('connect', function() {
	console.log('Connected to server');

	var params = jQuery.deparam(window.location.search);

	socket.emit('join', params, function(err){
		if(err){

			alert(err);
			window.location.href = '/';
		}else{
			console.log('No error');

		}
	});	
	// console.log('No error');

	// socket.emit('createEmail',{
	// 	to : 'kv6070@gmail.com',
	// 	text : 'Hey. This is Venu'
	// });

	// socket.emit('createMessage',{
	// 	from: 'gopal',
	// 	text: 'Yup, that works for me'
	// });
});

socket.on('disconnect', function() {
	console.log('server Disconnected');
});

// socket.on('newEmail', function(email) {
// 	console.log('New Email',email);
// });

socket.on('newMessage', function(message){

	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery("#message-template").html();
	var html = Mustache.render(template, {

		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
	scrollToBottom();
	// console.log('newMessage',message);
	// var formattedTime = moment(message.createdAt).format('h:mm a');


	// var li = jQuery('<li></li>');
	// li.text(`${message.from} ${formattedTime}: ${message.text}`);

	// jQuery('#messages').append(li);
});

// socket.emit('createMessage',{
// 	from : 'Frank',
// 	text : 'Hi'
// }, function(data){
// 	console.log('Got it',data);
// });

socket.on('newLocationMessage', function(message) {

	var formattedTime = moment(message.createdAt).format('h:mm a');

	var template = jQuery("#location-message-template").html();
	var html = Mustache.render(template, {
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
	scrollToBottom();
	// var li = jQuery('<li></li>');
	// var a = jQuery('<a target="_blank">My current location</a>');

	// li.text(`${message.from} ${formattedTime}: `);
	// a.attr('href', message.url);
	// li.append(a);
	// jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function(e) {

	e.preventDefault();

	var messageTextBox = jQuery('[name=message]');

	socket.emit('createMessage',{

		from: 'User',
		text: messageTextBox.val()

	},function(){

		messageTextBox.val('')
	});
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function(){

	if(!navigator.geolocation){
		return alert('Geolocation not supported by your browser');
	}

	locationButton.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition(function (position){

		locationButton.removeAttr('disabled').text('Send location');

		console.log(position);
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function(){
		locationButton.removeAttr('disabled').text('Send location');
		alert('Unable to fetch location');	

	})
});