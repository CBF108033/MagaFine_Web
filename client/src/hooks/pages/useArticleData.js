import { useContext, useEffect, useState } from 'react'
import axios from "axios"
import { API_URL_AWS } from '../../constants/actionTypes'
import { LABEL_CHINESE, LABEL_ENGLISH, LABEL_JAPANESE, LABEL_KOREAN, LABEL_ORIGINAL, LANG_EN, LANG_JP, LANG_KR, LANG_ZH } from '../../constants/string.js';
import { LoginContext } from '../../context/LoginContext.js';


const useArticleData = (articleId) => {
    const [data, setData] = useState(null); // 文章資料
    const [prevNextArticleData, setPrevNextArticleData] = useState(null); // 前後篇文章資料
    const [authData, setAuthData] = useState(null); // 作者資料
    const [isLike, setIsLike] = useState(false); // 是否喜歡
    const [loading, setLoading] = useState(true); // 加載狀態
    const [error, setError] = useState(null); // 錯誤狀態
    const { user } = useContext(LoginContext)

    useEffect(() => {
        /**
         * 抓取文章資料
         */
        async function fetchArticleData() {
            setLoading(true);
            try {
                // 根據特定條件重新渲染時才抓取資料
                const response = await axios.get(`${API_URL_AWS}/articles/${articleId}`)
                const fetchedData = response.data;
                const transformedData = processFetchedData(fetchedData);
                setData(transformedData);
                setIsLike(transformedData?.parentData?.hearts?.includes(user?._id));
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        /**
         * 抓取前篇後篇文章資料
         */
        async function fetchPrevNextArticle() {
            try {
                const response = await axios.get(`${API_URL_AWS}/articles/${articleId}/prev-next`);
                setPrevNextArticleData(response.data);
            } catch (error) {
                setError(error);
            }
        }
        fetchArticleData()
        fetchPrevNextArticle()
        // setData(data?.parentData?.hearts?.includes(user?._id));
    }, [articleId]);

    // 點擊喜歡按鈕後重新抓取資料，不需要顯示loading
    useEffect(() => {
        async function changeLikeState() {
            try {
                // 根據特定條件重新渲染時才抓取資料
                const response = await axios.get(`${API_URL_AWS}/articles/${articleId}`)
                const fetchedData = response.data;
                const transformedData = processFetchedData(fetchedData);
                setData(transformedData);
            } catch (error) {
                setError(error);
            }
        }
        changeLikeState()
    }, [isLike]);

    const processFetchedData = (fetchedData) => {
        let transformedData = {
            parentData: "",
            enData: "",
            zhData: "",
            krData: "",
            jpData: "",
        };
        const sections = [];

        fetchedData?.forEach((e) => {
            if (!e.parentId) {
                transformedData.parentData = e;
                sections.push({ id: 's1', label: LABEL_ORIGINAL, content: e.content || "" });
            } else if (e.lang === LANG_EN) {
                transformedData.enData = e;
                sections.push({ id: 's2', label: LABEL_ENGLISH, content: e.content || "" });
            } else if (e.lang === LANG_ZH) {
                transformedData.zhData = e;
                sections.push({ id: 's5', label: LABEL_CHINESE, content: e.content || "" });
            } else if (e.lang === LANG_KR) {
                transformedData.krData = e;
                sections.push({ id: 's3', label: LABEL_KOREAN, content: e.content || "" });
            } else if (e.lang === LANG_JP) {
                transformedData.jpData = e;
                sections.push({ id: 's4', label: LABEL_JAPANESE, content: e.content });
            }
        });
        transformedData.sections = sections;
        return transformedData;
    }

    // 抓取作者資料
    useEffect(() => {
        if (data?.parentData?.AuthorId) {
            const fetchAuthorData = async () => {
                try {
                    const userData = await axios.get(`${API_URL_AWS}/users/find/${data.parentData.AuthorId}`);
                    setAuthData(userData.data);
                } catch (err) {
                    setError(err);
                }
            };

            fetchAuthorData();
        }
    }, [data]);

    // 喜歡按鈕點擊事件
    const likeBTClick = async () => {
        if (!user) return alert('請先登入');
        try {
            await axios.put(`${API_URL_AWS}/users/like/${user._id}/${articleId}`);
            setIsLike(!isLike);
        } catch (err) {
            console.error("Error liking article:", err);
        }
    };


    return { data, prevNextArticleData, authData, isLike, likeBTClick, loading, error };
}

export default useArticleData