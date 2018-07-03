const express = require('express');
const app = express();
const userRouts = express.Router();

const userSchema = require('../db/user.js');

userRouts.route('/add').post((req, res) => {
    const user = new userSchema(req.body);
    user.save()
        .then(user => {
            res.json('Server added successfully');
        })
        .catch(err => {
            console.log(err);
            res.status(400).send("unable to save to database");
        });
});

userRouts.route('/login').post((req, res) => {
    userSchema.findOne({email: req.body.email}, (err, user) => {
        if (err || user.password !== req.body.password) {
            res.status(401).send('login failed');
        } else {
            res.json({id: user._id});
        }
    })
});

userRouts.route('/').get((req, res) => {
    userSchema.find((err, users) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(users);
        }
    });
});

userRouts.route('/edit/:id').get((req, res) => {
    const id = req.params.id;
    userSchema.findById(id, (err, user) => {
        res.json(user);
    });
});

userRouts.route('/update/:id').post((req, res) => {
    userSchema.findById(req.params.id, (err, user) => {
        if (!user)
            return next(new Error('Could not load Document'));
        else if (user.password === req.body.oldPassword) {
            user.email = req.body.email;
            user.password = req.body.newPassword;

            user.save().then(user => {
                res.json('Update complete');
            }).catch(err => {
                res.status(400).send("unable to update the database");
            });

        }
    });
});

userRouts.route('/delete/:id').get((req, res) => {
    userSchema.findByIdAndRemove({_id: req.params.id},
        (err, serverport) => {
            if (err) {
                res.json(err);
            }
            else {
                res.json('Successfully removed');
            }
        });
});

module.exports = userRouts;