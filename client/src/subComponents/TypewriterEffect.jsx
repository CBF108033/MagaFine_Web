import React, { useState, useEffect, useRef } from 'react';
import './typewriterEffect.scss';

const TypewriterEffect = () => {
    const [currentText, setCurrentText] = useState(''); // 目前正在打字的文字
    const [textArray, setTextArray] = useState([]); // 儲存所有已打字出來的文字
    const typewriterTextRef = useRef(null);
    const firstText = "Before opening the envelope,";
    const firstText2 = "you can put on your headphones.";
    const firstText3 = "The music will start playing";
    const firstText4 = "as you begin to read the letter.";
    const speed = 100;

    const typeWriter = async (text) => {
        for (let i = 0; i < text.length; i++) {
            setCurrentText((prev) => prev + text.charAt(i));
            await new Promise((resolve) => setTimeout(resolve, speed));
        }
    };

    let isTyping = false;

    useEffect(() => {
        const runTypewriter = async () => {
            if (!isTyping) {
                isTyping = true;
                await typeWriter(firstText);
                setTextArray((prev) => [...prev, firstText]);
                setCurrentText(''); // 清空 currentText

                setTimeout(async () => {
                    await typeWriter(firstText2);
                    setTextArray((prev) => [...prev, firstText2]);
                    setCurrentText('');
                }, 1000);

                setTimeout(async () => {
                    await typeWriter(firstText3);
                    setTextArray((prev) => [...prev, firstText3]);
                    setCurrentText('');
                }, 6000);

                setTimeout(async () => {
                    await typeWriter(firstText4);
                    setTextArray((prev) => [...prev, firstText4]);
                    setCurrentText('');
                    typewriterTextRef.current.style.display = 'none';
                }, 10000);
            }
        };

        runTypewriter(); 
    }, []);


    return (
        <div className="typewriter">
            {/* 顯示所有已打字出來的文字 */}
            {textArray.map((text, index) => (
                <h1 key={index}>{text}</h1>
            ))}
            {/* 顯示目前正在打字的文字 */}
            <h1 id='typewriter-text' ref={typewriterTextRef}>{currentText}</h1>
        </div>
    );
};

export default TypewriterEffect;