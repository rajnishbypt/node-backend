// product model
const { Product } = require('../models/product');
const {Category} =  require('../models/category')
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
// get product lists
router.get(`/`, async (req, res) => {

  // ?categories=847847347,74129372372,.....
  
  let categoryProducts ={};
  if(req.query.categories){
    categoryProducts = {category:req.query.categories.split(',')}
  }
  const productList = await Product?.find(categoryProducts).populate('category');
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

// get product by id
router.get(`/:id`, async (req, res) => {
  const product = await Product?.findById(req.params.id).populate('category');
  if (!product) {
   return res
      .status(500)
      .json({ success: false, message: 'product with given id not found !' });
  }
  res.status(200).send(product);
});

// post product
router.post(`/`, async (req, res) => {
  const category=  await Category.findById(req.body.category);
  if(!category){
    return  res.status(400).send("Invalid category")
  }
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
    product=  await product.save(); 
    if(!product){
      return res.status(500).json({success:false,message:"product cannot created"})
    } 
    res.send(product)
});


// update product by id

router.put('/:id', async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
    res.status(400).send("Invalid product id")
  }

  const category=  await Category.findById(req.body.category);
  if(!category){
    return  res.status(400).send("Invalid category")
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    images: req.body.images,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
    },
    { new: true }
  );
  if (!product) return res.status(404).send('the product cannot updated !');

  res.send(product);
});

// delete product by id
router.delete('/:id', (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: 'product delete' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'product not found !' });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

// product count
router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments( {});
  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({productCount :productCount});
});

// featured products
router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count :0
  const products = await Product.find({isFeatured:true}).limit(+count);
  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products  ) ;
});
module.exports = router;
