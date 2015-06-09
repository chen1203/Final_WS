var mongoose = require('mongoose'); 
var schema = mongoose.Schema;

var userSchema = new schema({
	userName: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    pass: {type: String, required: true},
    animals: [
        {
            animalId: {type: Number, unique: true, required: true},
            animalName: {type: String, required: true},
            animalAge: {type: Number},
            animalType: {type: String},
            animalWeight: {type: Number},
            animalPic: {type: String},  //add default
            animalFood: [
                {
                    foodName: {type: String, required: true},
                    foodBrand: {type: String},
                    foodBagWeight: {type: Number},
                    foodBagPrice: {type: Number},
                    foodDailyUsage: {type: Number}
                }
            ],
            animalVaccination: [
                {
                    vaccinationDate: {type: Date, required: true, default: Date.now},
                    vaccinationName: {type: String, required: true},
                    vaccinationExpire: {type: Date}
                }
            ],
            animalCare: [
                {
                    careDate: {type: Date, required: true, default: Date.now},
                    careType:  {type: String, required: true},
                   	careExpire:  {type: Date}
                }
            ],
            animalService: [
                {
                    serviceType: {type: String, required: true},
                    serviceName: {type: String},
                    serviceAddress: {type: String}
                }
            ],
            animalMunicipalLicensing: {type: Date, default: Date.now}
        },
      
    ],
    alarms: []

	}, {collection: 'furrycare'});

exports.userSchema = userSchema;
