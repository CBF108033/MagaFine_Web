import React, { useEffect, useRef, useState } from 'react'
import './searchbar.scss'

const Searchbar = () => {
    const list = ['專欄', '系列']
    const list2 = ['生活', '電影', '旅遊', '美食', '開箱']
    //可用local資料庫嘗試紀錄 減少function
    const [typeSeleted, setTypeSeleted] = useState(-1); //-1代表全部Type，否則顯示選中選項字串(String)
    let [categorySeleted, setCategorySeleted] = useState([]);//[]空字串代表全部category，否則顯示選中選項陣列(Array)
    const [openSearchView, setOpenSearchView] = useState(false);
    const [allOption, setAllOption] = useState(true);
    const [allType, setAllType] = useState(true);
    const [isOptionChanged, setisOptionChanged] = useState(false);
    const [inputText, setInputText] = useState("");
    const input = useRef(null)
    
    useEffect(() => {
        setTypeSeleted(typeSeleted);
        console.log(typeSeleted,categorySeleted)
    }, [isOptionChanged])

    const typeClick = (type) => {
        setTypeSeleted(type);
        setAllOption(true)
        setCategorySeleted([])
    }

    const categoryClick = (item) => {
        item !== -1 ? //如果點【全部】，清空複選紀錄，否則將值加入複選陣列
            categorySeleted.includes(item) ? categorySeleted.splice(categorySeleted.indexOf(item), 1) : categorySeleted.push(item)
            :
            categorySeleted=[]
        setCategorySeleted(categorySeleted)
        //console.log(categorySeleted)
        
        // setCategorySeleted(()=>{
        //     console.log(categorySeleted.includes(item))
        //     categorySeleted.includes(item) ? categorySeleted.splice(categorySeleted.indexOf(item),1) : categorySeleted.push(item)
        //     return categorySeleted
        // })
    }
    const [openCategory, setOpenCategory] = useState(false);

    const closeSearchView = ()=>{
        setOpenSearchView(false)
        input.current.focus();
        console.log(input.current)
    }

    useEffect(()=>{
        if(openSearchView){input.current.focus();}
    },[openSearchView])

    return (
        <div className='searchbar'>
            <div className="searchbarContent">
                <div className='inputText'>
                    <input type="text" placeholder="搜尋文章..."  onClick={() => setOpenSearchView(true)}/>
                    {openSearchView && <div className="searchbarView">
                        <div className="searchbarViewContent">
                            <div className="closeSearchView" onClick={() => closeSearchView()}><img src="https://cdn-icons-png.flaticon.com/512/3388/3388658.png" alt="" /></div>
                            <input type="text" ref={input} placeholder='請輸入關鍵字 或 Hashtag (範例: #餐廳)' 
                                onChange={(e) => { 
                                    setInputText(e.target.value);
                                    // console.log(e.target.value);
                                    // console.log(inputText)
                                }}value={inputText} />
                            <div className="labels">
                                <div className="title">Hashtag</div>
                                <div className="labelView">
                                    <p className="label">#台南</p>
                                    <p className="label">#餐廳</p>
                                </div>
                            </div>
                            <div className="type">
                                <div className="title">
                                    <p className={`${allType ? 'active' : ''}`} onClick={() => { setOpenCategory(false); typeClick(-1); setAllType(true); setisOptionChanged(!isOptionChanged);}}>全部</p>
                                    {list.map((item, i) => {
                                        return <p key={i} className={`${!allType && item === typeSeleted ? 'active' : ''}`}
                                            onClick={() => {
                                                setAllType(false)
                                                typeClick(item)
                                                setisOptionChanged(!isOptionChanged)
                                                item === '專欄' ? setOpenCategory(true) : setOpenCategory(false)
                                            }}>{item}</p>
                                    })}
                                </div>
                                {openCategory &&
                                    <div className="category">
                                        <p className={`${allOption ? 'active' : ''}`} onClick={() => { setAllOption(true); categoryClick(-1); setisOptionChanged(!isOptionChanged) ;}}>全部</p>
                                        {list2.map((item, i) => {
                                            return <p key={i} className={`${!allOption && categorySeleted.includes(item) ? 'active2' : ''}`}
                                                onClick={() => {
                                                    categoryClick(item)
                                                    //不知道為什麼要增加一個Boolean useState才能顯示複選，推測是useState陣列內的值的變動和字串內的值變動不算變動，而true/False
                                                    setAllOption(false)
                                                    setisOptionChanged(!isOptionChanged)
                                                }}>{item}</p>
                                        })}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>}
                </div>
                <div className='searchBT'>
                    <img src="https://cdn-icons-png.flaticon.com/512/709/709592.png" alt="" />
                </div>
            </div>

        </div>
    )
}

export default Searchbar