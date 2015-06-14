var express = require('express');
var app = express();
var url = require('url');
var authenticateUser = require('./furryController');

app.use('/', express.static('./public'));

app.get('/get', function(req,res){
	console.log("out docs: " + authenticateUser.getUser());
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	app.set('json spaces',4);
	res.set("Content-Type", "application/json");
	res.status(200);
	res.json(authenticateUser.getUser());
});

app.get('/setNewAlarm',function(req,res){
	console.log("set new alarm");
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	// same variables for all alarms
	var alarmType= query.alarmtype;
	var alarmName= query.alarmname;
	var alarmExpDate= query.expdate;
	console.log("new alarm reported: \nAlarm Type: "+query.alarmtype+"\nAlarm Name: "+query.alarmname+"\nExp. Date: "+query.expdate);
	// Create and push the alarm to db here!!
	authenticateUser.setAlarm(alarmType,alarmName,alarmExpDate);
	// we return the updated user
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	app.set('json spaces',4);
	res.set("Content-Type", "application/json");
	res.status(200);
	res.json(authenticateUser.getUser());
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log("listening on port "+port+"...\n\n");
