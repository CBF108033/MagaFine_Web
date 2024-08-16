import Article from "../models/Article.js";
import { errorMessage } from "../errorMessage.js";
import User from "../models/User.js";
import { updateLabelExist } from "./labels.js";
import Label from "../models/Label.js";
import Column from "../models/Column.js";
import Series from "../models/Series.js";
import { ObjectId } from 'mongodb';

export const createArticle = async (req, res, next) => {
    const authorID = req.params.userID;
    req.body.AuthorId = authorID;
    const article = new Article(req.body)
    try {
        const saveArticle = await article.save();
        try {
            await User.findByIdAndUpdate(authorID, { $push: { posterID: saveArticle._id } }, { new: true });
        } catch (error) {
            next(500, "找不到此使用者，無法上傳文章更新")
        }
        if (saveArticle.disploy !== false) {
            //把label加入label中
            updateLabelExist(saveArticle)
        }
        res.status(200).json(saveArticle)
    } catch (error) {
        errorMessage(500, "文章上傳失敗，可能為格式錯誤", error)
    }
}

export const getArticles = async (req, res, next) => {
    try {
        // const query = { id: req.params.id } || { parentId: req.params.id };
        const id = req.params.id;
        const isValidObjectId = ObjectId.isValid(id);
        const query = {
            $or: [
                isValidObjectId ? { _id: new ObjectId(id) } : null,
                { parentId: id }
            ].filter(Boolean) // 過濾掉 null 值
        };
        // const article = await Article.findById(req.params.id);
        const article = await Article.find(query);
        res.status(200).json(article);
    } catch (error) {
        next(error)
    }
}

export const getAllArticles = async (req, res, next) => {
    const { searchText, hashtags, category, ...withquery } = req.query;//?hashtags=經典,美食餐廳&category=電影
    const searchTextQuery = searchText && { content: { $regex: searchText, $options: "i" } } || "";
    const hashtagsQuery = hashtags && { hashtags: { "$in": hashtags.split(',') } } || {};
    const categoryQuery = category && { category: { "$in": category.split(',') } } || {};
    const disployQuery = { disploy: true } || {};
    const readAccessQuery = { readAccess: '' } || {};
    const parentArticleQuery = { parentId: "" } || {};
    const query = { ...withquery, ...searchTextQuery, ...hashtagsQuery, ...categoryQuery, ...disployQuery, ...readAccessQuery, ...parentArticleQuery };
    try {
        const articles = await Article.find(query).sort({ createdAt: -1 });
        res.status(200).json(articles);
    } catch (error) {
        next(errorMessage(500, "搜尋失敗，為資料庫變動問題", error))
    }
}

export const getUserArticles = async (req, res, next) => {
    const getUserID = req.params.userID;
    try {
        const userData = await User.findById(getUserID);
        try {
            let articleList = await Promise.all(userData.posterID.map(articleID => {
                return Article.findById(articleID)
            }))
            //刪除未發佈的文章
            articleList = articleList.filter(element => element.disploy === true).sort((a, b) => b.createdAt - a.createdAt);
            //刪除僅限管理員閱讀的文章
            articleList = articleList.filter(element => element.readAccess !== 'admin');
            res.status(200).json(articleList);
        } catch (error) {
            next(errorMessage(500, "找不到此該作者的文章", error))
        }
    } catch (error) {
        next(errorMessage(500, "找不到此使用者id，無法查看文章", error))
    }
}

export const getMyselfArticles = async (req, res, next) => {
    const getUserID = req.params.userID;
    try {
        const userData = await User.findById(getUserID);
        try {
            const articleList = await Promise.all(userData.posterID.map(articleID => {
                return Article.findById(articleID)
            }))
            res.status(200).json(articleList);
        } catch (error) {
            next(errorMessage(500, "找不到此該作者的文章", error))
        }
    } catch (error) {
        next(errorMessage(500, "找不到此使用者id，無法查看文章", error))
    }
}

export const updatedArticle = async (req, res, next) => {
    try {
        const updateArticle = await Article.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (updateArticle.disploy === false) {
            //把label從label中刪除
            try {
                updateArticle.hashtags !== 0 ??
                    updateArticle.hashtags.map(async label => {
                        await Label.findOneAndUpdate({ labelName: label }, { $pull: { articles: updateArticle.id } }, { new: true })
                        const data = await Label.findOne({ labelName: label })
                        if (data.articles.length === 0) await Label.findOneAndDelete({ labelName: label })
                    })
            } catch (error) {
                res.status(500).json("無此文章，Label刪除失敗")
            }
        } else {
            //把label加入label中
            updateLabelExist(updateArticle)
        }
        res.status(200).json(updateArticle);
    } catch (error) {
        next(errorMessage(500, "文章的更新失敗，可能為格式錯誤或是找不到其ID", error))
    }
}

export const deleteAticle = async (req, res, next) => {
    const authorID = req.params.userID;
    const articleID = req.params.id;

    try {
        const user = await User.findById(authorID)

        try {
            //deleteLabel(req.params.id)//刪除label的文章id
            //刪除label的文章id
            const article = await Article.findById(articleID)
            try {
                article.hashtags.map(async label => {
                    await Label.findOneAndUpdate({ labelName: label }, { $pull: { articles: articleID } }, { new: true })
                    const data = await Label.findOne({ labelName: label })
                    if (data.articles.length === 0) await Label.findOneAndDelete({ labelName: label })
                })
            } catch (error) {
                res.status(500).json("無此文章，Label刪除失敗")
            }

            //刪除文章
            await Article.findByIdAndDelete(req.params.id);
            try {//刪除使用者的文章id
                await User.findByIdAndUpdate(authorID, { $pull: { posterID: req.params.id } }, { new: true })
            } catch (error) {
                errorMessage(500, "作者文章ID刪除失敗", error)
            }
        } catch (error) {
            errorMessage(500, "找不到此文章(ID)", error)
        }

        res.status(200).json("Article has been deleted");
    } catch (error) {
        next(errorMessage(500, "刪除失敗，找不到其使用者ID", error))
    }
}

export const getAllArticlesType = async (req, res, next) => {
    try {
        const allColumn = await Column.find();
        const allSeries = await Series.find();
        const allArticlesType = {
            column: allColumn,
            series: allSeries
        }
        res.status(200).json(allArticlesType);
    } catch (error) {
        next(error)
    }
}