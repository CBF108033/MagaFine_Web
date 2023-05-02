import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    role: {type: String, default: 'user'},
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    photo:{
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    personalizedHashtags: {
        type: [String],
        default: []
    },
    collectionsID: {
        type: [String],
        default: []
    },
    posterID:{
        type: [String],
        default: []
    }
}, { timestamps: true })

export default mongoose.model("User", userSchema)