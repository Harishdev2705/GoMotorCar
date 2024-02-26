const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * @swagger
 * components:
 *  schemas:
 *    User Functionality:
 *     type : object
 *     properties:
 *       _id:
 *         type: string
 *         description: Unique mongoid
 *         example: ''
 *       name:
 *         type: string
 *         example: john doe
 *       status:
 *         type: number
 *         example: 1 
 *       isDeleted:
 *         type: boolean
 *         example: false
 */


const usersubcateSchema = new Schema({   
    subcategoryName: { type: String, trim: true, maxlength: 128, default: null},       
    buserservices_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'buserservices' },
    userCategories_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'usercategories' },
    subservice_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'subservices' },    
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    status: { type:Number, default: 1 },// 1 means active
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })
  
const userSUbcategories = mongoose.model('subcategories', usersubcateSchema)
module.exports = userSUbcategories