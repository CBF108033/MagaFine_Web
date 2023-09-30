import React, { useEffect, useState } from 'react'
import './news.scss'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useFetch from '../hooks/useFetch';
import Skeleton from '../components/Skeleton';
import axios from 'axios';
import parse from 'html-react-parser'

window.addEventListener('load', () => {
    const grid = document.getElementById('grid');
    const items = grid.getElementsByClassName('inner-container');

    // 計算每個項目的高度，並設為自動
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const randomHeight = Math.floor(Math.random() * 200 + 100); // 隨機高度範例
        item.style.height = `${randomHeight}px`;
    }
});

const News = () => {
    let [authLoading, setAuthLoading] = useState(false)
    const [authData, setAuthData] = useState([])
    let { data, isLoading, error } = useFetch('/news')

    useEffect(() => {
        setAuthLoading(true)
        const fetchData = async () => {
            const userData = await Promise.all(data.map(async (item, i) => { return await axios.get(`/users/find/${item.AuthorId}`) }))
            setAuthData(userData)
            setAuthLoading(false)
        }
        if (data.length !== 0) {
            fetchData()
        }
    }, [data])
    
    return (
        <div className='News'>
            <div className="top">
                <Navbar />
                <div className="topContainer">
                    <div className="lightBoxs" id='grid'>
                        {isLoading || authLoading ?
                            <Skeleton type="newsSkeleton" length={2} /> :
                            data.length != 0 ?
                                data.map((item, index) =>
                                    <div className="box">
                                        <div className="boxContainer">
                                            <div className="coverImg">
                                                <img src={item.cover} alt="TEST" />
                                            </div>
                                            <div className="context">
                                                <h1>{item.title}</h1>
                                                <div className="authorInfo">
                                                    {authData.length !== 0 && authData.length === data.length && authData[index].data.userName}
                                                    <span className='date'>{item?.createdAt?.slice(0, 10)}</span>
                                                </div>
                                                {parse(item?.content || "")}
                                            </div>
                                        </div>
                                    </div>

                                )
                                :
                                <div className="noResult">沒有新文章</div>
                        }
                        {/* <div className="box">
                            <div className="boxContainer">
                                <div className="coverImg">
                                    <img src="https://images.pexels.com/photos/6480812/pexels-photo-6480812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="TEST" />
                                </div>
                                <div className="context">
                                    <h1>1芭比的出現令女人對自己不滿</h1>
                                    <p>「芭比的出現令女人對自己的出現令女人對自己的出現令女人對自己的出現令女人對自己不滿」，高中學生莎夏的這句話更加令芭比痛入心扉。芭比從來都是女性對自己身材的標準模樣，奈何現實中要把自己打造成芭比的身形根本是沒可能的事，面對難以達到的標準，令女性對自己身形感到厭惡，踏上瘦身減肥這條不歸路，追求一個永遠都不會滿足的理想身形。「芭比的出現令女人對自己不滿」，高中學生莎夏的這句話更加令芭比痛入心扉。芭比從來都是女性對自己身材的標準模樣，奈何現實中要把自己打造成芭比的身形根本是沒可能的事，面對難以達到的標準，令女性對自己身形感到厭惡，踏上瘦身減肥這條不歸路，追求一個永遠都不會滿足的理想身形。</p>
                                </div>
                            </div>
                        </div>
                        <div className="box">
                            <div className="boxContainer">
                                <div className="coverImg">
                                </div>
                                <div className="context">
                                    <h1>2芭比的出現令女人對自己不滿</h1>
                                    <p>「芭比的出現令女人對自己不滿」芭比的出現令女人對自己不滿」芭比的出現令女人對自己不滿」芭比的出現令女人對自己不滿」，高中學生莎夏的這句話更加令芭比痛入心扉。芭比從來都是女性對自己身材的標準模樣，奈何現實中要把自己打造成芭比的身形根本是沒可能的事，面對難以達到的標準，令女性對自己身形感到厭惡，踏上瘦身減肥這條不歸路，追求一個永遠都不會滿足的理想身形。「芭比的出現令女人對自己不滿」，高中學生莎夏的這句話更加令芭比痛入心扉。芭比從來都是女性對自己身材的標準模樣，奈何現實中要把自己打造成芭比的身形根本是沒可能的事，面對難以達到的標準，令女性對自己身形感到厭惡，踏上瘦身減肥這條不歸路，追求一個永遠都不會滿足的理想身形。</p>
                                </div>
                            </div>
                        </div>
                        <div className="box">
                            <div className="boxContainer">
                                <div className="coverImg">
                                </div>
                                <div className="context">
                                    <h1>3芭比的出現令女人對自己不滿</h1>
                                    <p>「芭是女性對自己身材的標準模樣，奈何現實中要把自己打造成芭比的身形根本是沒可能的事，面對難以達到的標準，令女性對自己身形感到厭惡，踏上瘦身減肥這條不歸路，追求一個永遠都不會滿足的理想身形。「芭比的出現令女人對自己不滿」，高中學生莎夏的這句話更加令芭比痛入心扉。芭比從來都是女性對自己身材的標準模樣，奈何現實中要把自己打造成芭比的身形根本是沒可能的事，面對難以達到的標準，令女性對自己身形感到厭惡，踏上瘦身減肥這條不歸路，追求一個永遠都不會滿足的理想身形。</p>
                                </div>
                            </div>
                        </div>
                        <div className="box">
                            <div className="boxContainer">
                                <div className="coverImg">
                                </div>
                                <div className="context">
                                    <h1>4芭比的出現令女人對自己不滿</h1>
                                    <p>「滿」，高中學生莎夏的這句話更加令芭比痛入心扉。芭比從來都是女性對自己身材的標準模樣，奈何現實中要把自己打造成芭比的身形根本是沒可能的事，面對難以達到的標準，令女性對自己身形感到厭惡，踏上瘦身減肥這條不歸路，追求一個永遠都不會滿足的理想身形。「芭比的出現令女人對自己不滿」，高中學生莎夏的這句話更加令芭比痛入心扉。芭比從來都是女性對自己身材的標準模樣，奈何現實中要把自己打造成芭比的身形根本是沒可能的事，面對難以達到的標準，令女性對自己身形感到厭惡，踏上瘦身減肥這條不歸路，追求一個永遠都不會滿足的理想身形。</p>
                                </div>
                            </div>
                        </div>
                        <div className="box">
                            <div className="boxContainer">
                                <div className="coverImg">
                                </div>
                                <div className="context">
                                    <h1>5芭比的出現令女人對自己不滿</h1>
                                    <p>「芭比的出現令女人對自己不滿」，高中學生莎夏的這句話更加令芭比痛入心扉。芭比從來都是女性對自己身材的標準模樣，奈何現實中要把自己打造成芭比的身形根本是沒可能的事，面對難以達到的標準，令女性對自己身形感到厭惡，踏上瘦身減肥這條不歸路，追求一個永遠都不會滿足的理想身形。「芭比的出現令女人對自己不滿」，高中學生莎夏的這句話更加令芭比痛入心扉。芭比從來都是女性對自己身材的標準模樣，奈何現實中要把自己打造成芭比的身形根本是沒可能的事，面對難以達到的標準，令女性對自己身形感到厭惡，踏上瘦身減肥這條不歸路，追求一個永遠都不會滿足的理想身形。</p>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            <div className="bottom">
                <Footer />
            </div>
        </div>
    )
}

export default News
