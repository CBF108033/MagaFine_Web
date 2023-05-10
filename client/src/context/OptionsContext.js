import { createContext, useEffect, useReducer } from "react";
import { clear_Options, new_Options } from "../constants/actionTypes";

const INITIAL_STATE = {
    // inputText:JSON.parse(localStorage.getItem("inputText")) || "",
    // hashtag:JSON.parse(localStorage.getItem("hashtag")) || [],
    // type:JSON.parse(localStorage.getItem("type")) || [],
    // category:JSON.parse(localStorage.getItem("category")) || [],
    inputText: "",
    hashtag: [],
    type: [],
    category: [],
}
export const OptionsContext = createContext(INITIAL_STATE);
const OptionsReducer = (state, action) => {
    switch (action.type) {
        case new_Options:
            return action.payload;
        case clear_Options:
            return INITIAL_STATE;
        default:
            return state;
    }
}

export const OptionsContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(OptionsReducer, INITIAL_STATE);
    // useEffect(() => {
    //     localStorage.setItem("inputText", JSON.stringify(state.inputText));
    //     localStorage.setItem("hashtag", JSON.stringify(state.hashtag));
    //     localStorage.setItem("type", JSON.stringify(state.type));
    //     localStorage.setItem("category", JSON.stringify(state.category));
    // }, [state]);
    return (
        <OptionsContext.Provider 
        value={{
            inputText: state.inputText,
            hashtag: state.hashtag,
            type: state.type,
            category: state.category,
            dispatch,
        }}>
            {children}
        </OptionsContext.Provider>
    )
}