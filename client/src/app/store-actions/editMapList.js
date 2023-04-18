import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    activeMap: null,
    mapList: [],
    publicRepo: false,
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
        },
        setPublicRepo: (state, action) =>{
            console.log("set public repo");
            console.log(action.payload);
            state.publicRepo = action.payload;
        }
    }


})

export const { loginUser, createNewMap, setMapList, renameMap, deleteMap, setPublicRepo } = editMapList.actions
export default editMapList.reducer

