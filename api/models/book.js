const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{ type: String, required: true},
    sequelObj:{ type: mongoose.Schema.Types.ObjectId, ref: 'Sequel'}
});

module.exports = mongoose.model('Book', bookSchema)