import React, { useContext, useEffect, useRef, useState } from 'react'
import './letter.scss'
import { LetterLoginContext } from '../context/LetterLoginContext';
import { useNavigate } from 'react-router-dom';
import TypewriterEffect from '../subComponents/TypewriterEffect';
import { API_URL_AWS, login_success } from '../constants/actionTypes';
import axios from 'axios';

const Letter = () => {
    const [isLetterOpen, setIsLetterOpen] = useState(false);
    const letterBoxRef = useRef(null);
    const paperFrontRef = useRef(null);
    const paperBottomRef = useRef(null);
    const paperBackRef = useRef(null);
    const letterBackRef = useRef(null);
    const letterFaceRef = useRef(null);
    const letterFullRef = useRef(null);
    const letterFullImgRef = useRef(null);
    const letterTipRef = useRef(null);
    const downloadRef = useRef(null);
    const [isTypewriterVisible, setIsTypewriterVisible] = useState(false);
    const audioTyping = useRef(new Audio('/media/typing.mp3')).current; //用useRef包裝audio元素，使其在每次渲染時不會被重新創建，在整個元件的生命週期中都是唯一的
    const { letterUser, dispatch } = useContext(LetterLoginContext)
    const navigate = useNavigate();
    let unlockCount = null;
    let latestUnlockDate = null;
    let firstUnlock = null;

    useEffect(() => {
        if (!letterUser) {
            alert('Please unlock your mailbox first')
            navigate("/letterLogin")
        }
    }, [letterUser])

    useEffect(() => {
        if (letterUser?.unlockDate !== null ) {
            unlockCount = letterUser?.unlockCount + 1;
        } else {
            firstUnlock = new Date();
            unlockCount = 1;
        }
        latestUnlockDate = new Date();
    }, [letterUser])

    const save = async () => {
        if (firstUnlock) {
            const res = await axios.put(API_URL_AWS + '/letterusers/' + letterUser?._id,
                { 'unlockCount': unlockCount, 'latestUnlockDate': latestUnlockDate, 'unlockDate': firstUnlock }
            )
            dispatch({ type: login_success, payload: res.data })
        } else {
            const res = await axios.put(API_URL_AWS + '/letterusers/' + letterUser?._id,
                { 'unlockCount': unlockCount, 'latestUnlockDate': latestUnlockDate }
            )
            dispatch({ type: login_success, payload: res.data })
        }
    }

    useEffect(() => {
        letterUser && save()
    }, [unlockCount, latestUnlockDate, firstUnlock])

    const readyToGo = () => {
        letterTipRef.current.style.display = 'none';
        setIsTypewriterVisible(true);

        audioTyping.volume = 1;
        audioTyping.currentTime = 5;
        audioTyping.play();

        audioTyping.play().then(() => {
            // 設定停止播放時間
            setTimeout(() => {
                audioTyping.pause();  // 停止播放
            }, 16000); // 16秒後停止
        }).catch(error => {
            console.log('Failed to play audio:', error);
        });
    }

    const openEnvelope = () => {
        const letterBox = letterBoxRef.current;
        const paperFront = paperFrontRef.current;
        const paperBottom = paperBottomRef.current;
        const paperBack = paperBackRef.current;
        const letterBack = letterBackRef.current;
        const letterFace = letterFaceRef.current;
        const letterFull = letterFullRef.current;
        const letterFullImg = letterFullImgRef.current;

        paperBottom.style.backgroundImage = `url(${letterUser?.letterImagesBottom || '../../images/sampleLetterBottom.jpg'})`;

        // 關閉typing音效
        audioTyping.pause();
        // 先加入打開信封的動畫
        letterBox.classList.add('open');
        paperBack.style.display = 'none';
        // letterBox增加open後就不能在點擊了
        letterBox.style.pointerEvents = 'none';
        // 信封打開後，文字消失
        setIsTypewriterVisible(false);


        // 計算螢幕高度並設置scaleY比例
        const screenHeight = window.innerHeight;
        const combinedHeight = paperFront.offsetHeight + paperBottom.offsetHeight;

        // 兩者高度相加不超過螢幕長度
        const scaleFactor = Math.min(screenHeight / combinedHeight, 1);

        // letterBack和letterFace的在打開信封的動畫結束後，隱藏
        letterBack.addEventListener('transitionend', () => {
            letterBack.style.display = 'none';
            letterFace.style.display = 'none';
        });

        setTimeout(() => {
            const audio = new Audio('/media/paper-flip.mp3');
            audio.play();
        }, 1500);

        setTimeout(() => {
            paperFront.style.backgroundImage = `url(${letterUser?.letterImagesTop || '../../images/sampleLetterTop.jpg'})`;
        }, 2100);

        // 旋轉一半時（大約1.5秒後）切換背景圖片
        setTimeout(() => {
            paperFront.classList.add('halfway');
        }, 2300);

        // 信紙展開後，隱藏信封，顯示信件，並放大信件
        setTimeout(() => {
            const widthPaperBottom2 = paperBottom.offsetWidth;
            letterFull.style.display = 'flex';
            letterFullImg.style.width = `${widthPaperBottom2 / 1.81}px`;
            letterBox.style.display = 'none';
            const audio = new Audio('/media/HelloGoodbye&Hello_piano.mp3');
            audio.volume = 0.3;
            audio.loop = true;
            audio.play();
        }, 3000);

        // 信件放大後，再放大一次
        setTimeout(() => {
            letterFullImg.style.width = `100%`;
            letterFullImg.style.height = 'auto';
        }, 3200);

        setTimeout(() => {
            const letter = document.querySelector('.letter');
            const letterFullImg2 = document.querySelector('.letter-full img');
            downloadRef.current.style.display = 'flex';
            if (window.innerWidth >= 768 && letterFullImg2.clientHeight > window.innerHeight) {
                letter.style.height = `${letterFullImg2.clientHeight}px`;
                letterFullImg2.style.top = 'initial';
            } else {
                letter.style.height = '100vh';
                letterFullImg2.style.top = '0';
            }
            setIsLetterOpen(true);
        }, 4500);

    }

    const checkScreenSize = () => {
        const letter = document.querySelector('.letter');
        const letterFullImg2 = document.querySelector('.letter-full img');
        if (letterFullImg2.clientHeight > window.innerHeight) {
            letter.style.height = `${letterFullImg2.clientHeight}px`;
            letterFullImg2.style.top = 'initial';
        } else {
            letter.style.height = '100vh';
            letterFullImg2.style.top = '0';
        }
    }
    window.addEventListener('resize', () => {
        if (isLetterOpen) checkScreenSize();
    });

    return (
        <div className='letter'>
            <div className='letter-tip' ref={letterTipRef}>
                <div className='button' onClick={() => readyToGo()}>
                    <span>For {letterUser?.userName || 'you'}</span>
                    <span style={{ fontSize: '20px' }}>touch to start</span>
                </div>
            </div>
            {isTypewriterVisible && <TypewriterEffect />}
            <div class="letter-animation-box" ref={letterBoxRef} onClick={() => openEnvelope()}>
                <div class="letter-back" ref={letterBackRef}></div>
                <div class="letter-face" ref={letterFaceRef}></div>
                <div class="paper-top">
                    <div class="paper-back" ref={paperBackRef}></div>
                    <div class="paper-front" ref={paperFrontRef}></div>
                    <div class="paper-bottom" ref={paperBottomRef}></div>
                </div>
            </div>
            <div class="letter-full" ref={letterFullRef}>
                <img src={letterUser?.letterImagesFull || '../../images/sampleLetterFull.jpg'} alt="full letter" ref={letterFullImgRef} />
            </div>
            <div className='download' style={{ display: 'none' }} ref={downloadRef}>
                {/* <span class="material-symbols-outlined"> */}
                <a class="material-symbols-outlined" target='_blank' href={letterUser?.dataSource}>
                    download
                </a>
                {/* </span> */}
            </div>
            {/* Sound Effect by <a href="https://pixabay.com/zh/users/floraphonic-38928062/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=196721">floraphonic</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=196721">Pixabay</a> */}
        </div>
    )
}

export default Letter