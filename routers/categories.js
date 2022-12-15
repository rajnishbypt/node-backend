// category model
const { Category } = require('../models/category');
const express = require('express');
const   mongoose   = require('mongoose');
const router = express.Router();

// get category list
router.get(`/`, async (req, res) => {
  const categoryList = await Category?.find();
  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

// get category by id
router.get(`/:id`, async (req, res) => {
  const category = await Category?.findById(req.params.id);
  if (!category) {
   return res
      .status(500)
      .json({ success: false, message: 'category with given id not found !' });
  }
  res.status(200).send(category);
});

// update category by id

router.put('/:id', async (req, res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
    res.status(400).send("Invalid category id")
  }
  const category = await Category.findByIdAndUpdate(

    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
      date:req.body.date
    },
    { new: true }
  );
  if (!category) return res.status(404).send('the category cannot updated !');

  res.send(category);
});

// post category
router.post(`/`, async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
    date:req.body.date
  });
  category = await category.save();
  if (!category) return res.status(404).send('the category cannot created !');

  res.send(category);
});

// api/v1/product id
router.delete('/:id', (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: 'category delete' });
      } else {
        return res
          .status(404)
          .json({ success: false, message: 'category not found !' });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});
module.exports = router;
