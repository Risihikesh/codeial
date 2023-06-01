const express = require('express');
const router=express.Router();
const passport= require('passport');


 const postsController= require('../controllers/posts_controller');

 router.post('/create',passport.checkAuthentication, postsController.create); //here we have used passport.checkAuthentication for avoid unauthorised form posting by changing just html file
 //for deleting post
 router.get('/destroy/:id', passport.checkAuthentication, postsController.destroy);

 module.exports= router;