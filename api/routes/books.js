const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');


const Book = require('../models/book');

router.get('/',(req, res, next) => {
    Book.find()
    .select('name _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
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

router.post('/',(req, res, next) => {
    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    book.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created directory successfully',
            createdBook: {
                name: result.name,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/books/' + result._id
                }

            }
        })
    })
    });   
    
   router.get('/:bookId', (req, res, next) => {
    const id = req.params.bookId;
    Book.findById(id)
    .select('name _id')
    .exec()
    .then(doc => {
        console.log('From database', doc);
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'http://localhost/products'   
                }
            })
        } else {
            res.status(404).json({ message: 'No valid entry for provided entry'})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
    });

    router.patch('/:bookId',(req,res,next) => {
        const id = req.params.bookId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Book.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result); 
        res.status(200).json({
            message: 'book updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/books/'
            }
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    });

    router.delete('/:bookId',(req,res,next) => {
        const id = req.params.productId;
        Book.remove({_id: id}).exec()
        .then(result => {
            res.status(200).json({
                message: 'Book has been deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/books',
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