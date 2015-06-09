var express = require('express');
var app = express();
var authenticateUser = require('./furryController');

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

app.listen(3000);
console.log("service on port 3000");