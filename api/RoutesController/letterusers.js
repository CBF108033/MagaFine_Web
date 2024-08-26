import LetterUser from '../models/Letteruser.js';    // import LetterUser model
import { errorMessage } from "../errorMessage.js";

export const getAllLetterUsers = async (req, res, next) => {
    try {
        const users = await LetterUser.find();
        res.status(200).json(users);
    } catch (error) {
        next(errorMessage(500, "讀取全部用戶失敗", error))
    }
}

export const getLetterUser = async (req, res, next) => {
    try {
        const letterUser = await LetterUser.findById(req.params.userID);
        res.status(200).json(letterUser);
    } catch (error) {
        next(errorMessage(500, "讀取用戶失敗", error))
    }
}
export const getLetterUserInfo = async (req, res, next) => {
    try {
        const letterUser = await LetterUser.findById(req.params.userID);
        const letterUserData = {
            userName: letterUser.userName,
            email: letterUser.email,
            lang: letterUser.lang,
            letterImagesTop: letterUser.letterImagesTop,
            letterImagesBottom: letterUser.letterImagesBottom,
            letterImagesFull: letterUser.letterImagesFull,
            unlockDate: letterUser.unlockDate,
            createdAt: letterUser.createdAt
        }
        res.status(200).json(letterUserData);
    } catch (error) {
        next(errorMessage(500, "讀取用戶資料失敗", error))
    }
}

export const updatedLetterUserInfo = async (req, res, next) => {
    try {
        const updatedUser = await LetterUser.findByIdAndUpdate(req.params.userID, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        next(errorMessage(500, "更新用戶失敗", error))
    }
}

export const deleteLetterUser = async (req, res, next) => {
    try {
        await LetterUser.findByIdAndDelete(req.params.userID);
        res.status(200).json("使用者成功刪除")
    } catch (error) {
        next(errorMessage(500, "刪除用戶失敗", error))
    }
}