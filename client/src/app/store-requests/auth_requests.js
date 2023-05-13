import axios from 'axios';
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: process.env.REACT_APP_AUTH_URL,
})


// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /register). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const loginUser = (email, password) => {
    return api.post(`/login`, {
        email : email,
        password : password
    })
}
export const logoutUser = () => api.get(`/logout/`)
export const registerUser = (firstName, lastName,username, email, password, passwordVerify) => {
    return api.post(`/register`, {
        firstName : firstName,
        lastName : lastName,
        username: username,
        email : email,
        password : password,
        passwordVerify : passwordVerify
    })
}

export const sendVerification = (email) => {
    return api.post(`/forgotPassword`, {
        email: email
    })
}
export const forgotPassword = (password, passwordVerify, userId, token) => {
    return api.post(`/changePassword/${userId}/${token}`, {
        password: password,
        passwordVerify: passwordVerify,
        userId: userId
    })
}
const authApis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    sendVerification
}

export default authApis
