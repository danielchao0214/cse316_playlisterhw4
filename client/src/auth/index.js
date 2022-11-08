import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "./auth-request-api";

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGIN_ERROR: "LOGIN_ERROR",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    REGISTER_ERROR: "REGISTER_ERROR",
};

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: null,
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: null,
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                });
            }
            case AuthActionType.LOGIN_ERROR: {
                return setAuth({
                    user: payload.user,
                    loggedIn: false,
                    errorMessage: payload.errorMessage,
                });
            }
            case AuthActionType.SET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true, //dc should this switch to payload.loggedIn?
                    errorMessage: null,
                });
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: null,
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: null,
                });
            }
            case AuthActionType.REGISTER_ERROR: {
                return setAuth({
                    user: payload.user,
                    loggedIn: false,
                    errorMessage: payload.errorMessage,
                });
            }
            default:
                return auth;
        }
    };

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user,
                },
            });
        }
    };

    auth.registerUser = async function (
        firstName,
        lastName,
        email,
        password,
        passwordVerify
    ) {
        try {
            const response = await api.registerUser(
                firstName,
                lastName,
                email,
                password,
                passwordVerify
            );
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,
                    },
                });
                auth.loginUser(email, password);
            }
        } catch (error) {
            authReducer({
                type: AuthActionType.REGISTER_ERROR,
                payload: {
                    user: error.response.data.user,
                    errorMessage: error.response.data.errorMessage,
                },
            });
        }
    };

    auth.loginUser = async function (email, password) {
        try {
            const response = await api.loginUser(email, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user,
                    },
                });
                history.push("/");
            }
        } catch (error) {
            authReducer({
                type: AuthActionType.LOGIN_ERROR,
                payload: {
                    user: error.response.data.user,
                    errorMessage: error.response.data.errorMessage,
                },
            });
        }
    };

    auth.logoutUser = async function () {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null,
            });
            history.push("/");
        }
    };

    auth.getUserInitials = function () {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    };

    auth.closeModal = function () {
        authReducer({
            type: AuthActionType.LOGIN_ERROR,
            payload: {
                errorMessage: null,
            },
        });
    };

    return (
        <AuthContext.Provider
            value={{
                auth,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };
