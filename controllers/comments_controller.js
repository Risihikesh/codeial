// const Comment = require('../models/comment');

// const Post= require('../models/post');

// module.exports.create= function(req,res){
//     Post.findById(req.body.post, function(err, post){

//         if(post){
//             Comment.create({
//                 content: req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             }, function(err, comment){
//                 // handle error


//                 post.comments.push(comment);
//                 post.save();

//                 res.redirect('/');
//             })
//         }
//     })
// }

/*** */

const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer'); 
const queue= require('../config/kue')  
const commentEmailWorker = require('../workers/comment_email-Worker');

// module.exports.create = async function (req, res) {
//   try {
//     const post = await Post.findById(req.body.post);

//     if (post) {
//       const comment = await Comment.create({
//         content: req.body.content,
//         post: req.body.post,
//         user: req.user._id,
//       });

//       post.comments.push(comment);
//        post.save();

      
//       if (req.xhr){
//         // Similar for comments to fetch the user's id!
//         comment = await comment.populate('user', 'name').execPopulate();

//         return res.status(200).json({
//             data: {
//                 comment: comment
//             },
//             message: "Post created!"
//         });
//     }


//     req.flash('success', 'Comment published!');

//       res.redirect('/');
//     }
//   } catch (err) {
//     // handle error
//     req.flash('error', err);
//     return;
//   }
// };

/****** ta create comment controller*/

module.exports.create = async function(req,res){

  console.log("Inside async");
  try{
      console.log("Inside try");
      let post = await Post.findById(req.body.post);
      if(post){
          console.log("Post found");
          let comment = await Comment.create({
              content:req.body.content,
              post:req.body.post,
              user:req.user._id
          });
          console.log("Comment created");
          post.comments.push(comment);
           post.save();
          await comment.populate('user','name email');

          //parallel job
        //   commentsMailer.newComment(comment);
        let job= queue.create('emails', comment).save(function(err){
            if(err){
                console.log('error in sending to the queue', err);
                return;
            }
            console.log('job enqueued',job.id);
        })

          console.log("Before xhr");
          
          

          if(req.xhr){
              console.log("Inside xhr");
              
              return res.status(200).json({
                  data:{
                      comment:comment
                  },
                  message : "Comment created via Ajax!"
              });
            
          }
          console.log("Not xhr");
          req.flash('success',"Comment created!")
          return res.redirect('back');
      }
      else{
          req.flash('error',"So sorry no post is found in the database!")
          // console.log("So sorry no post is found in the database");
          return;
      }

  }catch(err){

      console.log("Inside catch");
      req.flash('error',err);
      // console.log("Error",err);
      return res.redirect("back");

  }
}

//normal function
// module.exports.destroy = function(req, res){
//   Comment.findById(req.params.id, function(err, comment){
//     if( comment.user== req.user.id){
//       let postId = comment.post;
//       comment.remove();
//       Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}},function(err,post){
//         return res.redirect('back');
//       })
//     }else{
//       return res.redirect('back');
//     }
//   });
// }


/**async function */
module.exports.destroy = async function(req, res){
  try {
      const comment = await Comment.findById(req.params.id);
      
      if (comment.user == req.user.id) {
          const postId = comment.post;
          await comment.deleteOne();
          
          await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});


           // send the comment id which was deleted back to the views
           if (req.xhr){
            return res.status(200).json({
                data: {
                    comment_id: req.params.id
                },
                message: "Post deleted"
            });
        }


        req.flash('success', 'Comment deleted!');

          
          return res.redirect('back');
      } else {
        req.flash('error', 'Unauthorized');
          return res.redirect('back');
      }
  } catch (err) {
      // Handle the error
      console.error(err);
      req.flash('error', err);
      return res.redirect('back');
  }
}

