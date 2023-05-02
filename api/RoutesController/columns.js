import { errorMessage } from '../errorMessage.js';
import Column from '../models/Column.js';

export const createColumn = async (req, res, next) => {
    const column = new Column(req.body)
    try {
        const saveColumn = await column.save();
        res.status(200).json(saveColumn)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(500).json("專欄名稱重複")
        }else errorMessage(500, "專欄建立失敗", error)
    }
}
export const getAllColumns = async (req, res, next) => {
    try {
        const column = await Column.find();
        res.status(200).json(column);
    } catch (error) {
        next(errorMessage(500, "專欄搜尋失敗，為資料庫變動問題", error))
    }
}

export const updatedColumns = async (req, res, next) => {
    try {
        const updateColumn = await Column.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateColumn);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(500).json("專欄名稱重複")
        } else next(errorMessage(500, "專欄的更新失敗，可能為格式錯誤或是找不到其ID", error))
    }
}

export const deleteColumn = async (req, res, next) => {
    try {
        await Column.findByIdAndDelete(req.params.id);
        res.status(200).json("專欄成功刪除")
    } catch (error) {
        next(errorMessage(500, "刪除專欄失敗", error))
    }
}