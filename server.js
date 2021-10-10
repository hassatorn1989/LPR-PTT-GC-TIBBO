const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4000 });
// สร้าง websockets server ที่ port 4000
wss.on('connection', function connection(ws) { // สร้าง connection
    ws.on('message', function incoming(message) {
        // รอรับ data อะไรก็ตาม ที่มาจาก client แบบตลอดเวลา
        console.log('received: %s', message);
    });
    ws.on('close', function close() {
        // จะทำงานเมื่อปิด Connection ในตัวอย่างคือ ปิด Browser
        console.log('disconnected');
    });
    // ส่ง data ไปที่ client เชื่อมกับ websocket server นี้
    setInterval(() => {
        const data = {
            "DateTime": "2020-09-18 16:29:12",
            "CameraIP": "10.13.8.76",
            "PlateText": "บษ2453",
            "PlateProvince": "กรุงเทพมหานคร",
            "CarMake": "toyota",
            "CarModel":"toyota_yaris",
            "CarColor": "silver-gray",
            "Location": "Gate1",
            "Direction": "IN"
        }
        ws.send(JSON.stringify(data))
        console.log(JSON.stringify(data));
    }, 1000)
});