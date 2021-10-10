const ping = require('ping');

const hosts = ['google.com', 'yahoo.com'];
hosts.forEach(function (host) {
    ping.sys.probe(host, function (isAlive) {
        const msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);
    });
});