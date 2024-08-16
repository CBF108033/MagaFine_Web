import { errorMessage } from "../errorMessage.js";
import User from "../models/User.js";
import LetterUser from "../models/Letteruser.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req, res, next) => {
    const registerData = req.body;
    try {
        const registerWrong = await User.findOne({ email: registerData.email }) || await User.findOne({ userName: registerData.userName });
        if (registerWrong) {
            return next(errorMessage(400, "此帳號(名稱)或信箱已被註冊"))
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(registerData.password, salt);
        const newUser = new User({
            userName: registerData.userName,
            role: registerData.role,
            email: registerData.email,
            password: hashPassword,
            photo: registerData.photo,
            description: registerData.description,
            personalizedHashtags: registerData.personalizedHashtags,
        })
        const saveUser = await newUser.save();
        res.status(200).json(saveUser);
    } catch (error) {
        next(errorMessage(500, "註冊失敗，請檢查格式或有無缺漏", error))
    }
}

export const login = async (req, res, next) => {
    const loginData = req.body;
    try{
        if (loginData.account === "" || loginData.password === ""){
            return next(errorMessage(404, "請輸入帳號密碼"))
        }
        const userData = await User.findOne({ email: loginData.account }) || await User.findOne({ userName: loginData.account });
        if (!userData) return (next(errorMessage(404,  "此帳號尚未註冊")))
        //!!!記得加 await
        const isPasswordCorrect = await bcrypt.compare(loginData.password, userData.password);
        if(!isPasswordCorrect) return (next(errorMessage(400, "密碼錯誤")))

        //產生專屬使用者的token
        const token = jwt.sign({ id: userData._id, role: userData.role }, process.env.JWT_SECRET,{ expiresIn: "1h" });
        const { password, role, ...userDetails } = userData._doc;
        res
        .cookie('JWT_token', token, { httpOnly: true })
        .status(200).json({ userDetails });//`${userData.userName}登入成功`

    }catch(error){
        next(errorMessage(500, "登入失敗", error))
    }
}

export const letterLogin = async (req, res, next) => {
    const letterLoginData = req.body;
    try{
        if (letterLoginData.account === "" || letterLoginData.password === ""){
            return next(errorMessage(404, "please enter your NAME and KEY"))
        }
        const letterUserData = await LetterUser.findOne({ email: letterLoginData.account.trim().toLowerCase() }) || await LetterUser.findOne({ userName: letterLoginData.account.trim().toLowerCase() });
        if (!letterUserData) return (next(errorMessage(404,  "NAME not exist")))
        if (letterLoginData.password !== letterUserData.password) return (next(errorMessage(400, "Wrong Key")))

        //產生專屬使用者的token
        const token = jwt.sign({ id: letterUserData._id, role: letterUserData.role }, process.env.JWT_SECRET,{ expiresIn: "1h" });
        const { password, role, ...userDetails } = letterUserData._doc;
        res
        .cookie('JWT_token', token, { httpOnly: true })
        .status(200).json({ userDetails });//`${letterUserData.userName}登入成功`

    }catch(error){
        next(errorMessage(500, "登入失敗", error))
    }
}