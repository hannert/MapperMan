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
        }
    }


})

export const { loginUser, createNewMap, setMapList } = editMapList.actions
export default editMapList.reducer