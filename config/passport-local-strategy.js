const passport = require('passport');

const LocalStrategy=require('passport-local').Strategy;
const User = require('../models/user');


/*****here it is old call back method */
// //athentication using passport
// passport.use(new LocalStrategy({
//     usernameField: 'email'
//     },
//     function(email, password, done){
//         //find a user establish the identity
//         User.findOne({email: email}, function(err, user){
//             if (err) { 
//                 console.log('Error in finding user --> Passport');
//                 return done(err);
//             }
//             if (!user || user.password != password){
//                 console.log('Invalid username/password');
//                 return done(null, false);
//             }
//             return done(null, user);
//         });
//     }
//   ));

//   // serializing the user to decide which key is to kept in cookies
//   passport.serializeUser(function(user, done){
//     done(null, user.id);
//   });

//   //deserializing the user from the key in the cookies
//   passport.deserializeUser(function(id, done){
//     User.findById(id, function(err, user){
//         if(err){
//             console.log('Error in finding user --> Passport');
//             return done(err);
//         }
//         return done(null, user);
//     })
//   })


/***here i have used the async method because findOne now doesn't support callback function */
// Authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  },
  async function(req, email, password, done) {
    try {
      const user = await User.findOne({ email: email });
      if (!user || user.password !== password) {
        // console.log('Invalid username/password');
        req.flash('error', 'Invalid username/password')
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      // console.log('Error in finding user --> Passport');
      req.flash('error', err)
      return done(err);
    }
  }
));

 // serializing the user to decide which key is to kept in cookies
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  

// Deserializing the user from the key in the cookies
passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log('User not found');
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    console.log('Error in finding user --> Passport');
    return done(err);
  }
});




/****** this one is given by ta during google auth error
 * Failed to serialize user into session
    at pass 
    *the error in was google oauth-strategy .lean().exec()
 */


// passport.use(new LocalStrategy({
//   usernameField:'email',
//   passReqToCallback:true
// },

// async function(req,email,password,done)
// {
// //find a user and establish the identity
// try{
// const user=await User.findOne({email:email});
//   // if(err)
//   // {
//   //     console.log("Error in finding user->passport");
//   //     return done(err);
//   if(!user ||user.password!=password)
//   {
//       req.flash('error','Invalid username/password');
//       return done(null,false);
//   }
//   return done(null,user);
// }
// catch(err)
// {
  
// console.log("Error is coming in passport");
// return;
// }
// })
// );

// //seralize the user to decide which key is to be kept in cookies

// passport.serializeUser(function(user,done){
//   done(null,user.id);
// })

// passport.deserializeUser(
//   async function(id,done){
//       try{
//  const user=await User.findById(id)
//  {
//       // if(err)
//       // {
//       // console.log("Error in finding user->passport");
//       // return done(err);
//       // }
   
//       return done(null,user);
//  }
// }catch(err)
//  {
//   console.log("Error in finding user->passport");
//   return done(err);
//  }
//   });


  //check if the user authenticated 
  passport.checkAuthentication = function(req, res, next){
    //if the user is signed in, then pass on the request to the next function(Controllers action)
    if(req.isAuthenticated()){
      return next();
    }
    // if the user is not signed in 
    return res.redirect('/users/sign-in');
  }

  passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
      // req.user contain the current signed in user from the session cookies and we are just sending to the locals for the views
      res.locals.user= req.user;
    }
    next();
  }


  module.exports= passport;