import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApis from "../store-requests/auth_requests";

const initialState = {
    loggedIn: false,
    user: null,
    errorMessage: '',
    modalActive: false,
    guest: false,
}


export const accountAuth = createSlice({
    name: 'accountAuth',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload;
            state.loggedIn = true;
            state.guest = false;
        },
        allowGuest: (state, action) => {
            state.guest = true;
        },
        logout: (state, action) => {
            state.user = null;
            state.loggedIn = false;
            state.guest = false;
        },
        registerUser: (state, action) => {
            state.user = action.payload.user;
            state.loggedIn = true;
        },
        forgotPassword: (state, action) => {
            state.user = action.payload.user;
            state.loggedIn = false;
        },
        sendVerification: (state, action) => {
            state.user = action.payload.user;
            state.loggedIn = false;
        },
        setModalActive: (state, action) => {
            state.modalActive = action.payload;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        }
    }
})

export const { loginUser, allowGuest, logout, registerUser, forgotPassword, setModalActive, setErrorMessage} = accountAuth.actions
export default accountAuth.reducer

export const loginThunk = createAsyncThunk('/login', async (payload, {rejectWithValue}) => {
    try{
        const response = await authApis.loginUser(payload.email, payload.password)
        return response.data;
    } catch (err){
        return rejectWithValue(err.response.data.errorMessage);
    }

    
})

export const logoutThunk = createAsyncThunk('/logout', async (_,  {rejectWithValue}) => {
    try{
        console.log('Logging out');
        const response = await authApis.logoutUser();
        console.log(response);
        return response;        
    } catch (err){
        return rejectWithValue(err.response.data.errorMessage);
    }

})

export const registerUserThunk = createAsyncThunk('/register', async (payload, {rejectWithValue}) => {
    try{
        const response = await authApis.registerUser(payload.firstName, payload.lastName, payload.username, payload.email, payload.password, payload.passwordVerify);
        return response.data;        
    }catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }

})

export const getLoggedInThunk = createAsyncThunk('/getLoggedIn', async (_, {rejectWithValue}) => {
    try{
        const response = await authApis.getLoggedIn();
        return response.data;
    }catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
})
export const forgotPasswordThunk = createAsyncThunk('/forgotPassword', async (payload, {rejectWithValue}) => {
    try {
        const response = await authApis.forgotPassword(payload.email, payload.password, payload.passwordVerify)
        return response.data;
    } catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
})
export const sendVerificationThunk = createAsyncThunk('/sendmail', async (payload, {rejectWithValue}) => {
    try {
        const response = await authApis.sendVerification(payload.email)
        return response.data;
    } catch(err){
        return rejectWithValue(err.response.data.errorMessage);
    }
})