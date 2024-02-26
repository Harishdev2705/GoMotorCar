const mongoose = require('mongoose')
const Schema = mongoose.Schema
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { jwtSecret } = require('../utility/config')
const roles = ['user', 'business', 'admin'];

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *     type : object
 *     properties:
 *       _id:
 *         type: string
 *         description: Unique mongoid
 *         example: ''
 *       name:
 *         type: string
 *         example: john doe
 *       mobile:
 *         type: string
 *         example: 811256985
 *       email:
 *         type: string
 *         example: test@test.com
 *       role:
 *         type: string
 *         enum:
 *             - user
 *             - superadmin
 *       loginOtp:
 *         type: string
 *         example: 123456
 *       loginOtpExpiryTime:
 *         type: Date
 *         example: Date object
 *       profileImage:
 *         type: string
 *         example: image_path
 *       fcmToken:
 *         type: string
 *         example: fcm tokekn
 *       token:
 *         type: string
 *         example: token for authentication
 *       deviceId:
 *         type: string
 *         example: device
 *       isBlocked:
 *         type: boolean
 *         example: false
 *       isDeleted:
 *         type: boolean
 *         example: false
 */


const userSchema = new Schema({
    role: { type: String,default:"user"},
    name: { type: String, trim: true, maxlength: 128, default: null},
    otp: { type: Number, default: null  },
    // lastname:{ type: String, default:null, maxlength: 128 },
    profile_photo: { type: String, default: null },
    // sampleImages : [{ type: String, default:null }],
    countrycode: { type: String, default: null },
    // customerID: { type: String, default: null },
    mobile: { type: Number, maxlength: 15, default: null },
    usertype: { type: String,default:null},
    // salonMobile: { type: String, maxlength: 15, default: null },
    // salonMobileStatus: { type:Boolean, default: false },
    // personalMobileStatus: { type:Boolean, default: false },
    // smsNotificationMobile: { type: String, maxlength: 15, default: null },
    // businessLocation: { type:Boolean, default: false },
    email: { type: String, trim: true, unique: false },
    businessname: { type: String, default: null },
    business_id: { type: String, default: null },
    cover_photo: { type: String, default: null },
    // address: { type: String, default: null },
    // suite: { type: String, default: null },
    // city: { type:String,default:null},
    // state: { type:String,default:null},
    // zip: { type:String,default:null},
    gender: { type:String,default:null,maxlength: 15 },
    dob: { type:Date,default:null},
    about: { type:String,default:null},
    place: { type:String,default:null},
    Interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userfunctions' }],
    Specialization: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userfunctions' }],
    Dietary: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userfunctions' }],
    opening_hours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'openinghours' }],
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userservices' }],
    profile_status: { type:Number,default:0},
    // specilty: { type:String,default:null},
    // question: { type:String,default:null},
    location: {
        type: { type: String },
        coordinates: [Number],
    },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    password: { type: String, trim: true, minlength: 6 },
    loginOtp: { type: String, trim: true },
    loginOtpExpiryTime: { type: Date },
    logintype: { type: String, default: null },
    socialNo: { type: String, default: null },
    // employeeNo: { type: String, default: null },
    // businessPercentag: { type: Number, default: 0 },
    // ownTitle: { type: String, default: null },
    // website: { type: String, default: null },
     socialId: { type: String, default: null },
     socialType: { type: String, default: null },
     deviceId: { type: String, default: null },
     deviceType: { type: String, default: null },
     deviceName: { type: String, default: null },
     accountID: { type: String, default: null },
    // specificHours: { type: Boolean, default: false },
    // subscription: { 
    //     expDate: { type: Date, default: null },
    //     title : { type: String, default: null },
    //     amount : { type: Number, default: 0},
    //     plan : { type: String, default: "free" },
    //     isActive : { type: Boolean, default: false },
    // },
    // subscriptionService: {
    //     expDate: { type: Date, default: null },
    //     title : { type: String, default: null },
    //     amount : { type: Number, default: 0},
    //     plan : { type: String, default: "free" },
    //     isActive : { type: Boolean, default: false },
    // },
    // advicePhone: { type: Boolean, default: false },
    // accountBooking: { type: Boolean, default: false },
    // SendWithHour: { 
    //     startTime: { type: String, default: null },
    //     endTime: { type: String, default: null },
    // },
     fcmToken: { type: String, default: null },
    // wallet: { type: Number, default: 0 },
    // setupType: { type: Number, default: 0 },
     isMobileVerified: { type: Boolean, default: false },
     isNotification: { type: Boolean, default: false },
    // clientNotification: { type: Boolean, default: false },
     isApproved: { type: Boolean, default: false },
     isVerified: { type: Boolean, default: false },
     token: { type: String, trim: true },
     loginStatus: { type: Boolean, default: false },
    // timings: [{
    //     day: { type:String },
    //     startTime: { type:String },
    //     endTime: { type:String },
    //     isStatus: { type: Boolean }
    // }],
    // instagramLink: { type: String, default: null },
    // facebookLink: { type: String, default: null },
    // twitterLink: { type: String, default: null },
    // businessLink: { type: String, default: null },
    // yelpLink: { type: String, default: null },
    // googleAccountCalander: { type: String, default: null },
    // emailCal: { type: Boolean, default: false },
    // familyCal: { type: Boolean, default: false },
    // ClientAppointment: { type: Boolean, default: false },
    // ClientAppointmentReminder: { type: Boolean, default: false },
    // ClientReviewComms: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true,
    })


userSchema.methods.generateToken = async function () {
    let user = this;
    const token = jwt.sign(
        {
            _id: user._id.toString(),
            role: user.role,
        },
        jwtSecret
    );
    user.token = token
    await user.save();
    return token;
};

const User = mongoose.model('users', userSchema)
module.exports = User