const mongoose = require('mongoose')
const schema = new mongoose.Schema(
    {
        times: 'string',
        persons_number: 'string',
        licence_plates: 'string',
        ip_address: 'string',
    }
);
const logdatas = mongoose.model('logdatas', schema);
module.exports = logdatas

