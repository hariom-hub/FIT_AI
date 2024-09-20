const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportlocalMongoose = require("passport-local-mongoose");
const userSchema = new Schema({

    email : {

        type : String,
        required : true
    },
    
    //passport js automatically adds user-name
});

// User.plugin(passportlocalMongoose);
userSchema.plugin(passportlocalMongoose);
module.exports = mongoose.model("User",userSchema);