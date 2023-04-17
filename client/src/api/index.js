import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from './auth-request-api';

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    CHANGE_PASSWORD: "CHANGE_PASSWORD",
    REGISTER_USER_ERROR: "REGISTER_USER_ERROR",
    LOGIN_USER_ERROR: "LOGIN_USER_ERROR",
    FORGOT_PASSWORD_ERROR: "FORGOT_PASSWORD_ERROR",
    CLOSE_MODAL: "CLOSE_MODAL"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: "Error message goes here!",
        modalActive: false
    });
    const navigate = useNavigate();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    ...auth,
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    ...auth,
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    ...auth,
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                })
            }
            case AuthActionType.REGISTER_USER_ERROR: {
                return setAuth({
                    ...auth,
                    errorMessage: payload.errorMessage,
                    modalActive: true
                })
            }
            case AuthActionType.LOGIN_USER_ERROR: {
                return setAuth({
                    ...auth,
                    errorMessage: payload.errorMessage,
                    modalActive: true
                })
            }
            case AuthActionType.FORGOT_PASSWORD_ERROR: {
                return setAuth({
                    ...auth,
                    errorMessage: payload.errorMessage,
                    modalActive: true
                })
            }
            case AuthActionType.CLOSE_MODAL: {
                return setAuth({
                    ...auth, 
                    modalActive: false
                })
            }
            case AuthActionType.CHANGE_PASSWORD: {
                return setAuth({
                    ...auth,
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }
    auth.forgotPassword = async function(email, newpassword, passwordVerify){
        console.log("Changing Password");
        try {
            const response = await api.forgotPassword(email, newpassword, passwordVerify);
            if (response.status === 200){
                authReducer({
                    type: AuthActionType.CHANGE_PASSWORD,
                    payload: {
                        user: response.data.user,
                        loggedIn: false,
                        errorMessage: null
                    }
                })
                navigate("/login");
            }
        }catch(error){
            authReducer({
                type: AuthActionType.FORGOT_PASSWORD_ERROR,
                payload: {
                    errorMessage: error.response.data.errorMessage
                }
            })
        }
    }

    auth.registerUser = async function(firstName, lastName, username, email, password, passwordVerify) {
        console.log("REGISTERING USER");
        console.log(email)
        try{   
            const response = await api.registerUser(firstName, lastName, username, email, password, passwordVerify);   
            if (response.status === 200) {
                console.log("Registered Sucessfully");
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                })
                navigate("/login");
                console.log("NOW WE LOGIN");
            }
        } catch(error){
            if (error.response.status === 400 || error.response.status === 401) {
                authReducer({
                    type: AuthActionType.REGISTER_USER_ERROR,
                    payload: {
                        errorMessage: error.response.data.errorMessage
                    }
                })
            }
        }
    }

    auth.loginUser = async function(email, password) {
        try{
            const response = await api.loginUser(email, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                })
                navigate("/maps");
            }
        } catch(error){
            authReducer({
                type: AuthActionType.LOGIN_USER_ERROR,
                payload: {
                    errorMessage: error.response.data.errorMessage
                }
            })
        }
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            navigate("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    auth.getUserName = function() {
        let name = "";
        if (auth.user) {
            name += auth.user.firstName + " ";
            name += auth.user.lastName;
        }
        console.log("username: " + name);
        return name;
    }

    auth.closeModal = function() {
        authReducer({
            type: AuthActionType.CLOSE_MODAL
        })
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };
