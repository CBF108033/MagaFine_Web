import { createContext, useEffect, useReducer } from "react";
import { login_failure, login_success, logout, start_login } from "../constants/actionTypes";

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    // userId: JSON.parse(localStorage.getItem("userId")) || null,
    loading: false,
    error: null,
}
export const LoginContext = createContext(INITIAL_STATE);
const LoginReducer = (state, action) => {
    switch (action.type) {
        case start_login:
            return {
                user: null,
                // userId: null,
                loading: true,
                error: null
            };
        case login_success:
            return {
                user: action.payload,
                // userId: action.payload._id,
                loading: false,
                error: null
            };
        case login_failure:
            return {
                user: null,
                // userId: null,
                loading: false,
                error: action.payload
            };
        case logout:
            return {
                user: null,
                // userId: null,
                loading: false,
                error: null
            };
        default:
            return state
    }
}
export const LoginContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(LoginReducer, INITIAL_STATE);
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user))
        // localStorage.setItem("userId", JSON.stringify(state.userId))
    }, [state.user])
    return (
        <LoginContext.Provider value={{
            user: state.user,
            // userId: state.userId,
            loading: state.loading,
            error: state.error,
            dispatch
        }}>
            {children}
        </LoginContext.Provider>
    )
}