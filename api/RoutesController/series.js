import { errorMessage } from '../errorMessage.js';
import Series from '../models/Series.js';

export const createSeries = async (req, res, next) => {
    const series = new Series(req.body)
    try {
        const saveSeries = await series.save();
        res.status(200).json(saveSeries)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(500).json("系列名稱重複")
        } else errorMessage(500, "系列建立失敗", error)
    }
}
export const getAllSeries = async (req, res, next) => {
    try {
        const series = await Series.find();
        res.status(200).json(series);
    } catch (error) {
        next(errorMessage(500, "系列搜尋失敗，為資料庫變動問題", error))
    }
}

export const updatedSeries = async (req, res, next) => {
    try {
        const updateSeries = await Series.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updateSeries);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(500).json("系列名稱重複")
        } else next(errorMessage(500, "系列的更新失敗，可能為格式錯誤或是找不到其ID", error))
    }
}

export const deleteSeries = async (req, res, next) => {
    try {
        await Series.findByIdAndDelete(req.params.id);
        res.status(200).json("系列成功刪除")
    } catch (error) {
        next(errorMessage(500, "刪除系列失敗", error))
    }
}