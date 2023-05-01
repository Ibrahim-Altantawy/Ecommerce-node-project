import mongoose, { Schema, model } from "mongoose";


const schema = new Schema({
    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum name lenght is 2 character'],
        max: [20, 'maxmum name lenght is 20 character'],
        lowercase:true,
    },
    gender: {
        type: String,
        default: 'male',
        enum: ['male', 'female']
    },
    email: {
        type: String,
        unique: [true, 'email must be unique'],
        required: [true, 'email is required']
    },
    address: {type:String,required:[true,'address is required']},
    password: {
        type: String,
        required: [true, 'password is required']
    },
    phone: [{type:String,required:[true,'phone is required']}],
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'blocked'],
        default: 'offline'
    }
    ,
    active: {
        type: Boolean,
        default: false
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    image: Object,
    DOB: String,
    forgetCode:{
        type:Number,
        default:null
    },
    changePasswordTime:{type:Date,default:Date.now()},


}, {
    timestamps: true
})




const userModel = mongoose.models.User || model('User', schema);

export default userModel;