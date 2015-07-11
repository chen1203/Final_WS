/**
 * Created by Tom on 11/07/2015.
 */
var userRoutes = require('../controller/user.js');
var animalRoutes = require('../controller/animal.js');
var notificationRoutes = require('../controller/notification.js');


module.exports = function(app){
	/* user */
    app.get('/getUser', userRoutes.getUser);
    /* notification */
    app.get('/setNewAlarm',notificationRoutes.setNewNotification);
    /* animal */
    app.get('/setNewAnimal',animalRoutes.setNewAnimal);
    app.get('/setAnimalField',animalRoutes.setAnimalField);
    app.get('/deleteAnimal',animalRoutes.deleteAnimal);
    app.get('/createRec',animalRoutes.createRec);
};