var mongoose = require('mongoose');
var Schema = mongoose.Schema;
    ObejectId = Schema.ObejectId;

var wishlist = new Schema({
  title: {type: String , default : "Your wishlist"},
  products: [{type: String,  ref: 'Product'}]
});

module.exports = mongoose.model('Wishlist',wishlist);
