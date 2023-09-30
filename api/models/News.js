import mongoose from 'mongoose';
const NewsSchema = new mongoose.Schema({
    AuthorId: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        default: "https://images.unsplash.com/photo-1681397016161-fcdcaf7c2df6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
        required: true
    },
    content: {//'Content of the post'
        type: String,
        required: true
    },
}, { timestamps: true });

export default mongoose.mongoose.model("News", NewsSchema)