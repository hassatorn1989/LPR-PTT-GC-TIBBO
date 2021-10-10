/*var net = require('net');

var client = new net.Socket();
client.connect(46789, '127.0.0.1', function() {
	console.log('Connected');
	//client.write('Hello, server! Love, Client.');
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});*/

 const data = '{"DateTime":"2020-11-18 08:54:20","CameraIP":"0.0.0.0","PlateText":"กล8031","PlateProvince":"ระยอง","CarMake":"toyota","CarModel":"toyota_camry","CarColor":"black","Location":"Gate1","Direction":"IN"}';
   const data1 = data.split(",")[2];
   const data2 = data1.split(":")[1];
   
console.log(data2.replace(/"/g, ''))
   /*const licence_plate = data.licence_plate;
	console.log(licence_plate)*/