const mongoose = require('mongoose');

const multer =  require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required:true
    },
    avatar:{
        type: String,
    }
},{
    timestamps: true  //this will keep record of creating and update
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH))
    },
    filename: function (req, file, cb) {
      
      cb(null, file.fieldname + '-' +  Date.now())
    }
  });

  userSchema.statics.uploadedAvatar= multer({storage:storage}).single('avatar');
  //to make availabe AVATAR_PATH PuBLICly we used statics
  userSchema.statics.avatarPath = AVATAR_PATH


const User= mongoose.model('User', userSchema);

module.exports= User;