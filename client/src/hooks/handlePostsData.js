import { useContext, useEffect, useState } from "react";
import { OptionsContext } from "../context/OptionsContext";
import { new_Options } from "../constants/actionTypes";

const HandlePostsData = (action, text = "", tagSeleted = [], typeSeleted = [], categorySeleted = []) => {
    const [postsData, setPostsData] = useState({})
    const [postloading, setPostsLoading] = useState(false)
    const [posterror, setPostsError] = useState("")
    const { searchText, hashtag, type, category, dispatch } = useContext(OptionsContext)

    useEffect(() => {
        if (action === "getPosts") {
            const fetchData = async () => {
                setPostsLoading(true)
                try {
                    setPostsData({ searchText: searchText, hashtag: hashtag, type: type, category: category })
                } catch (error) {
                    setPostsError(error)
                }
                setPostsLoading(false)
            }
            !postloading && fetchData()
        }
        if (action === "refreshPosts") {
            const fetchData = async () => {
                setPostsLoading(true)
                try {
                    await dispatch({ type: new_Options, payload: { inputText: text, hashtag: tagSeleted, type: typeSeleted, category: categorySeleted } })
                    setPostsData({ "searchText": searchText, "hashtag": hashtag, "type": type, "category": category })
                } catch (error) {
                    setPostsError(error)
                }
                setPostsLoading(false)
            }
            !postloading && fetchData()
        }
    },[])
    console.log(postsData)
    return postsData
}

export default HandlePostsData