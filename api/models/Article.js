import mongoose from 'mongoose';
const ArticleSchema = new mongoose.Schema({
    AuthorId:{
        type: String,
        default: ""
    },
    title: {
        type: String,
        required: true
    },
    content: {//'Content of the post'
        type: String,
        required: true
    },
    Images: {
        type: String,
    },
    type: {// '系列、專欄'
        type: String,
        required: true
    },
    category: {// '生活、疑難雜症..'
        type: String,
        required: true
    },
    hearts: [{//'按讚的userId'
        type: String
    }],
    hashtags: [{//'標籤#'
        type: String
    }],
    popularity: {//'熱門文章'
        type: Boolean,
        default: false
    },
    comments: [{//'留言'
        type: { type: String, default: NaN},
        date: { type: Date, default: Date },
        userId: { type: String, required: true },
    }],
}, { timestamps: true });

export default mongoose.mongoose.model("Article", ArticleSchema)