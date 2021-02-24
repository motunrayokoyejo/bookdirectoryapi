const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    name:{ type: String, required: true},
    sequelObj:{ type: mongoose.Schema.Types.ObjectId, required:true}
});

module.exports = mongoose.model('Book', bookSchema)