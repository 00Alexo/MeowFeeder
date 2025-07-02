const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    devices:{
        type: [String],
        default: [],
        required: true
    }
}, {timestamps: true});

const userCollection = mongoose.model('User', userSchema);

module.exports = userCollection;