const mongoose = require('mongoose')
const Schema = mongoose.Schema

// /**
//  * @swagger
//  * components:
//  *  schemas:
//  *    User Functionality:
//  *     type : object
//  *     properties:
//  *       _id:
//  *         type: string
//  *         description: Unique mongoid
//  *         example: ''
//  *       name:
//  *         type: string
//  *         example: john doe
//  *       status:
//  *         type: number
//  *         example: 1 
//  *       isDeleted:
//  *         type: boolean
//  *         example: false
//  */


const buserservicesSchema = new Schema({   
    serviceName: { type: String, trim: true, maxlength: 128, default: null}, 
    description: { type: String,default: null}, 
    price: { type:Number,default:0},    
    serviceImages: [{ type: String,default: null}],    
    userCategories_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'usercategories' }],
    userSubcategories_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'subcategories' }],
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    status: { type:Number, default: 1 },// 1 means active
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })
  
const buserservices = mongoose.model('buserservices', buserservicesSchema)
module.exports = buserservices