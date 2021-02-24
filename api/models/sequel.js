const mongoose = require('mongoose');

const sequelSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{ type: String, required: true}
});

module.exports = mongoose.model('Sequel', sequelSchema)