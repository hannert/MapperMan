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
        }
    }


})

<<<<<<< HEAD
export const { loginUser, createNewMap, setMapList } = editMapList.actions
export default editMapList.reducer
=======
export const { loginUser, createNewMap, renameMap } = createMap.actions
export default createMap.reducer
>>>>>>> 619ea7e46421a71b3258fc7b2972b4c590295578
