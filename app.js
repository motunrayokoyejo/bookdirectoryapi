const express = require('express')
const app = express();
const morgan = require('morgan');
const bodyParser =  require('body-parser');
const mongoose = require('mongoose')


const bookRoutes = require('./api/routes/books')

mongoose.connect('mongodb+srv://motun:motunrayo@node-restapi.uxluz.mongodb.net/booksDB?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected....'))
.catch(err => console.log(err));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/books', bookRoutes);


module.exports = app;