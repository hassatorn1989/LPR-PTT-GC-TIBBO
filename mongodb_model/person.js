const mongoose = require('mongoose')
const schema = new mongoose.Schema(
    {
        person_number: 'string',
        person_name: 'string',
        licence_plate: 'string',
        card_number: 'string',
    }
);
const person = mongoose.model('persons', schema);
module.exports = person


