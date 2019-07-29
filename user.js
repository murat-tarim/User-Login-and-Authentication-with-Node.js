const mongoose = require ('mongoose');

const UserSchema = new mongoose.Schema({

      
        name:{
         type: String,
         required: true 
        },
        email:{
            type: String,
            required: true 
           },
           isVerified:{
            type: Boolean, // E-mail verification
            default: false 
           },
           password:{
            type: String,
            required: true 
           },
           date:{
            type: Date,
            default: Date.now  
           },
           resetPasswordToken:{
            type: String
           } ,
           resetPasswordExpires:{
            type: Date
           }
});

const User = mongoose.model('user',UserSchema);

module.exports = User;