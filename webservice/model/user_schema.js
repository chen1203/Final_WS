var mongoose = require('mongoose'); 
var schema = mongoose.Schema;

var userSchema = new schema({
	userName: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    pass: {type: String, required: true},
    animals: [
        {
            animalName: {type: String},
            animalAge: {type: Number},
            animalWeight: {type: Number},
            animalPic: {type: String},  //add default
            animalFood: [
                {
                    foodName: {type: String},
                    foodBrand: {type: String},
                    foodBagWeight: {type: Number},
                    foodBagPrice: {type: Number},
                    foodDailyUsage: {type: Number}
                }
            ],
            animalVaccination: [
                /*{
                    vaccinationDate: {type: Date, default: Date.now},
                    vaccinationName: {type: String},
                    vaccinationExpire: {type: Date}
                }*/
                {
                    name: {type: String},
                    receivedDate: {type: Date, default: Date.now},
                    expDate: {type: Date}
                }
            ],
            animalCare: [
                /*{
                    careDate: {type: Date, default: Date.now},
                    careType:  {type: String},
                   	careExpire:  {type: Date}
                }*/
                {
                    name: {type: String},
                    receivedDate: {type: Date, default: Date.now},
                    expDate: {type: Date}
                }
            ],
            animalService: [
                {
                    serviceType: {type: String},
                    serviceName: {type: String},
                    serviceAddress: {type: String}
                }
            ],
            animalMunicipalLicensing: {type: Date, default: Date.now}
        },
      
    ],
    alarms: [ 
        { 
            notiAnimals: [],
            notiType: {type: String},
            notiName: {type: String, required: true}, 
            notiReceivedDate: {type: String, required: true},
            notiExpiredDate: {type: Date, required: true}
        }
    ]

	}, {collection: 'furrycare'});

mongoose.model('User',userSchema);
//exports.userSchema = userSchema;
