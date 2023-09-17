import parse, { domToReact } from 'html-react-parser';

//將html轉成react element
export const parseToText = (html,skip) => {
    //將特殊符號移除，要至少四個&nbsp;才會被移除
    html = html.replace(/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/g, "");
    const options = {
        replace: (domNode) => {
            if (domNode.name === skip) {
            console.log(skip)
                // 跳過圖片節點，返回null
                // console.log(domNode.attribs.src)
                return domNode.attribs.hidden = 'hidden';
            }
        },
    };
    const reactElement = parse(html, options);
    // console.log(reactElement)

    return reactElement
};

//計算顯示字數
export const postTextLimit = (text, inputText) => {
    let res = "";
    let shortList = ""
    const lastCharAmount = 25;//搜尋字串後面要顯示的字數
    const firstCharAmount = 25;//搜尋字串前面要顯示的字數
    text.map(i => {
        // console.log(i.props)
        if (i.props?.children||null) shortList += i.props.children
    })

    if (inputText === "") {//沒有搜尋字串時，字數大於55則顯示前75字，小於55則顯示全部
        res = shortList.length > 55 ? shortList.substring(0, 70) + `...` : shortList
    } else {//有搜尋字串時，字數大於55則顯示搜尋字串前後25字，小於55則顯示全部
    
        if (shortList > 55) {//有搜尋字串時，字數大於55則顯示搜尋字串前後25字，小於55則顯示全部
            res = (shortList.substring(0, 70) + `...`).replace(inputText, `<span class="highlight">${inputText}</span>`)
        } else {//關鍵字前的字數小於firstCharAmount時，從0開始且不顯示'...'；否則從關鍵字前的字數開始且前面要加上'...'
            if (Math.max(shortList.indexOf(inputText) - firstCharAmount, 0) > 0){
                res = ('...' + shortList.substring(Math.max(shortList.indexOf(inputText) - firstCharAmount, 0), Math.min(shortList.indexOf(inputText) + inputText.length + lastCharAmount, shortList.length)) + '...').replace(inputText, `<span class="highlight">${inputText}</span>`)
            }else{
                res = (shortList.substring(0, 70) + `...`).replace(inputText, `<span class="highlight">${inputText}</span>`)
            }
        }
        
        res = parseToText(res,'img')
    }
    return res
}

