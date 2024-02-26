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
 *       type:
 *         type: string
 *         example: 811256985
 *       status:
 *         type: number
 *         example: 1 
 *       isDeleted:
 *         type: boolean
 *         example: false
 */


const businessopeningSchema = new Schema({   
    day: { type: String, trim: true, maxlength: 128, default: null},
    starttimef: { type:Date,default:null},
    starttime: { type:String,default:null},
    endtimef: { type:Date,default:null},
    endtime: { type:String,default:null},
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
    status: { type:Number, default: 1 },// 1 means active
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })

const openinghours = mongoose.model('openinghours', businessopeningSchema)
module.exports = openinghours