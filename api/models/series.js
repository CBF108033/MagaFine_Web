import mongoose from 'mongoose';
const seriesSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        unique: true
    },
})

export default mongoose.model("Series", seriesSchema)