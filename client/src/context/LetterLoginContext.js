import { createContext, useEffect, useReducer } from "react";
import { login_failure, login_success, logout, start_login } from "../constants/actionTypes";

const INITIAL_STATE = {
    letterUser: JSON.parse(localStorage.getItem("letterUser")) || null,
    // userId: JSON.parse(localStorage.getItem("userId")) || null,
    loading: false,
    error: null,
}
export const LetterLoginContext = createContext(INITIAL_STATE);
const LetterLoginReducer = (state, action) => {
    switch (action.type) {
        case start_login:
            return {
                letterUser: null,
                // userId: null,
                loading: true,
                error: null
            };
        case login_success:
            return {
                letterUser: action.payload,
                // userId: action.payload._id,
                loading: false,
                error: null
            };
        case login_failure:
            return {
                letterUser: null,
                // userId: null,
                loading: false,
                error: action.payload
            };
        case logout:
            return {
                letterUser: null,
                // userId: null,
                loading: false,
                error: null
            };
        default:
            return state
    }
}
export const LetterLoginContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(LetterLoginReducer, INITIAL_STATE);
    useEffect(() => {
        localStorage.setItem("letterUser", JSON.stringify(state.letterUser))
        // localStorage.setItem("userId", JSON.stringify(state.userId))
    }, [state.letterUser])
    return (
        <LetterLoginContext.Provider value={{
            letterUser: state.letterUser,
            // userId: state.userId,
            loading: state.loading,
            error: state.error,
            unlockCount: state.unlockCount,
            latestUnlockDate: state.latestUnlockDate,
            dispatch
        }}>
            {children}
        </LetterLoginContext.Provider>
    )
}