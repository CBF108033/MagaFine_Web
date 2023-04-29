import mongoose from 'mongoose';
const columnSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        unique: true
    }
})

export default mongoose.model("Column", columnSchema)