const WebSocket = require('ws');
const { crc16xmodem } = require('crc');
const dgram = require('dgram');
const { cv_37bit } = require('./function/fun');
const hex2ascii = require('hex2ascii');
const { sqlserver, mongoose } = require('./connect_sqlsever');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
const log = require('log-to-file');
const moment = require('moment');
const cron = require('node-cron');
const person = require('./mongodb_model/person');
const logdatas = require('./mongodb_model/logdatas');
const converter = require('hex2dec');
var http = require('http');
// ทำการเชื่อม Websocket Server ตาม url ที่กำหนด
const connection = new WebSocket('ws://localhost:4000')

connection.onopen = function () {
	// จะทำงานเมื่อเชื่อมต่อสำเร็จ
	console.log("Connected webSocket");
};
connection.onerror = function (error) {
	console.error('WebSocket Error ' + error);
};
connection.onmessage = async function (e) {
	const data = JSON.parse(e.data.trim().toString());
	// //const licence_plate = 'กบ6894';
	// console.log("NUMBER PALTE : " + data.PlateText + ' TIME : ' + moment().format('YYYY-M-D H:mm:ss'))
	open_door(data, 'CON4')
};

async function open_door(data, port) {
	const count_person = await person.count({ licence_plate: data.PlateText });
	if (count_person > 0) {
		const persons = await person.findOne({ licence_plate: data.PlateText });
		const hid = persons.card_number;
		// const faccode = 2639;
		// const cardnumbers = 144233;
		// const faccode = converter.hexToDec(hid.substring(0, 8));
		// const cardnumbers = converter.hexToDec(hid.substring(8, 16));
		// 37 bit
		// const checksum = cv_37bit(faccode, cardnumbers);
		// const hex1 = crc16xmodem(checksum.toString()).toString(16).substr(0, 2);
		// const hex2 = crc16xmodem(checksum.toString()).toString(16).substr(crc16xmodem(checksum.toString()).toString(16).length - 2);

		// const senddata = Buffer.from(checksum.toString() + hex2ascii(hex1.toString(16)) + hex2ascii(hex2.toString(16)), 'ascii');
		// const code = parseInt((faccode.toString(16).padStart(8, "0") + cardnumbers.toString(16).padStart(8, "0")), 16);
		// const code = parseInt(hid, 16);
		// const udpclient = dgram.createSocket('udp4');
		const msg_data = 'Time : ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' Name : ' + persons.person_name
		const count_logdata = await logdatas.count({ licence_plates: data.PlateText, ip_address: data.CameraIP })
		if (count_logdata == 0) {

			var http = require('http');
			var url = {
				host: '192.168.1.111',
				// port: 8001,
				path: '/command.html?command=' + port + ',' + parseInt(hid, 16),
			};
			http.get(url, function (resp) {
				var completeResponse = '';
				resp.on('data', function (chunk) {
					completeResponse += chunk;
				});
				resp.on('end', function (chunk) {
					// console.log(completeResponse);
					console.log(msg_data);
				});
			});
			
			// udpclient.send(senddata, 0, senddata.length, 8888, ip_udp, function (err, bytes) {
			// 	console.log(msg_data);
			// 	udpclient.close();
			// });

			await logdatas.create([{
				times: moment().format('YYYY-MM-DD HH:mm:ss'),
				person_number: persons.person_number,
				licence_plates: persons.licence_plate,
				ip_address: data.CameraIP,
			},]);
		} else {
			const logdata = await logdatas.findOne({ ip_address: data.CameraIP }).sort({ times: 'desc' }).limit(1);
			if (persons.licence_plate != logdata.licence_plates) {
				udpclient.send(senddata, 0, senddata.length, 8888, ip_udp, function (err, bytes) {
					console.log(msg_data);
					udpclient.close();
				});
				await logdatas.create([{
					times: moment().format('YYYY-MM-DD HH:mm:ss'),
					person_number: persons.person_number,
					licence_plates: persons.licence_plate,
					ip_address: data.CameraIP,
				},]);
			}
		}
	}
}

// Import data
sqlserver.on('connect', async function (err) {
	if (err) {
		console.log(err);
	} else {
		async function import_data() {
			console.log('Connected BIS');
			// var sql = "SELECT * FROM [dbo].[PERSONS]"
			var sql = "SELECT A.[PERSID] ,[PERSNO] ,CONCAT(A.[LASTNAME], ' ', A.[FIRSTNAME]) AS PERSNAME ,A.[NUMBERPLATE] ,RIGHT(CONVERT(VARCHAR(1000), B.[CODEDATA], 2), 16)  AS CODEDATA FROM [acedb].[bsuser].[PERSONS] AS A INNER JOIN [acedb].[bsuser].[CARDS] AS B ON B.[PERSID] = A.[PERSID] WHERE A.NUMBERPLATE IS NOT NULL AND A.DATEDELETED IS NULL"
			request = new Request(sql, function (err, rowCount) {
				if (err) {
					console.log(err);
				} else {
					console.log(rowCount + ' rows');
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

		const task = cron.schedule('00 00 00 * * *', async () => {
			import_data();
		});

		task.start();
	}
});



