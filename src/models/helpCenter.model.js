const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * @swagger
 * components:
 *  schemas:
 *    Policy:
 *     type : object
 *     properties:
 *       _id:
 *         type: string
 *         description: Unique mongoid
 *         example: ''
 *       type:
 *        type: string
 *        example: "user or business_user"
 *       question:
 *         type: string
 *         example: "this is content"
 *       answer:
 *         type: string
 *         example: "this is content"
 */


const HelpSchema = new Schema({
    question : { type: String, default: null},
    answer : { type: String, default: null},
    type : { type: String, default: null},
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })

const Help = mongoose.model('Help', HelpSchema)
module.exports = Help