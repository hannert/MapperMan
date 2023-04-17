import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    activeMap: null,
    mapList: [],
    mapMarkedForDeletion: null,
    user: null
}


export const editMapList = createSlice({
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
        setMapList: (state, action) => {
            console.log("Map list set to ");
            console.log(action.payload);
            state.mapList = action.payload;
        },
        renameMap: (state, action) =>{
            console.log("renamed map " + action.payload);
            state.activeMap = action.payload
        },
        deleteMap: (state, action) =>{
            console.log("deleted map!");
            state.activeMap=null;
        }
    }


})

export const { loginUser, createNewMap, setMapList, renameMap, deleteMap } = editMapList.actions
export default editMapList.reducer

