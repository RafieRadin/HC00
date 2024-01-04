const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt'); // Erase if already required
const validator = require('validator'); // Erase if already required

const Schema = mongoose.Schema;

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
});

//static signup
userSchema.statics.register = async function(email, password) {
    //validation
    if (!email || !password) {
        throw new Error('All field must be filled');
    }
    if (!validator.isEmail(email)) {
        throw new Error('Email is not valid');
    }
    if (!validator.isStrongPassword(password)){
        throw new Error('Password is not strong enough');
    }
    
    const exists = await this.findOne({ email });

    if (exists) {
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash })

    return user;
}

//static login
userSchema.statics.login = async function(email, password) {
    //validation
    if (!email ||!password) {
        throw new Error('All field must be filled');
    }
    if (!validator.isEmail(email)) {
        throw new Error('Email is not valid');
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Incorrect password');
    }

    return user;
}

//Export the model
module.exports = mongoose.model('User', userSchema);