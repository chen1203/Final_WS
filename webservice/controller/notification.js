// Load the module dependencies
var mongoose = require('mongoose'),
    userM = mongoose.model('User'),
    url = require('url'),
    userCon = require('./user');


function setNotification(alarmType,alarmName,alarmExpDate, callback) {
    var authenticateUser = userCon.getAuthenticateUser();
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
                // update the 'authenticateUser' from mongo
                userM.findOne({'email':authenticateUser.email}, function(err, doc2) {
                    authenticateUser = doc2;
                    console.log("doc: " + authenticateUser);
                    callback(err,authenticateUser);
                });
            });
        }
    });
}

exports.setNewNotification = function(req,res){
    console.log("notification controller - setNewNotification()");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    // same variables for all alarms
    var alarmType= query.alarmtype;
    var alarmName= query.alarmname;
    var alarmExpDate= query.expdate;
    console.log("new alarm reported: \nAlarm Type: "+query.alarmtype+"\nAlarm Name: "+query.alarmname+"\nExp. Date: "+query.expdate);
    // Create and push the alarm to db here!!
    setNotification(alarmType,alarmName,alarmExpDate, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            // we return the updated user
            res.status(200);
            res.json(data);
        }
    });
};