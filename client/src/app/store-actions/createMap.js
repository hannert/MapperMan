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
            // write an axios request stub for me

            


        }
    }


})

export const { createNewMap } = createMap.actions
export default createMap.reducer