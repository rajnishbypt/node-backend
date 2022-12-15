// user model
const {User} = require('../models/user')
const express = require('express');
const router = express.Router();


router.get(`/`, async (req, res) => {
    const userList = await User?.find();
    if(!userList){
      res.status(500).json({success:false})
    }
    res.send(userList);
  });
  
  router.post(`/`, async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      isAdmin:req.body.isAdmin 
    });
    await user
      .save()
      .then((createdUser) => {
        res.status(201).json(createdUser);
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
          success: false,
        });
      });
  });

  module.exports = router;