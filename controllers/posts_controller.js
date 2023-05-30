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


/***** i have async function in the bcs model.create doesnt support callback function */
const Post = require('../models/post');

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
