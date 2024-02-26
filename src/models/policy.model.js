const mongoose = require('mongoose')
const Schema = mongoose.Schema

// /**
//  * @swagger
//  * components:
//  *  schemas:
//  *    Policy:
//  *     type : object
//  *     properties:
//  *       _id:
//  *         type: string
//  *         description: Unique mongoid
//  *         example: ''
//  *       type:
//  *        type: string
//  *        example: "about or policy"
//  *       content:
//  *         type: string
//  *         example: "this is content"
//  */


const PolicySchema = new Schema({
    content : { type: String, default: null},
    type : { type: String, default: null},
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })

const Policy = mongoose.model('Policy', PolicySchema)
module.exports = Policy