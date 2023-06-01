// const Post = require('../models/post')

// module.exports.create = function(req, res){
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     }, function(err, post){
//         if(err){console.log('error in creating a post');
//         return;
//     }
//         return res.redirect('back');
//     });
// }


/***** i have used async function bcs model.create doesnt support callback function */
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
    try {
        const post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        
        return res.redirect('back');
    } catch (err) {
        console.log('error in creating a post:', err);
        return;
    }
}

// bjhb 
// module.exports.destroy = async function(req, res){
//     Post.findById(req.params.id, function(err, post){
//         // .id means converting the object id into string
//         if(post.user== req.user.id){
//             post.remove();

//             Comment.deleteMany({post: req.params.id}, function(err){
//                 return res.redirect('back');
//             });

//         } else{
//             return res.redirect('back');
//         }
//     });
// }

module.exports.destroy = async function(req, res){
    try {
        const post = await Post.findById(req.params.id);
        
        if(post.user == req.user.id){
            await post.deleteOne();

            await Comment.deleteMany({post: req.params.id});
            
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
