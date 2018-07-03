const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = 4200;
const cors = require('cors');
const path = require('path');
const userRouts = require('./routs/userRout');
const todoRouts = require('./routs/todoRouts');
process.env.NODE_ENV = 'production';

mongoose.connect('mongodb://localhost:27017/todo').then(
    () => {
        console.log('Database is connected')
    },
    err => {
        console.log('Can not connect to the database' + err)
    });

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/user', userRouts);
app.use('/todo', todoRouts);

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static('build'));
/*app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});*/

app.listen(PORT, function () {
    console.log('Server is running on Port: ', PORT);
});