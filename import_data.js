const WebSocket = require('ws');
const { crc16xmodem } = require('crc');
const dgram = require('dgram');
const { cv_37bit } = require('./function/fun');
const hex2ascii = require('hex2ascii');
const { mongoose, sqlserver } = require('./connect_sqlsever');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
//const { QueryTypes } = require('sequelize');
const log = require('log-to-file');
const moment = require('moment');
const cron = require('node-cron');
const person = require('./mongodb_model/person');
const logdatas = require('./mongodb_model/logdatas');
const converter = require('hex2dec');

async function import_data() {
	sqlserver.on('connect', async function(err) { 
       if (err) {
		console.log(err);
	  } else {
		console.log('Connected BIS');
		await person.remove();
		var sql = "SELECT A.[PERSID] ,[PERSNO] ,CONCAT(A.[LASTNAME], ' ', A.[FIRSTNAME]) AS PERSNAME ,A.[NUMBERPLATE] ,RIGHT(CONVERT(VARCHAR(1000), B.[CODEDATA], 2), 16)  AS CODEDATA FROM [acedb].[bsuser].[PERSONS] AS A INNER JOIN [acedb].[bsuser].[CARDS] AS B ON B.[PERSID] = A.[PERSID] WHERE A.NUMBERPLATE IS NOT NULL AND A.DATEDELETED IS NULL"
    request = new Request(sql, function (err, rowCount) {
        if (err) {
            console.log(err);
        } else {
            //console.log(rowCount + ' rows');
        }
    });
	await person.remove();
    request.on('row', async function (columns) {
		await person.create([
            {
                person_number: columns[1].value,
                person_name: columns[2].value,
                licence_plate: columns[3].value,
                card_number: columns[4].value,
            },
        ]);
    });
    sqlserver.execSql(request);
    console.log('Data Import ' + moment().format('YYYY-MM-DD'));
	  } 
    });
}
import_data();
process.exit();