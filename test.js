// const https = require('https');
// const faccode = 2639;
// const cardnumbers = 120429;
// const hex = (faccode.toString(16).padStart(8, "0") + cardnumbers.toString(16).padStart(8, "0"));

// // faccode.padStart(8, '0');
// console.log(parseInt(hex, 16));
// https.get('https://localhost:8001/test', (resp) => {
//     let data = '';

//     // A chunk of data has been received.
//     resp.on('data', (chunk) => {
//         data += chunk;
//     });

//     // The whole response has been received. Print out the result.
//     resp.on('end', () => {
//         console.log(JSON.parse(data).explanation);
//     });

// }).on("error", (err) => {
//     console.log("Error: " + err.message);
// });

var http = require('http');
var url = {
    host: 'localhost',
    port: 8001,
    path: '/test',
    // headers: {
    //     'Content-Type': 'application/octet-stream'
    // },
};
http.get(url, function (resp) {
    // console.log("Status: " + resp.statusCode);
    // console.log("Header: " + JSON.stringify(resp.headers));
    // resp.setEncoding('utf8');
    var completeResponse = '';
    resp.on('data', function (chunk) {
        completeResponse += chunk;
    });
    resp.on('end', function (chunk) {
        console.log(completeResponse);
    });
});