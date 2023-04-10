import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mapsOwned: [],
    activeMap: null,
    mapMarkedForDeletion: null,
    user: null
}


export const createMap = createSlice({
    name: 'editMapList',
    initialState,
    reducers: {
        createNewMap: (state, action) => {
            state.loggedIn = true
        }
    }


})

export const { createNewMap } = createMap.actions
export default createMap.reducer