import { createSlice } from "@reduxjs/toolkit";
import apis from '../store-requests/store_requests'

const initialState = {
    loggedIn: null,
}


export const createMap = createSlice({
    name: 'modifyMaps',
    initialState,
    reducers: {
        createNewMap: (state, action) => {
            apis.createMap(action.payload);
            
        }
    }


})

export const { createNewMap } = createMap.actions
export default createMap.reducer