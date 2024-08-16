import mongoose from 'mongoose';
const letteruserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lang: {type: String, default: ''},
    letterImagesTop: {
        type: String,
        default: ''
    },
    letterImagesBottom: {
        type: String,
        default: ''
    },
    letterImagesFull: {
        type: String,
        default: ''
    },
    unlockDate: {
        type: Date,
        default: ''
    },
    role: {
        type: String,
        default: 'user'
    }
}, { timestamps: true })
// 在MongoDB 中的集合名稱為letteruser，而在Mongoose 模型中使用了Letteruser。這會導致Mongoose 預設地將模型名稱變成小寫並加上複數形式，即letterusers，從而尋找名為letterusers的集合，而不是letteruser，所以可以在定義模型時明確指定集合名稱。
export default mongoose.model("Letteruser", letteruserSchema, "letterusers")