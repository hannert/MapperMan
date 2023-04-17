import { createSlice } from "@reduxjs/toolkit";
import apis from '../store-requests/auth_requests'

const initialState = {
    loggedIn: null,
}


export const accountsHandler = createSlice({
    name: 'modifyMaps',
    initialState,
    reducers: {
        registerUser: (state, action) => {
            apis.registerUser(action.payload);
        }
    }


})

export const { createNewMap } = accountsHandler.actions
export default accountsHandler.reducer