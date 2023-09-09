import React from 'react'
import './skeleton.scss'

const Skeleton = ({ type, length }) => {
    const number = length
    const maxwidth = 5
    const minwidth = 2
    const SearchBarLabelSkeleton = ({ i }) => (
        <p className='skeleton label'
            style={{ width: (Math.floor(Math.random() * (maxwidth - minwidth + 1)) + minwidth) * 10 + 'px' }}>
        </p>

    )
    const PostSkeleton = ({ i }) => (
        <div className="skeleton post" key={i}>
            <div className="skeleton cover" />
            <div className="skeleton info">
                <div className="skeleton type"></div>
                <div className="skeleton title"></div>
                <div className="skeleton authorNdate">
                    <div className="skeleton author"></div>
                    <div className="skeleton date"></div>
                </div>
                <div className="skeleton content" />
            </div>
        </div>
    )

    const HomePageSkeleton = ({ i }) => (
        <div className="skeleton HomePageArticleItem" key={i}></div>
    )
    const HomePageSkeleton_total = ({ i }) => (
        <div className="skeleton HomePageArticleItem-total" key={i}></div>
    )

    if (type === "searchBarLabel") {
        return (
            <div className="skeleton labelView">
                {Array(number).fill().map((item, i) => <SearchBarLabelSkeleton key={i} />)}
            </div>
        )
    }
    //用Array來排列這麼多的遮罩，假設說我們傳入為7，那他就會生成7個遮罩，取代原本的資料列 .map() 來把array列陣同時又加index不然又會有error發生
    else if (type === "postSkeleton") {
        return Array(number).fill().map((item, i) => <PostSkeleton key={i} />)
    }
    //amount 不用是因為他有上面得data.js的UI內資料不像PopularHotels是整個傳過來的資料總數都不確定
    //而Amount是因為是我們的測試做的type與city就都知道有這麼多就不用在傳入length告訴他要生成多少個遮罩
    else if (type ==="HomePageSkeleton"){
        return Array(number).fill().map((item, i) => <HomePageSkeleton key={i} />)
    }
    else if(type ==="HomePageSkeleton_total"){
        return <HomePageSkeleton_total/>
    }
}

export default Skeleton