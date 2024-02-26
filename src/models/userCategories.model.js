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


const bu_usercategoriesSchema = new Schema({   
    categoryName: { type: String, trim: true, maxlength: 128, default: null},       
    service_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'services' },
    buserservices_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'buserservices' },
    userservice_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'userservice' },
    subCategories_ids:[{ type: mongoose.Schema.Types.ObjectId, ref: 'subcategories' }],
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    status: { type:Number, default: 1 },// 1 means active
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })
  
const businessusercat = mongoose.model('usercategories', bu_usercategoriesSchema)
module.exports = businessusercat