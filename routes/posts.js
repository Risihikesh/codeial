const express = require('express');
const router=express.Router();
const passport= require('passport');


 const postsController= require('../controllers/posts_controller');

 router.post('/create',passport.checkAuthentication, postsController.create); //here we have used passport.checkAuthentication for avoid unauthorised form posting by changing just html file

 module.exports= router;