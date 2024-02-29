const mongoose = require('mongoose')
const Schema = mongoose.Schema


const requestsSchema = new Schema({ 
    CID:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    RegistrationNo: { type: String,default:null},
    RegistrationType: { type: String,default:null},
    BrandID: {type:mongoose.Schema.Types.ObjectId,ref:'carBrand'},
    ModelID: {type:mongoose.Schema.Types.ObjectId,ref:'carModel'},
    FuelTypeID:{type:mongoose.Schema.Types.ObjectId,ref:'FuelType'},
    TransmissionTypeID:{type:mongoose.Schema.Types.ObjectId,ref:'transmissiontype'},
    CarCategory: { type: String,default:null},
    status: { type:Number, default: 1 },// 1 means active   
    isDeleted: { type: Boolean, default: false },
    appartment_no:{type:Number,default:null},
    flat_no:{type:Number,default:null},
    garage_no:{type:Number,default:null},
    wing_no:{type:String,default:null}
},
    {
        timestamps: true,
    })
  
const car = mongoose.model('Customercars', requestsSchema)
module.exports = car