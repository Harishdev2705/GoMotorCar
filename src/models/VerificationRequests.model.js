const mongoose = require('mongoose')
const Schema = mongoose.Schema


const requestsSchema = new Schema({   
    user_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    usertype: { type: String,default:null},
    requestCount: { type:Number, default: 1 },// 1 means active
    status: { type:Number, default: 1 },// 1 means active
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })
  
const Requests = mongoose.model('verificationrequests', requestsSchema)
module.exports = Requests