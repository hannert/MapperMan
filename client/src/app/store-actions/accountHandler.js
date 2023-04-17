import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
}


export const createMap = createSlice({
    name: 'accountHandler',
    initialState,
    reducers: {
        setuser: (state, action) => {
            state.loggedIn = true
        }
    }


})

export const { createNewMap } = createMap.actions
export default createMap.reducer