const nodeMailer= require('../config/nodemailer');



//this is another way to exporting the method
exports.newComment= (comment)=>{
    // template
    let htmlString = nodeMailer.renderTemplate({comment:comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'krishikes369@gmail.com',
        to: comment.user.email,
        subject: "New comment Published",
        html: htmlString
    },(err, info)=>{
        if(err){
            console.log('Error in sending mail', err);
            return;
        }
        // console.log('Message Sent', info);
        return;
    })
}