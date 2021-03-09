const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');


const Book = require('../models/book');
const { db } = require('../models/sequel');
const Sequel = require('../models/sequel');

router.get('/',checkAuth, async(req, res, next) => {
    await Book.aggregate([
        {
            $lookup: {
            from: 'sequels',
            localField: 'sequelObj',
            foreignField: '_id',
            as: 'sequel'
            }
        },
    ])
    .exec()
    .then((docs) => {
        res.status(200).json(docs)
           
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
    });

router.post('/', checkAuth,async(req, res, next) => {
    let sequelData;
    try{
        sequelData = await Sequel.findOne({_id: req.body.sequelObj})
        console.log(sequelData);
    } catch(err){
        return res.status(404).json({
            message: "Sequel not found",
            err
        });
    }
    if (!sequelData) {
        return res.status(404).json({
            message: "Sequel not found"
        });
    }
    const book = new Book({
        name: req.body.name,
        sequelObj : sequelData._id

    });
    book.save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created directory successfully',
            createdBook: {
                name: result.name,
                _id: result._id,
                sequelId: req.body.sequelId,
        request: {
                    type: 'GET',
                    url: 'http://localhost:3000/books/' + result._id
                }

            }
        })
    })
    });   
    
   router.get('/:bookId',checkAuth, (req, res, next) => {
    const id = req.params.bookId;
    // using the normal book.find method
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

    //using the mongodb aggregation method.

    // Book.findOne({ _id: id}, (err, result) => {
    //     if (result.length) {
    //         Book.aggregate({$match: {_id: {$in: id}}}, (payload) => {

    //             return payload;
    //         })
    //     }
    // })
    // .select('-__v')
    // .exec() 
    // Book.aggregate([
    //     {
    //         $match: {
    //             _id: req.params.bookId,
                
    //         }
    //     }
    // ])
    // .then(docs => {
    //     console.log('From database', docs);
    //     if (docs) {
    //         res.status(200).json({
    //                         books: docs,
    //                     request: {
    //                             type: 'GET',
    //                             description: 'Get all books',
    //                             url: 'http://localhost:3000/books'   
    //                         }
    //                     })
    //     } else {
    //         res.status(404).json({ message: 'No valid entry for provided entry'})
    //     }
    // })
    // .catch(err => {
    //     console.log(err);
    //     res.status(500).json({error: err});
    // });
    });

    router.patch('/:bookId', checkAuth,(req,res,next) => {
        console.log(req.body)
        const id = req.params.bookId;
    const updateOps = {};
    for (const ops in req.body){
        updateOps[ops.propName] = ops.value;
    }
    Book.findOneAndUpdate({_id: id}, {name: req.body.name})
    .exec()
    .then(result => {
        console.log(result); 
        res.status(200).json({
            message: 'book updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/books/' + id
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

    // router.get('/search', (req,res,next) => {
    //     db.Sequel.aggregate({
    //         $lookup:{
    //             from: 'Book',
    //             localField: 'sequelObj',
    //             foreignField: 'id',
    //             as: 'SequelBook'
    //         }
    //     })
    // })

  
    router.delete('/:bookId', checkAuth,(req,res,next) => {
        const id = req.params.bookId;
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