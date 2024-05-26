import React, { useContext, useEffect, useRef, useState } from 'react'
import './searchbar.scss'
import useFetch from '../hooks/useFetch'
import SearchBarLabels from '../subComponents/SearchBarLabels'
import { OptionsContext } from '../context/OptionsContext'
import { API_URL_AWS, new_Options } from '../constants/actionTypes'
import { useNavigate } from 'react-router-dom'

const Searchbar = (props) => {
    const list = ['專欄', '系列']
    let [list2, setList2] = useState([]);// ['生活', '電影', '旅遊', '美食', '開箱']
    //可用local資料庫嘗試紀錄 減少function
    const [typeSeleted, setTypeSeleted] = useState(-1); //-1代表全部Type，否則顯示選中選項字串(String)
    let [categorySeleted, setCategorySeleted] = useState([]);//[]空字串代表全部category，否則顯示選中選項陣列(Array)
    let [labelSeleted, setLabelSeleted] = useState([])
    const [openSearchView, setOpenSearchView] = useState(false);
    const [allOption, setAllOption] = useState(true);
    const [allType, setAllType] = useState(true);
    const [isOptionChanged, setisOptionChanged] = useState(false);
    const [inputText, setInputText] = useState("");
    const input = useRef(null)
    const navigate = useNavigate()
    props.isOpen(openSearchView) //將openSearchView傳給父層，讓父層Posts判斷是否顯示遮罩

    const { data, isLoading, error } = useFetch(API_URL_AWS + '/articles/allArticlesType/all')
    // console.log(data)

    const { searchText, hashtag, type, category, dispatch } = useContext(OptionsContext)
    const handleSearchBarSubmit = (e) => {
        console.log(typeSeleted, categorySeleted, labelSeleted)
        setOpenSearchView(false)
        dispatch({ type: new_Options, payload: { inputText: inputText, hashtag: labelSeleted, type: typeSeleted, category: categorySeleted } })
        navigate("/")
    }

    useEffect(() => {
        setTypeSeleted(typeSeleted);
        // console.log(typeSeleted, categorySeleted, labelSeleted)//typeSeleted=-1表示全部類別(包含專欄和系列)，categorySeleted=[]表示該類別的全部種類，否則為該類別的選中種類
    }, [isOptionChanged])

    const typeClick = (type) => {
        setTypeSeleted(type);
        setAllOption(true)
        setCategorySeleted([])
    }

    const categoryClick = (item) => {
        console.log(item)
        item !== -1 ? //如果點【全部】，清空複選紀錄，否則將值加入複選陣列
            categorySeleted.includes(item) ? categorySeleted.splice(categorySeleted.indexOf(item), 1) : categorySeleted.push(item)
            :
            categorySeleted = []
        setCategorySeleted(categorySeleted)
        //console.log(categorySeleted)

        // setCategorySeleted(()=>{
        //     console.log(categorySeleted.includes(item))
        //     categorySeleted.includes(item) ? categorySeleted.splice(categorySeleted.indexOf(item),1) : categorySeleted.push(item)
        //     return categorySeleted
        // })
    }
    const [openCategory, setOpenCategory] = useState(false);

    const closeSearchView = () => {
        setOpenSearchView(false)
        input.current.focus();
    }

    const claerSearchData = () => {
        setInputText("")
        setLabelSeleted([])
        setAllType(true)
        setAllOption(true)
        setCategorySeleted([])
        setTypeSeleted(-1)
        dispatch({ type: new_Options, payload: { inputText: "", hashtag: [], type: [], category: [] } })
        closeSearchView()
    }

    useEffect(() => {
        if (openSearchView) { input.current.focus(); }
    }, [openSearchView])

    return (
        <div className='searchbar'>
            <div className="searchbarContent">
                <div className='inputText'>
                    <input type="text" placeholder="搜尋文章..." onClick={() => setOpenSearchView(true)} value={inputText} />
                    {openSearchView && <div className="searchbarView">
                        <div className="searchbarViewContent">
                            <div className="closeSearchView" onClick={() => closeSearchView()}><img src="https://cdn-icons-png.flaticon.com/512/3388/3388658.png" alt="" /></div>
                            <div className='inputField'>
                                <input type="text" ref={input} placeholder='請輸入關鍵字 或 Hashtag (範例: #餐廳)'
                                    onChange={(e) => {
                                        setInputText(e.target.value);
                                        // console.log(e.target.value);
                                        // console.log(inputText)
                                    }} value={inputText} />
                                <div className="clean" onClick={() => claerSearchData()}>
                                    <i class="fa-solid fa-xmark"></i>
                                </div>
                            </div>
                            <SearchBarLabels selectLB={(seleted) => { setLabelSeleted(seleted) }} />
                            <div className="type">
                                <div className="title">
                                    <p className={`${allType ? 'active' : ''}`} onClick={() => { setOpenCategory(false); typeClick(-1); setAllType(true); setisOptionChanged(!isOptionChanged); }}>全部</p>
                                    {list.map((item, i) => {
                                        return <p key={i} className={`${!allType && item === typeSeleted ? 'active' : ''}`}
                                            onClick={() => {
                                                setAllType(false)
                                                typeClick(item)
                                                setisOptionChanged(!isOptionChanged)
                                                if (item === '專欄') {
                                                    setList2(data.column)
                                                    setOpenCategory(true)
                                                }
                                                else if (item === '系列') {
                                                    setList2(data.series)
                                                    setOpenCategory(true)
                                                }
                                                else setOpenCategory(false)
                                            }}>{item}</p>
                                    })}
                                </div>
                                {openCategory &&
                                    <div className="category">
                                        <p className={`${allOption ? 'active' : ''}`} onClick={() => { setAllOption(true); categoryClick(-1); setisOptionChanged(!isOptionChanged); }}>全部</p>
                                        {list2.map((item, i) => {
                                            return <p key={i} className={`${!allOption && categorySeleted.includes(item.category) ? 'active2' : ''}`}
                                                onClick={() => {
                                                    categoryClick(item.category)
                                                    //不知道為什麼要增加一個Boolean useState才能顯示複選，推測是useState陣列內的值的變動和字串內的值變動不算變動，而true/False
                                                    setAllOption(false)
                                                    setisOptionChanged(!isOptionChanged)
                                                }}>{item.category}</p>
                                        })}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>}
                </div>
                <div className='searchBT' onClick={handleSearchBarSubmit}>
                    <img src="https://cdn-icons-png.flaticon.com/512/709/709592.png" alt="放大鏡" />
                </div>
            </div>

        </div>
    )
}

export default Searchbar