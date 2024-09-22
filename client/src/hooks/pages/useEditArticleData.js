import { useContext, useEffect, useState } from 'react'
import axios from "axios"
import { API_URL_AWS } from '../../constants/actionTypes'
import { LABEL_CHINESE, LABEL_ENGLISH, LABEL_JAPANESE, LABEL_KOREAN, LABEL_ORIGINAL, LANG_EN, LANG_JP, LANG_KR, LANG_ZH } from '../../constants/string.js';
import useFetch from '../useFetch.js';
import { LoginContext } from '../../context/LoginContext.js';


const useEditArticleData = (articleId) => {
    const [data, setData] = useState(null);
    const [category, setCategory] = useState([]);
    const langlst = ['parentData', 'zhData', 'enData', 'krData', 'jpData'];
    const [articleStates, setArticleStates] = useState({
        parentData: { title: "", content: null, type: "1", category: "1", hashtags: [], cover: null, disploy: false },
        zhData: { title: "", content: null, type: "1", category: "1", hashtags: [], cover: null, disploy: false },
        enData: { title: "", content: null, type: "1", category: "1", hashtags: [], cover: null, disploy: false },
        krData: { title: "", content: null, type: "1", category: "1", hashtags: [], cover: null, disploy: false },
        jpData: { title: "", content: null, type: "1", category: "1", hashtags: [], cover: null, disploy: false }
    });

    const { user, dispatch } = useContext(LoginContext);
    const { data: fetchedData, loading } = useFetch(API_URL_AWS + '/articles/' + articleId) //data: fetchedData解構對象的鍵值需一致

    useEffect(() => {
        async function fetchArticleData() {
            try {
                // 根據特定條件重新渲染時才抓取資料
                const transformedData = processFetchedData(fetchedData);
                setData(transformedData);
            } catch (error) {
                console.log(error);
            }
        }
        fetchArticleData()
        // setData(data?.parentData?.hearts?.includes(user?._id));
    }, [fetchedData]);

    /**
     * 資料格式轉換
     * @param {*} fetchedData 
     * @returns 
     */
    const processFetchedData = (fetchedData) => {
        let transformedData = {
            parentData: "",
            enData: "",
            zhData: "",
            krData: "",
            jpData: ""
        };
        const sections = [];
        // console.log(data);
        fetchedData?.forEach(e => {
            if (e.parentId == null || e.parentId == "") {
                transformedData.parentData = e;
            } else if (e.lang === LANG_EN) {
                transformedData.enData = e;
            } else if (e.lang === LANG_ZH) {
                transformedData.zhData = e;
            } else if (e.lang === LANG_KR) {
                transformedData.krData = e;
            } else if (e.lang === LANG_JP) {
                transformedData.jpData = e;
            }
        });
        sections.push({ id: 's1', label: LABEL_ORIGINAL, content: transformedData.parentData?.content || "" })
        sections.push({ id: 's2', label: LABEL_ENGLISH, content: transformedData.enData?.content || "" })
        sections.push({ id: 's3', label: LABEL_KOREAN, content: transformedData.krData?.content || "" })
        sections.push({ id: 's4', label: LABEL_JAPANESE, content: transformedData.jpData?.content })
        sections.push({ id: 's5', label: LABEL_CHINESE, content: transformedData.zhData?.content || "" })
        // console.log(transformedData);
        transformedData.sections = sections;
        return transformedData;
    }

    /**
     * 儲存文章資料
     * @param {*} saveData 
     */
    const saveProcess = async (saveData) => {
        try {
            for (let i = 0; i < langlst.length; i++) {
                if (saveData[langlst[i]].content && saveData[langlst[i]].content.length > 0) {
                    const langArticleId = langlst[i] == 'parentData' ? articleId : saveData[langlst[i]]._id;
                    const res = await axios.put(API_URL_AWS + "/articles/" + user._id + "/" + langArticleId, saveData[langlst[i]])
                }
            }
            alert("儲存成功!")
            refreshPage()
        } catch (error) {
            // alert(error.response.data.message)
            console.log(error);
            alert("請重新登入")
        }
    }

    /**
     * 設定種類欄位
     * @param {*} type 
     */
    const setCatagoryField = async (type) => {
        const res = await axios.get(API_URL_AWS + "/articles/allArticlesType/all")
        let category;
        if (type === "系列") {
            category = await Promise.all(res.data.series.map(i => i.category))
            console.log(1, category);
        } else if (type === "專欄") {
            category = await Promise.all(res.data.column.map(i => i.category))
            console.log(2, category);
        }
        setCategory(category)
    }

    /**
     * 儲存指定語系資料
     * @param {*} langKey 
     * @param {*} updates 
     */
    const updateArticleState = (langKey, updates) => {
        setArticleStates((prev) => ({
            ...prev,
            [langKey]: { ...prev[langKey], ...updates }
        }));
    };

    /**
     * 更新文章資料
     * @param {*} updateData 
     */
    const updateArticleData = (updateData, lang = '') => {
        if (updateData === null) return
        if (lang === '') { //更新所有語言的文章資料
            for (let i = 0; i < langlst.length; i++) {
                updateArticleState(langlst[i], updateData[langlst[i]])
            }
        } else { //更新指定語言的文章資料
            updateArticleState(lang, updateData)
        }
    }

    /**
     * 重新整理頁面
     */
    const refreshPage = () => {
        window.location.reload();
    }

    /**
     * 檢查hashtag格式
     * @param {*} e 
     * @param {*} hashtag 
     * @returns 
     */
    const isValidHashtag = (e, hashtag) => {
        const status = { res: false, error: "" };
        if (hashtag === "") {
            status.error = "輸入不得為空";
        } else if (hashtag.length > 10) {
            status.error = "hashtag字數不得超過10字";
        } else if (hashtag.includes("#")) {
            status.error = "hashtag不得包含#";
        } else if (hashtag != "" && articleStates.parentData.hashtags.includes(hashtag)) {
            e.target.value = "";
            status.error = "hashtag不得重複";
        } else {
            status.res = true;
        }
        return status;
    }

    return { data, category, loading, articleStates, saveProcess, setCatagoryField, updateArticleData, isValidHashtag };
}

export default useEditArticleData