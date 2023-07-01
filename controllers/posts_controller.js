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
const Like = require('../models/like');


// module.exports.create = async function(req, res){
//     try {
//         let post = await Post.create({
//             content: req.body.content,
//             user: req.user._id
//         });


//         if(req.xhr){
//              // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
//               await post.populate('user', 'name').execPopulate();
//             return res.status(200).json({
//                 data:{
//                     post: post
//                 },
//                 message: "Post Created!"
//             })
//         }

//         req.flash('success', 'Post Published')

//         return res.redirect('back');
//     } catch (err) {
//         // console.log('error in creating a post:', err);
//         req.flash('error', err)

//         return res.redirect('back');
//     }
// }



/******** */
module.exports.create = async function(req,res){
    try{
        let post = await Post.create({
            content:req.body.content,
            user:req.user._id
            // below is also working to set the user id in the database, I don't know why :)
            // user:req.user
        });

        // populating only the name field of user
        await post.populate('user' , 'name');

        if(req.xhr){
            
            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post published via Ajax!"
            })
        }

    
        req.flash('success','Post published!');
        return res.redirect('back');
    }catch(err){
        req.flash('error',err);
        // console.log("Error",err);
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

            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});


            await post.deleteOne();z

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
