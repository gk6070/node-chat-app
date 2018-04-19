//Jan  1st 1970 00:00:00 am
var moment = require('moment');
// var date = moment();
// // var date = new Date();
// // var months = ['Jan','Feb']
// date.add(10,'year').subtract(9,'months');
// console.log(date.format('MMM Do, YYYY'));


// new Date().getTime()
var someTimestamp = moment.valueOf();
console.log(someTimestamp)

var createdAt = 1234;
var date  = moment(createdAt);
console.log(date.format('h:mm a'))