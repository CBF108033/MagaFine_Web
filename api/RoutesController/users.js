import User from '../models/User.js';    // import User model
import Article from '../models/Article.js';
import { errorMessage } from "../errorMessage.js";
import bcrypt from "bcryptjs"

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(errorMessage(500, "讀取全部用戶失敗", error))
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userID);
        res.status(200).json(user);
    } catch (error) {
        next(errorMessage(500, "讀取用戶失敗", error))
    }
}
export const getUserInfo = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userID);
        const userData = {
            userName: user.userName,
            email: user.email,
            photo: user.photo,
            role: user.role,
            description: user.description,
            personalizedHashtags: user.personalizedHashtags,
            posterID: user.posterID,
            createdAt: user.createdAt
        }
        res.status(200).json(userData);
    } catch (error) {
        next(errorMessage(500, "讀取用戶資料失敗", error))
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.userID);
        res.status(200).json("使用者成功刪除")
    } catch (error) {
        next(errorMessage(500, "刪除用戶失敗", error))
    }
}

export const updateUser = async (req, res, next) => {
    //密碼更新後再加密
    const salt = bcrypt.genSaltSync(10);
    if (req.body.password) {
        const hashPassword = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hashPassword
    }
    //檢查更新的帳號或信箱是否已被註冊
    const updateUserNameWrong = await User.findOne({ userName: req.body.userName })
    const updateEmailWrong = await User.findOne({ email: req.body.email })
    const originalUser = await User.findById(req.params.userID)//原本的用戶資料
    if (updateUserNameWrong && originalUser.id !== updateUserNameWrong.id) return (next(errorMessage(400, "此使用者名稱已被使用")))
    if (updateEmailWrong && updateEmailWrong.id !== originalUser.id) return (next(errorMessage(400, "錯誤，此信箱已使用")))

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.userID, { $set: req.body }, { new: true });
        res.status(200).json(updateUser);
    } catch (error) {
        next(errorMessage(500, "更改用戶失敗", error))
    }
}

export const updateAuthorLike = async (req, res, next) => {
    const articleID = req.params.articleID
    const userID = req.params.userID
    try {//檢查文章是否已被點讚
        const isLike = await Article.findOne({ _id: articleID, hearts: userID })
        if(isLike){//已點讚，移除愛心
           try {
            const likeUpdate = await Article.findByIdAndUpdate(articleID, { $pull: { hearts: userID } }, { new: true })
            res.status(200).json(likeUpdate);
           } catch (error) {
            next(errorMessage(500, "移除愛心失敗", error))
           }
        }else{//未點讚，新增愛心
            try {
                const likeUpdate = await Article.findByIdAndUpdate(articleID, { $addToSet: { hearts: userID } }, { new: true })
                res.status(200).json(likeUpdate);
            } catch (error) {
                next(errorMessage(500, "新增愛心失敗", error))
            }             
        }
    } catch (error) {
        next(errorMessage(500, "查詢文章愛心失敗", error))
    }

}