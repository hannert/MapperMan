import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    activeMap: null,
    mapMarkedForDeletion: null,
    user: null
}


export const createMap = createSlice({
    name: 'editMapList',
    initialState,
    reducers: {
        loginUser: (state, action) => {
            state.user = action.payload.user;
            state.loggedIn = true;
            console.log(action.payload.user);
        },

        createNewMap: (state, action) => {
            console.log("New active map is " + action.payload);
            state.activeMap = action.payload;
        },

        renameMap: (state, action) =>{
            console.log("renamed map " + action.payload);
            state.activeMap = action.payload
        }
    }


})

export const { loginUser, createNewMap, renameMap } = createMap.actions
export default createMap.reducer