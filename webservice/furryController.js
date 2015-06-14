var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://tomchen:tom@ds031792.mongolab.com:31792/furrycare');

var userSchema = require('./user_schema').userSchema;
mongoose.model('userM', userSchema);
var authenticateUser;

mongoose.connection.once('open',function(){
	var userM = this.model('userM');

	var query = userM.findOne({'email':'tomcohent@gmail.com'});

/*	query.where('email').e('tomcohent@gmail.com'); */
	query.exec(function(err,docs){
		authenticateUser = docs;
		console.log("docs: " + authenticateUser);
		mongoose.disconnect();
		return authenticateUser;
	});
});

exports.getData = function() {
	return authenticateUser;
};