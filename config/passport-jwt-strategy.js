const passport = require('passport');
const JWTStrategy= require('passport-jwt').Strategy;
const ExtractJWT= require('passport-jwt').ExtractJwt;


const User= require('../models/user');


var opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'secret',

}


passport.use(new JWTStrategy(opts, async function(jwtPayLoad, done) {
    try {
      const user = await User.findById(jwtPayLoad._id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      console.log('Error in finding user from jwt:', err);
      return done(err, false);
    }
  }));
  
  module.exports = passport;
  