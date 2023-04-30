import jsTPS from "../../common/jsTPS";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from 'react-redux';
import ChangeGeoJSON_Transaction from '../../transactions/ChangeGeoJSON_Transaction';


const initialState ={
    jsTPS: new jsTPS()
}

export const transactionProcessing = createSlice({
    name: 'transactionProcessing',
    initialState,
    reducers: {
        /**
         * Add a delta to the transaction stack
         * delta should be created using a copy of the geoJSON in the store that contains
         * the edits, and a copy of the original
         */
        addChangeGeoJSONTransaction : (state, action) =>{
            state.jsTPS.addTransaction(new ChangeGeoJSON_Transaction(action.payload.delta, action.payload.oldJson, action.payload.jsondiffpatch));
        }
    }
});

export const {addChangeGeoJSONTransaction} = transactionProcessing.actions;
export default transactionProcessing.reducer;
