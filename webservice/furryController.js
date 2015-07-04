var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://tomchen:tom@ds031792.mongolab.com:31792/furrycare');

var userSchema = require('./user_schema').userSchema;
var userM = mongoose.model('userM', userSchema);
var authenticateUser;

mongoose.connection.once('open',function(){

	var query = userM.findOne({'email':'tomcohent@gmail.com'});
	query.exec(function(err,doc){
		authenticateUser = doc;
		console.log("doc: " + authenticateUser);
	});
});

exports.getUser = function() {
	return authenticateUser;
};

exports.setAlarm = function(alarmType,alarmName,alarmExpDate) {
	console.log("on setAlarm");
	var query = userM.findOne({'email':authenticateUser.email});
	query.exec(function(err,doc) {
		if (err) 
			console.log(err);
		else {
			var alarm = {
				alarmName: ''+alarmName,
            	alarmType: ''+alarmType,
            	alarmDate: new Date(alarmExpDate)
			};
			console.log("new alarm : "+alarm);
			var query = doc.update({$push:{alarms:alarm}});
			query.exec(function(err, results) {
				console.log("Number of updated values: "+results);
			});
			// update the 'authenticateUser' from mongo
			var query = userM.findOne({'email':authenticateUser.email});
			query.exec(function(err, doc) {
				authenticateUser = doc;
				console.log("doc: " + authenticateUser);
			});
		}
	});
};


exports.setAnimal = function(animalName,animalAge,animalWeight,animalPic) {
	console.log("on setAnimal");
	var query = userM.findOne({'email':authenticateUser.email});
	query.exec(function(err,doc) {
		if (err) 
			console.log(err);
		else {
			var animal = {
				animalName: ''+animalName,
            	animalAge: animalAge,
            	animalWeight: animalWeight,
            	animalPic: ''+animalPic
			};
			console.log("new animal : "+animal);
			var query = doc.update({$push:{animals:animal}});
			query.exec(function(err, results) {
				console.log("Number of updated values: "+results);
			});
			// update the 'authenticateUser' from mongo
			var query = userM.findOne({'email':authenticateUser.email});
			query.exec(function(err, doc) {
				authenticateUser = doc;
				console.log("doc: " + authenticateUser);
			});
		}
	});
};


