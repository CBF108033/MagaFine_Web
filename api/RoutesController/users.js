import User from '../models/User.js';    // import User model
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
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(errorMessage(500, "讀取用戶失敗", error))
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
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
    const originalUser = await User.findById(req.params.id)//原本的用戶資料
    if (updateUserNameWrong && originalUser.id !== updateUserNameWrong.id) return (next(errorMessage(400, "此使用者名稱已被使用")))
    if (updateEmailWrong && updateEmailWrong.id !== originalUser.id) return (next(errorMessage(400, "錯誤，此信箱已使用")))

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateUser);
    } catch (error) {
        next(errorMessage(500, "更改用戶失敗", error))
    }
}