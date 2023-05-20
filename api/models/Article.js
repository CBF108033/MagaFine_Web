import mongoose from 'mongoose';
const ArticleSchema = new mongoose.Schema({
    AuthorId: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        required: true
    },
    cover:{
        type: String,
        default: "https://images.unsplash.com/photo-1681397016161-fcdcaf7c2df6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
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
    hearts: {//'愛心數'
        type: [String],
        default: []
    },
    hashtags: {//'標籤#'
        type: [String],
        default: []
    },
    popularity: {//'熱門文章'
        type: Boolean,
        default: false
    },
    comments: [{//'留言'
        type: { type: String, default: NaN },
        date: { type: Date, default: Date },
        userId: { type: String, required: true },
    }],
}, { timestamps: true });

export default mongoose.mongoose.model("Article", ArticleSchema)