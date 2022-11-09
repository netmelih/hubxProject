const { Int32 } = require('mongodb');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var slug = require('slug');

var BookSchema = new mongoose.Schema({
  slug: {type: String, lowercase: true, unique: true},
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Authors' },
  price: Number,
  isbn: String,
  language: String,
  numberOfPages: Number,
  publisher: String,
});

BookSchema.plugin(uniqueValidator, {message: 'is already taken'});

BookSchema.pre('validate', function(next){
  if(!this.slug)  {
    this.slugify();
  }

  next();
});

BookSchema.methods.slugify = function() {
  this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

BookSchema.methods.toJSONFor = function(){
  return {
    title: this.title,
    author: this.author.toProfileJSONFor(),
    price: this.price,
    isbn: this.isbn,
    language: this.language,
    numberOfPages: this.numberOfPages,
    publisher: this.publisher
  };
};

mongoose.model('Books', BookSchema);