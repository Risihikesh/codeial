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