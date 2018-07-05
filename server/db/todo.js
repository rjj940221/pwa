const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Items
let todo = new Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    note: {
        type: String
    },
    createDate: {
        type: String
    },
    done: {
        type: Boolean,
        default: false
    },
    userId: {
        type: String,
        required: true
    }
}, {
    collection: 'todo'
});

module.exports = mongoose.model('todo', todo);