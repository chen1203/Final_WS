/**
 * Created by Tom on 11/07/2015.
 */
var userRoutes = require('../controller/user.js');
var animalRoutes = require('../controller/animal.js');
var notificationRoutes = require('../controller/notification.js');


module.exports = function(app){

    app.get('/getUser', userRoutes.getUser);


    app.get('/setNewAlarm',notificationRoutes.setNewNotification);


    app.get('/setNewAnimal',animalRoutes.setNewAnimal);
    app.get('/setAnimalField',animalRoutes.setAnimalField);
    app.get('/deleteAnimal',animalRoutes.deleteAnimal);
};