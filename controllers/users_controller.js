module.exports.profile= function(req, res){
    // res.end('<h1>User Profile</h1>');

    //niche wala nhi ho rha 
    // return res.render('profile',{
    //     title: "User Profile"
    // });
    return res.render('user_profile', {
        title: 'User Profile'
    })
}

//render the sign up page
module.exports.signUp= function(req,res){
    return res.render('user_sign_up',{
        title: "Codeial | Sign Up"
    })
}

//render the sign in page
module.exports.signIn= function(req,res){
    return res.render('user_sign_in',{
        title: "Codeial | Sign In"
    })
}

//get the sign up data
module.exports.create=function(req,res){
    //to do later
}

// sign in and create a session for users
module.exports.createSession=function(req,res){
    //to do later
}
