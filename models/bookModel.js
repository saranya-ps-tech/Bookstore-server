const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  noOfPages: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number,
    required: true
  },
  abstract: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  category: {
    type: String,
  },
  uploadImg: {
    type: Array,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  userMail: {
    type: String,
    required: true
  },
  bought: {
    type: String,
    default: ""
  }

});
const books = mongoose.model('Book', bookSchema);
module.exports = books
