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


const userFunctionality_listSchema = new Schema({   
    name: { type: String, trim: true, maxlength: 128, default: null, unique:true },    
    status: { type:Number, default: 1 },// 1 means active
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })
  
const functions = mongoose.model('functions', userFunctionality_listSchema)
module.exports = functions