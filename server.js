var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/E-bazaar');

var Product = require('./model/product');
var Wishlist = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//product
app.get('/product',function(request,response){
  Product.find({},function(err,products){
    if(err){
      response.status(500).send({error:"could not fetch products"});
    } else {
      response.send(products);
    }
  });
});

app.post('/product',function(request,response){
  var product = new Product();
  product.title = request.body.title;
  product.price = request.body.price;
  product.save(function(err,savedproduct){
    if (err) {
      response.status(500).send({error:" could not save"});
    } else {
      response.status(200).send(savedproduct);
    }
  });
});



// wishlist

app.get('/wishlist',function(request,response){
  Wishlist.find({}).populate({path:'products',model:'Product'}).exec(function(err,wishlists){
    if(err){
      response.status(500).send({error:"could not fetch products"});
    } else {
      response.status(200).send(wishlists);
    }
  });
});



app.post('/wishlist',function(request,response){
  var wishlist = new Wishlist();
  wishlist.title = request.body.title;
  wishlist.save(function(err, newWishlist){
    if (err) {
      response.status(500).send({error:" could not save"});
    } else {
      response.status(200).send(newWishlist);
    }
  });
});

app.put('/wishlist/product/add',function(request,response){
  Product.findOne({_id: request.body.productId},function(err,product){
    if (err){
      response.status(500).send({error:"Could not add item"});
    } else {
      Wishlist.update(
        {_id:request.body.wishlistId},{$addtoset:{products:product._id}},
        function(err,wishlist){
        if(err){
          response.status(500).send({error:" could not save"});
        } else {
          response.send(wishlist);
        }
      });
    }
  });
});










app.listen(3000, function(){
  console.log("e-bazaar running at port 3000");
});
