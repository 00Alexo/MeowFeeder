const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        default: 'offline'
    }
}, {timestamps: true});

const deviceCollection = mongoose.model('Device', deviceSchema);

module.exports = deviceCollection;