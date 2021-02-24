const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Sequel = require('../models/sequel');

router.get('/',(req, res, next) => {
    Sequel.find()
    .select('name _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            sequels: docs.map(doc => {
                return {
                    name: doc.name,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/books/' + doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
    });

router.post('/', checkAuth, (req, res, next) => {
    const sequel = new Sequel({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    sequel.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created sequel successfully',
            createdSequel: {
                name: result.name,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/sequels/' + result._id
                }

            }
        })
    })
    });   


    router.delete('/:sequelId', checkAuth, (req,res,next) => {
        const id = req.params.sequelId;
        Sequel.remove({_id: id}).exec()
        .then(result => {
            res.status(200).json({
                message: 'Sequel has been deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/sequels',
                    data: { name: 'String'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
    });


module.exports = router;