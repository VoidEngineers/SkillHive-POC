import { SIGN_IN, SIGN_UP, SIGN_OUT } from "./ActionType"

const initialValue={
    signup:null,
    signin:null,
    isAuthenticated: false
}

export const AuthReducer=(store=initialValue,{type,payload})=>{
    switch (type) {
        case SIGN_IN:
            return {
                ...store,
                signin: payload,
                isAuthenticated: true
            }
        case SIGN_UP:
            return {
                ...store,
                signup: payload,
                isAuthenticated: true
            }
        case SIGN_OUT:
            localStorage.removeItem("token")
            return {
                ...store,
                signin: null,
                signup: null,
                isAuthenticated: false
            }
        default:
            return store;
    }
}