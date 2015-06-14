var express = require('express');
var app = express();
var url = require('url');
var authenticateUser = require('./furryController');

var Alarm = function(type,name,expdate){
	this.type = type;
	this.name = name;
	this.expdate = expdate;
};
app.use('/', express.static('./public'));

app.get('/get', function(req,res){
	console.log("out docs: " + authenticateUser.getData());
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	app.set('json spaces',4);
	res.set("Content-Type", "application/json");
	res.status(200);
	res.json(authenticateUser.getData());
});

app.get('/setnewalarm',function(req,res){
console.log("set net alarm");
	// here we need to do some QUERY from db!
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	// get the date from query

	// same vars for all alarms!!!
	var alarmType= query.alarmtype;
	var alarmName= query.alarmname;
	var alarmExpDate= query.expdate;
	console.log("new alarm reported: \nAlarm Type: "+query.alarmtype+"\nAlarm Name: "+query.alarmname+"\nExp. Date: "+query.expdate);
	// Create and push the alarm to db here!!
	var newAlarm = Alarm(alarmType,alarmName,alarmExpDate);

	// we return the updated user
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	app.set('json spaces',4);
	res.set("Content-Type", "application/json");
	res.status(200);
	res.json(authenticateUser.getData());
});
app.listen(3000);
console.log("service on port 3000");