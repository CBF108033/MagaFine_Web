import jwt from "jsonwebtoken";
import { errorMessage } from "./errorMessage.js";

const JWT_TOKEN = (req, res, next, callBackFuntion) => {
    const token = req.cookies.JWT_token;
    //沒抓到token顯示請先登入
    if(!token) return next(errorMessage(401, "請先登入"))
    jwt.verify(token, process.env.JWT_SECRET,(error, payload) => {
        if(error) return next(errorMessage(401, "TOKEN錯誤，解開JWT失敗"))
        req.userData = payload;
        callBackFuntion();
    })
}

export const verifyUser = (req,res,next) => {
    JWT_TOKEN(req,res,next,()=>{
        const apiUserId = req.params.id
        //只能自己或是admin才能修改
        if(req.userData.id == apiUserId || req.userData.role === "admin"){
            next()
        }else{
            next(errorMessage(403, "權限不足，並非本人或管理員"))
        }
    })
}
export const verifyAdmin = (req,res,next) => {
    JWT_TOKEN(req,res,next,()=>{
        if(req.userData.role === "admin"){
            next()
        }
        //只有admin才能修改
        else{next(errorMessage(403, "權限不足，並非管理員"))}
    })
}