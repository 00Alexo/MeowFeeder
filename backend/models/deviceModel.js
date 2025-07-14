const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    user_email:{
        type: String,
        required: true,
        default: "notSet"
    },
    status:{
        type: String,
        required: true,
        default: 'offline'
    },
    feedingTime:{
        type: Array,
        required: true,
        default: []
    },
    lastFeedTime:{
        type: Date,
        default: null
    },
    feedingHistory:{
        type: [Date],
        default: []
    },
    ipAddress:{
        type: String,
        required: true,
        default: process.env.DEFAULT_IP_ADRESS || '192.168.100.43'
    },
    autoFeeding:{
        type: Boolean,
        default: true
    },
    name:{
        type: String,
        default: 'MeowFeeder'
    }
}, {timestamps: true});

const deviceCollection = mongoose.model('Device', deviceSchema);

module.exports = deviceCollection;
