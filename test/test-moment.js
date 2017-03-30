// class to test momemnt library

var moment = require('moment');

var sequelizeTime = "Thu Mar 30 2017 10:49:36 GMT-0400 (EDT)";

moment().format();

function checktime(time, format) {
	console.log(time + "      " + format);
	var momentDate = moment(time, format);
	console.log(momentDate.isValid());
}

function truncateSequelizeTime(sequelizeTime) {
  // split the original string and get the time
	var timeArray = sequelizeTime.split(/[: ' ']/);
	var shortTimeArray = timeArray.slice(0,7);
	// build a string from the shortTimeArray
	var timeAsString ='';

	shortTimeArray.forEach(function(element) {
		timeAsString = timeAsString + element + ' ';
	});
    return timeAsString; 
}

function sequelizeToEpochSecs(sequelizeTime) {
	var timeString = truncateSequelizeTime(sequelizeTime);
	var format = "ddd MMM DD YYYY HH mm ss";
	return moment(timeString, format);
}

checktime("10:49:36", "HH:mm:ss");
checktime("Mar 30 2017 10:49:36", "MMM DD YYYY HH:mm:ss");

// split the original string and get the time
// var timeArray = sequelizeTime.split(/[: ' ']/);
// console.log("full time as array");
// console.log(timeArray);
// console.log('slice array');
// var shortTimeArray = timeArray.slice(0,7)
// console.log(shortTimeArray);
// // build a string from the shortTimeArray
// var timeAsString ='';

// shortTimeArray.forEach(function(element) {
// 	timeAsString = timeAsString + element + ' ';
// });
// checktime(timeAsString, "ddd MMM DD YYYY HH mm ss")
// console.log(moment(timeAsString, "ddd MMM DD YYYY HH mm ss").valueOf());



console.log("moment convert string " + sequelizeTime);
console.log("time after  moment conversion");
var momentTime = sequelizeToEpochSecs(sequelizeTime);
var epochTime = momentTime.valueOf();

var sequelizeTimePlusHour = "Thu Mar 30 2017 11:49:36 GMT-0400 (EDT)";
var momentTimePlusHour = sequelizeToEpochSecs(sequelizeTimePlusHour);
var epochTimePlusHour = momentTimePlusHour.valueOf();

var MS_TO_SECS = 1000;

console.log((epochTimePlusHour - epochTime)/MS_TO_SECS)

