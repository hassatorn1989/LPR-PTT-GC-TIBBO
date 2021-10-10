//const Sequelize = require('sequelize');
const mongoose = require('mongoose');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var config = {  
        server: '10.36.8.107',  //update me 10.36.8.107
        authentication: {
            type: 'default',
            options: {
                userName: 'sa', //update me
                password: 'sa_s3k_pw'  //update me
            }
        },
		options: {
			encrypt: false,
			enableArithAbort: true,
			integratedSecurity: true,
			trustServerCertificate: true,
			rowCollectionOnDone: true,
			database: 'acedb', //update me,
			validateBulkLoadParameters: true,
			instanceName: 'BIS_ACE'
		}
    };  
    var sqlserver = new Connection(config);  
   /*sqlserver.on('connect', function(err) { 
       if (err) {
		console.log(err);
	  } else {
		console.log('Connected BIS');
	  } 
    });*/

mongoose.connect("mongodb://localhost:27017/licence_plate", { useNewUrlParser: true })
    .then(() => {
        console.log('Connected Mongodb');
    })
mongoose.set('debug',false);

module.exports = {
    sqlserver,
    mongoose
};
