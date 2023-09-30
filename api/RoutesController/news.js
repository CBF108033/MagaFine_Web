import News from "../models/News.js";
import { errorMessage } from "../errorMessage.js";
import User from "../models/User.js";

export const createNews = async (req, res, next) => {
    const authorID = req.params.userID;
    req.body.AuthorId = authorID;
    const news = new News(req.body)
    try {
        const saveNews = await news.save();
        try {
            await User.findByIdAndUpdate(authorID, { $push: { newsID: saveNews._id } }, { new: true });
        } catch (error) {
            next(500, "找不到此使用者，無法新增News")
        }
        res.status(200).json(saveNews)
    } catch (error) {
        errorMessage(500, "News上傳失敗，可能為格式錯誤", error)
    }
}

export const getNews = async (req, res, next) => {
    try {
        const news = await News.findById(req.params.id);
        res.status(200).json(news);
    } catch (error) {
        next(error)
    }
}

export const getAllNews = async (req, res, next) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.status(200).json(news);
    } catch (error) {
        next(errorMessage(500, "搜尋失敗，為資料庫變動問題", error))
    }
}

export const getUserNews = async (req, res, next) => {
    const getUserID = req.params.userID;
    try {
        const userData = await User.findById(getUserID);
        try {
            const newsList = await Promise.all(userData.newsID.map(newsID => {
                return News.findById(newsID)
            }))
            res.status(200).json(newsList);
        } catch (error) {
            next(errorMessage(500, "找不到此該作者的news", error))
        }
    } catch (error) {
        next(errorMessage(500, "找不到此使用者id，無法查看news", error))
    }
}

export const updatedNews = async (req, res, next) => {
    try {
        const updateNews = await News.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateNews);
    } catch (error) {
        next(errorMessage(500, "news的更新失敗，可能為格式錯誤或是找不到其ID", error))
    }
}

export const deleteNews = async (req, res, next) => {
    const authorID = req.params.userID;

    try {
        try {
            //刪除news
            await News.findByIdAndDelete(req.params.id);
            try {//刪除使用者的news id
                await User.findByIdAndUpdate(authorID, { $pull: { newsID: req.params.id } }, { new: true })
            } catch (error) {
                errorMessage(500, "作者news ID刪除失敗", error)
            }
        } catch (error) {
            errorMessage(500, "找不到此news(ID)", error)
        }

        res.status(200).json("News has been deleted");
    } catch (error) {
        next(errorMessage(500, "刪除失敗，找不到其使用者ID", error))
    }
}