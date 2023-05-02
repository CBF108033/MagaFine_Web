import React, { useContext, useRef } from 'react'
import './posts.scss'
import useFetch from '../hooks/useFetch'
import Skeleton from './Skeleton'
import { OptionsContext } from '../context/OptionsContext'

const Posts = (props) => {
  const content = useRef(null)
  const text = "大家平常有去探索一下長灘地區的餐廳嗎？我個人時常在長灘附近閒晃，\
  知道這裡漂亮的餐廳還真不少呢！所以在這裡找地方吃飯的時候，也真的十分容易選擇困難\
  症發作！"
  const { searchText, hashtag, type, category, dispatch } = useContext(OptionsContext)
  const searchUrl = `/articles?${hashtag.length !== 0 ? "hashtags=" + hashtag + "&" : ""}${category.length !== 0 ? "category=" + category : ""}`

  const { data, loading, error } = useFetch(searchUrl)
  // const { data, loading, error } = useFetch('/articles')
  console.log(searchUrl, data)

  return (
    <div className='posts' style={props.style}>
      <div className="postContainer">
        <div className="postWrapper" style={props.userPost}>
          {loading ? <Skeleton type="postSkeleton" length={4} /> : data.map((item, index) =>
            <div className="post" key={index}>
              <div className="cover"><img src="https://images.unsplash.com/photo-1681397016161-fcdcaf7c2df6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80" /></div>
              <div className="info">
                <div className="type">{item.category}</div>
                <div className="title">{item.title}</div>
                <div className="authorNdate">
                  <div className="author">{item._id}</div>
                  <div className="date">{item.createdAt}</div>
                </div>
                <div className="content">
                  <p ref={content}></p>
                  {item.content.length > 60 ? item.content.substring(0, 75) + `...` : item.content}
                </div>
              </div>
            </div>
          )}
          {/*<div className="post">
            <div className="cover"><img src="https://images.unsplash.com/photo-1681397016161-fcdcaf7c2df6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80" /></div>
            <div className="info">
              <div className="type">CULTURE & LIVING</div>
              <div className="title">長灘（Long Beach）5 家燈光美、氣
                氛佳的漂亮餐廳，其中一間「巴黎風
                情」滿滿！還能享用到特色甜點?</div>
              <div className="authorNdate">
                <div className="author">JUDY.DMAR</div>
                <div className="date">24, 2023</div>
              </div>
              <div className="content"><p ref={content}>
              </p>{`大家平常有去探索一下長灘地區的餐廳嗎？我個人時常在長灘附近閒晃，知道這裡漂亮的餐廳還真不少呢！所以在這裡找地方吃飯的時候，也真的十分\
                容易選擇困難症發作！`.length > 60 ?
                `大家平常有去探索一下長灘地區的餐廳嗎？我個人時常在長灘附近閒晃，知道這裡漂亮的餐廳還真不少呢！所以在這裡找地方吃飯的時候，也真的十分容易選擇困難症發作！`
                  .substring(0, 75) + `...` :
                `大家平常有去探索一下長灘地區的餐廳嗎？我個人時常在長灘附近閒晃，知道這裡漂亮的餐廳還真不少呢！所以在這裡找地方吃飯的時候，也真的十分容易選擇困難症發作！`}</div>
            </div>
          </div>
          <div className="post">
            <div className="cover"><img src="https://images.unsplash.com/photo-1681493920935-27cb0722b791?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=349&q=80" /></div>
            <div className="info">
              <div className="type">CULTURE & LIVING</div>
              <div className="title">長灘（Long Beach）5 家燈光美、氣
                氛佳的漂亮餐廳，其中一間「巴黎風
                情」滿滿！還能享用到特色甜點?</div>
              <div className="authorNdate">
                <div className="author">JUDY.DMAR</div>
                <div className="date">24, 2023</div>
              </div>
              <div className="content"><p ref={content}>
              </p>{`大家平常有去探索一下長灘地區的餐廳嗎？我個人時常在長灘附近閒晃，知道這裡漂亮的餐廳還真不少呢！所以在這裡找地方吃飯的時候，也真的十分\
                容易選擇困難症發作！`.length > 60 ?
                `大家平常有去探索一下長灘地區的餐廳嗎？我個人時常在長灘附近閒晃，知道這裡漂亮的餐廳還真不少呢！所以在這裡找地方吃飯的時候，也真的十分容易選擇困難症發作！`
                  .substring(0, 75) + `...` :
                `大家平常有去探索一下長灘地區的餐廳嗎？我個人時常在長灘附近閒晃，知道這裡漂亮的餐廳還真不少呢！所以在這裡找地方吃飯的時候，也真的十分容易選擇困難症發作！`}</div>
            </div>
          </div>
          <div className="post">
            <div className="cover"><img src="https://images.unsplash.com/photo-1681493920935-27cb0722b791?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=349&q=80" /></div>
            <div className="info">
              <div className="type">CULTURE & LIVING</div>
              <div className="title">長灘（Long Beach）5 家燈光美、氣
                氛佳的漂亮餐廳，其中一間「巴黎風
                情」滿滿！還能享用到特色甜點?</div>
              <div className="authorNdate">
                <div className="author">JUDY.DMAR</div>
                <div className="date">24, 2023</div>
              </div>
              <div className="content"><p ref={content}>
              </p>{`大家平常有去探索一下長灘地區的餐廳嗎？我個人時常在長灘附近閒晃，知道這裡漂亮的餐廳還真不少呢！所以在這裡找地方吃飯的時候，也真的十分\
                容易選擇困難症發作！`.length > 60 ?
                `大家平常有去探索一下長灘地區的餐廳嗎？我個人時常在長灘附近閒晃，知道這裡漂亮的餐廳還真不少呢！所以在這裡找地方吃飯的時候，也真的十分容易選擇困難症發作！`
                  .substring(0, 75) + `...` :
                `大家平常有去探索一下長灘地區的餐廳嗎？我個人時常在長灘附近閒晃，知道這裡漂亮的餐廳還真不少呢！所以在這裡找地方吃飯的時候，也真的十分容易選擇困難症發作！`}</div>
            </div>
  </div>*/}
        </div>
      </div>
    </div>
  )
}

export default Posts