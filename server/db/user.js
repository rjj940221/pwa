const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Items
let user = new Schema({
    email: {
        type: String,
        unique: true,
        dropDups: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    collection: 'users'
});

module.exports = mongoose.model('user', user);