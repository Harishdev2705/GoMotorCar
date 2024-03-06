const mongoose = require('mongoose')
const Schema = mongoose.Schema


const addressSchema = new Schema({
    CID:{type: String},
    address:{type:String},
    location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
      status: { type: Number, default: 1 },// 1 means active
},
    {
        timestamps: true,
    })

const carcat = mongoose.model('customeraddresses', addressSchema)
module.exports = carcat