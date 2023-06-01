// const Post= require('../models/post');



// module.exports.home = function(req,res){
    // return res.end('<h1>Express is up for codeial!</h1>');
    // console.log(req.cookies)

    // Post.find({}, function(err,posts){
    //     return res.render('home',{
    //         title: "Codeial | Home",
    //         posts: posts
    //     });
    // });

    //populate the user of each posts
//     Post.find({})
//     .populate('user')
//      .populate({
//        path: 'comments',
//       populate:{
//            path: 'user'
//       }
//      })
//     .exec(function(err,posts){
//    User.find({}, function(err, users){
//        return res.render('home',{
//             title: "Codeial | Home",
//             posts: posts,
//             all_users: users
//         });
//    })
//         
//     })
   
// }


/**** */

const Post = require('../models/post');
const User = require('../models/user');


module.exports.home = async function(req, res) {
    try {
        const posts = await Post.find({})
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            }
        })
        .exec();  //we can remove .exec() bcs in Mongoose, the populate() method already return promise, don't need to call .exec() explicitly
        
        const users = await User.find({}).exec();
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });
    } catch (err) {
        console.log(err);
        return res.end('<h1>Error in fetching posts from database</h1>');
    }
}
