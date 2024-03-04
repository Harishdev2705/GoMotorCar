const mongoose = require('mongoose')
const Schema = mongoose.Schema


const requestsSchema = new Schema({
    name: { type: String, default: null },   
    status: { type: Number, default: 1 },// 1 means active
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })

const carcat = mongoose.model('carCategory', requestsSchema)
module.exports = carcat