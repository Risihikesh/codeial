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


        if(req.xhr){
            return res.status(200).json({
                data:{
                    post: post
                },
                message: "Post Created!"
            })
        }

        req.flash('success', 'Post Published')

        return res.redirect('back');
    } catch (err) {
        // console.log('error in creating a post:', err);
        req.flash('error', err)

        return res.redirect('back');
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

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id: req.params.id
                    },
                    message: "Post Deleted"
                })
            }
            
            req.flash('success', 'Post and associated comments deleted')

            return res.redirect('back');
        } else {
            req.flash('error', 'You cannot delete the post')

            return res.redirect('back');
        }
    } catch (err) {
        // Handle the error
        // console.error(err);
        req.flash('error', err)
        return res.redirect('back');
    }
}
