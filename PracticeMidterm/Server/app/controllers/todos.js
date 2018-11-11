//import { Schema } from 'mongoose';


var express = require('express'),
    router = express.Router(),
    logger = require('../../config/logger'),
    mongoose = require('mongoose');
    Todo = mongoose.model('Todo');
    asyncHandler = require('express-async-handler');


module.exports = function (app, config) {
    app.use('/api', router);

    router.route('/todos').get(function (req, res, next) {
        logger.log('info', 'Get all todos');
        res.status(200).json({ message: 'Get all todos' });

    });

    router.route('/todos/:id').get(function (req, res, next) {
        logger.log('info', 'Get todo %s', req.params.id);
        res.status(200).json({ message: 'Get todo ' + req.params.id });
    });

    router.post('/todos', asyncHandler(async (req, res) => {
        logger.log('info', 'Creating todo');
        var todo = new Todo(req.body);
        await todo.save()
            .then(result => {
                res.status(201).json(result);
            })
               }));


};

