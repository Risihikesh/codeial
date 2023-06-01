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

module.exports.create = async function (req, res) {
  try {
    const post = await Post.findById(req.body.post);

    if (post) {
      const comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      post.comments.push(comment);
      await post.save();

      res.redirect('/');
    }
  } catch (err) {
    // handle error
  }
};

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
          
          return res.redirect('back');
      } else {
          return res.redirect('back');
      }
  } catch (err) {
      // Handle the error
      console.error(err);
      return res.redirect('back');
  }
}

