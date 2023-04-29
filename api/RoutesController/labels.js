import Article from "../models/Article.js"
import Label from "../models/Label.js"

export const updateLabelExist = async (req, res, next) => {
    req.hashtags.map(async label=>{
        const Data = await Label.findOne({ labelName: label })
        if (!Data){
            const newLabel = new Label({ labelName: label, articles: [req._id] })
            newLabel.save();//儲存新的label
        }else{//如果有找到label，將文章id加入label的文章陣列並更新
            await Label.findByIdAndUpdate(Data._id, { $push: { articles: req._id } }, { new: true });
            
        }
        return Data;
    })
}

// export const deleteLabel = async (req, res, next) => {
//     const articleID = req
//     const article = await Article.findById(articleID)
//     //console.log(article)
//     article.hashtags.map(async label=>{
//         await Label.findOneAndUpdate({ labelName: label }, { $pull: { articles: articleID } }, { new: true })
//         const data = await Label.findOne({ labelName: label })
//         if (data.articles.length === 0) await Label.findOneAndDelete({ labelName: label })
//     })
// }