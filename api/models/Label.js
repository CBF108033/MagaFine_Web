import mongoose from 'mongoose';
const labelSchema = new mongoose.Schema({
    labelName: {
        type: String,
        required: true,
    },
    articles: {
        type: [String],
        default: []
    }
})

export default mongoose.model("Label", labelSchema)