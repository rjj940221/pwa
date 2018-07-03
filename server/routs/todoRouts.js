const express = require('express');
const app = express();
const todoRouts = express.Router();

const todoSchema = require('../db/todo.js');

todoRouts.route('/add').post((req, res) => {
    console.log(req.body);
    const todo = new todoSchema(req.body);
    todo.save()
        .then(todo => {
            res.json({id: todo.id});
        })
        .catch(err => {
            console.log(err);
            res.status(400).send("unable to save to database");
        });
});

todoRouts.route('/:userId').get((req, res) => {
    const userId = req.params.userId;
    todoSchema.find({userId: userId}, (err, todo) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(todo);
        }
    });
});

todoRouts.route('/edit/:id').get((req, res) => {
    const id = req.params.id;
    todoSchema.find({id: id}, (err, todo) => {
        res.json(todo);
    });
});

todoRouts.route('/update/:id').put((req, res) => {

    todoSchema.findOne({id: req.params.id}, (err, todo) => {
        if (!todo)
            return next(new Error('Could not load Document'));
        else {
            let save = false;
            if (req.body.title) {
                todo.title = req.body.title;
                save = true;
            }
            if (req.body.note) {
                todo.note = req.body.note;
                save = true;
            }
            if (req.body.createDate) {
                todo.createDate = req.body.createDate;
                save = true;
            }
            if (req.body.done) {
                todo.done = req.body.done;
                save = true;
            }
            if (req.body.userId) {
                todo.userId = req.body.userId;
                save = true;
            }

            if (save) {
                todo.save().then(todo => {
                    res.json('Update complete');
                }).catch(err => {
                    res.status(400).send("unable to update the database");
                });
            }

        }
    });
});

todoRouts.route('/delete/:id').get((req, res) => {
    todoSchema.findByIdAndRemove({_id: req.params.id},
        (err, todo) => {
            if (err) res.json(err);
            else res.json('Successfully removed');
        });
});

module.exports = todoRouts;