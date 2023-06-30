// const User= require('../models/user')

// module.exports.profile= function(req, res){
//     User.findById(req.params.id, function(err, user){
//     return res.render('user_profile', {
//         title: 'User Profile'
//         profile_user: user
//     })
// })

// }

// //render the sign up page
// module.exports.signUp= function(req,res){
//     return res.render('user_sign_up',{
//         title: "Codeial | Sign Up"
//     })
// }

// //render the sign in page
// module.exports.signIn= function(req,res){
//     return res.render('user_sign_in',{
//         title: "Codeial | Sign In"
//     })
// }

// //get the sign up data
// module.exports.create=function(req,res){
//     //
//     if(req.body.password != req.body.confirm_password){
//           req.flash('error', 'Passwords do not match');
//         return res.redirect('back');
//     }
//     User.findOne({email: req.body.email}, function(err, user){
//         if(err){
//             req.flash('error', err);
//             return;
//         }
//         if(!user){
//             User.create(req.body, function(err, newUser){
//                 if(err){
//                     req.flash('error', err);
//                     return;
//                 }
//                 return res.redirect('/users/sign-in');
//             })
//         }
//         else{
//             req.flash('success', 'You have signed up, login to continue!');
//             return res.redirect('back');
//         }
//     })
// }

// // sign in and create a session for users
// module.exports.createSession=function(req,res){
//     //to do later
// }

/**** */


    const User = require('../models/user');

    const fs = require('fs');
    const path = require('path');

    // module.exports.profile = async function (req, res) {
    //     if (req.cookies.user_id) {
    //         try {
    //             let user = await User.findById(req.cookies.user_id);
    //             if (user) {
    //                 return res.render('user_profile', {
    //                     title: 'User Profile',
    //                     user: user
    //                 });
    //             }
    //         } catch (err) {
    //             console.log('Error in finding user', err);
    //         }
    //     } else {
    //         return res.redirect('/users/sign-in');
    //     }
    // };

    module.exports.profile = async function(req, res) {
        try {
          const user = await User.findById(req.params.id).exec();
      
          return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
          });
        } catch (err) {
          console.error(err);
          // Handle any errors that occur during the execution
          // You can customize the error handling based on your requirements
          return res.status(500).send('Internal Server Error');
        }
      };

      /*** update the user name and email */

    //   module.exports.update= function(req, res){
    //     if(req.user.id == req.params.id){
    //         User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //         });
    //     }else{
    //         req.flash('error', 'Unauthorized!');
    //         return res.status(401).send('Unauthorized');
    //     }
    // }

    // module.exports.update = async function(req, res) {
    //     try {
    //       if (req.user.id == req.params.id) {
    //         const user = await User.findByIdAndUpdate(req.params.id, req.body).exec();
    //         req.flash('success', 'Updated!');
    //         return res.redirect('back');
    //       } else {
    //         req.flash('error', 'Unauthorized!');
    //         return res.status(401).send('Unauthorized');
    //       }
    //     } catch (err) {
    //       console.error(err);
    //       // Handle any errors that occur during the execution
    //       req.flash('error',err )
    //       return res.status(500).send('Internal Server Error');
    //     }
    //   };

    /**multer update */
    module.exports.update = async function(req, res) {
      
        if (req.user.id == req.params.id) {
          try {
          const user = await User.findByIdAndUpdate(req.params.id);
          User.uploadedAvatar(req, res, function(err){
            if(err){
              console.log('*****Multer error', err)
            }
            // console.log(req.file)
            user.name = req.body.name;
            user.email = req.body.email;
            
            if(req.file){

              if(user.avatar){
                fs.unlinkSync(path.join(__dirname, '..', user.avatar))
              }
              //this is saving the path of the uploaded file into the avatar field in the user
              user.avatar= User.avatarPath + '/' + req.file.filename;
            }
            user.save();
            return res.redirect('back');
          })
          // req.flash('success', 'Updated!');
          // return res.redirect('back');
        } 
       catch (err) {
        console.error(err);
        // Handle any errors that occur during the execution
        req.flash('error',err )
        return res.redirect('back');
      }
    }else {
      req.flash('error', 'Unauthorized!');
      return res.status(401).send('Unauthorized');
    }
    };
      

    //render the sign up page
    module.exports.signUp = async function (req, res) {

        if(req.isAuthenticated()){
           return res.redirect('/users/profile');
        }
        return res.render('user_sign_up', {
            title: 'Codeial | Sign Up'
        });
    };

    //render the sign in page
    module.exports.signIn = async function (req, res) {
        if(req.isAuthenticated()){
          return res.redirect('/users/profile');
        }
        return res.render('user_sign_in', {
            title: 'Codeial | Sign In'
        });
    };

    //get the sign up data

    
    // module.exports.create = async function (req, res) {
    //     //use async function
    //     if (req.body.password != req.body.confirm_password) {
    //       req.flash('error', 'Passwords do not match');
    //          return res.redirect('back');
    //         }
    //         try {
    //             let user = await User.findOne({ email: req.body.email });
    //             if (!user) {
    //                 user = await User.create(req.body);
    //                 return res.redirect('/users/sign-in');
    //             } else {
    //                 return res.redirect('back');
    //             }
    //         } catch (err) {
    //             console.log('Error in creating user', err);
    //         }
    //     };

    module.exports.create = async function (req, res) {
      try {
        if (req.body.password != req.body.confirm_password) {
          req.flash('error', 'Passwords do not match');
          return res.redirect('back');
        }
    
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
          const newUser = await User.create(req.body);
          return res.redirect('/users/sign-in');
        } else {
          req.flash('success', 'You have signed up, login to continue!');
          return res.redirect('back');
        }
      } catch (err) {
        req.flash('error', err);
        return;
      }
    };
    
        
        // // sign in and create a session for users
        // module.exports.createSession = async function (req, res) {
        //     // steps to authenticate
        //     //find the user
        //     try {
        //         let user = await User.findOne({ email: req.body.email });
        //         if (user) {
        //             //handle password which dont match
        //             if (user.password != req.body.password) {
        //                 return res.redirect('back');
        //             }
        //             //handle session creation
        //             res.cookie('user_id', user.id);
        //             return res.redirect('profile');
        //         } else {
        //             //handle user not found
        //             return res.redirect('back');
        //         }
        //     } catch (err) {
        //         console.log('Error in finding user in signing in', err);
        //     }
        // };

        // sign in and create a session for users
        module.exports.createSession = function (req, res){
          req.flash('success', 'Logged in Successfully')
            return res.redirect('/');
        }


        module.exports.destroySession = function (req, res){
            // req.logout();
            // return res.redirect('/');
            req.logout(function(err) {
                if (err) {
                    console.log('Error in logging out', err);
                    return;
                }
                // Redirect to appropriate page after logout
                req.flash('success', 'Logged Out Successfully')

                return res.redirect('/');
            });
        }