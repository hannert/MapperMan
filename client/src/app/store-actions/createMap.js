import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: null,
}


export const createMap = createSlice({
    name: 'modifyMaps',
    initialState,
    reducers: {
        createNewMap: (state, action) => {
            state.loggedIn = true
        }
    }


})

export const { createNewMap } = createMap.actions
export default createMap.reducer