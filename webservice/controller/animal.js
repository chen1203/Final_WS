// Load the module dependencies
var mongoose = require('mongoose'),
    userM = mongoose.model('User'),
    url = require('url'),
    userCon = require('./user');

/*
 function for New animal
 */

function setAnimal(animalName,animalAge,animalWeight,animalPic, callback) {
    var authenticateUser = userCon.getAuthenticateUser();
    console.log("on setAnimal");
    var query = userM.findOne({'email':authenticateUser.email});
    query.exec(function(err,doc) {
        if (err)
            console.log("error on set animal :\n "+err);
        else {
            var animal = {
                animalName: ''+animalName,
                animalAge: animalAge,
                animalWeight: animalWeight,
                animalPic: ''+animalPic
            };
            var query = doc.update({$push:{animals:animal}});
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


exports.setNewAnimal = function(req,res){
    console.log("animal controlle - setNewAnimal()");
    var url_parts = url.parse(req.url, true);
    var query1 = url_parts.query;
    // same variables for all alarms
    var animalName = query1.animalName;
    var animalAge = query1.animalAge;
    var animalWeight = query1.animalWeight;
    var animalPic = query1.animalPic;
    console.log("new animal reported: \nAnimal name: "+animalName+"\nanimal age: "+animalAge+"\nanimal pic: "+animalPic+"\n");
    // Create and push the alarm to db here!!
   setAnimal(animalName,animalAge,animalWeight,animalPic, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            // we return the updated user
            res.status(200);
            res.json(data);
        }
    });
};



/*
 function for set animal fields
  */
function setField(field,animalId,animalNewVal,callback) {
    var authenticateUser = userCon.getAuthenticateUser();
    var updateQuery = null;
    console.log("on setAnimal: "+field);
    var query = userM.findOne({'email':authenticateUser.email});
    query.exec(function(err,doc) {
        if (err)
            console.log("error on set animal :\n "+err);
        else {
            console.log("user id : "+doc._id);
            console.log("animal id: "+animalId);
            console.log("animal new value: "+animalNewVal);
            if (field === "animalName")
                updateQuery = userM.findOneAndUpdate(
                    { "_id" : doc._id, "animals._id" : animalId},
                    { "$set" : {"animals.$.animalName" : animalNewVal }
                    });
            else if (field === "animalAge")
                updateQuery = userM.findOneAndUpdate(
                    { "_id" : doc._id, "animals._id" : animalId},
                    { "$set" : {"animals.$.animalAge" : animalNewVal }
                    });
            else
                updateQuery = userM.findOneAndUpdate(
                    { "_id" : doc._id, "animals._id" : animalId},
                    { "$set" : {"animals.$.animalWeight" : animalNewVal }
                    });

            updateQuery.exec(function(err, results) {
                console.log("updated values: "+results);
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


exports.setAnimalField = function(req,res){
    console.log("animal controller - setAnimalField()");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var field = query.field;
    var animalId = query.animalId;
    var animalNewVal = query.animalNewVal;

    console.log("update animal "+field+" to: "+animalNewVal+"\n");
    // update animal field to db here!!
    setField(field,animalId,animalNewVal, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            // we return the updated user
            res.status(200)
            res.json(data);
        }
    });
};

/*
 function for delete animal
 */

function deleteAnimalDB(animalId,callback) {
    var authenticateUser = userCon.getAuthenticateUser();
    var query = userM.findOne({'email':authenticateUser.email});
    query.exec(function(err,doc) {
        if (err)
            console.log("error on set animal :\n "+err);
        else {
            console.log("user id : "+doc._id);
            console.log("animal id: "+animalId);

            var deleteQuery = userM.findOneAndUpdate(
                { "_id" : doc._id},
                {$pull: {"animals": { _id : animalId }}});

            deleteQuery.exec(function(err, results) {
                console.log("updated values: "+results);
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

exports.deleteAnimal = function(req,res){
    console.log("delete animal");
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var animalId = query.animalId;
    // delete animal from db
    deleteAnimalDB(animalId, function(err,data) {
        if (err)
            res.send(500, "something went wrong: "+err);
        else {
            // we return the updated user
            res.status(200);
            res.json(data);
        }
    });
};