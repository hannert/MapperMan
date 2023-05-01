import { createSlice } from "@reduxjs/toolkit";
import jsTPS from "../jsTPS/jsTPS";
import DeleteVertex_Transaction from "../jsTPS/Transactions/DeleteVertex_Transaction";
import MoveVertex_Transaction from "../jsTPS/Transactions/MoveVertex_Transaction";
import MoveFeature_Transaction from "../jsTPS/Transactions/MoveFeature_Transaction";
import DeleteFeature_Transaction from "../jsTPS/Transactions/DeleteFeature_Transaction";

const initialState = {
    tps: null,
    vertexIndex: null,
    render: false,
    vStartPos: null,
    fStartPos: null
}


export const transactions = createSlice({
    name: 'transactions',
    initialState,
    reducers: {        
        initTps: (state, action) => {
            state.tps = new jsTPS();
        },
        doTransaction: (state, action) => {
            if(state.tps.hasTransactionToRedo()){
                console.log('Did transaction');
                state.tps.doTransaction();
            }
        },
        undoTransaction: (state, action) => {
            if(state.tps.hasTransactionToUndo()){
                console.log('Undid transaction');
                state.tps.undoTransaction();
            }
        },
        addDeleteVertexTransaction: (state, action) => {
            let transaction = new DeleteVertex_Transaction(action.payload.layerGroup, action.payload.latlng, action.payload.featureIndex, state.vertexIndex);
            state.tps.addTransaction(transaction);
        },
        setVertexIndex(state, action){
            state.vertexIndex = action.payload;
        },
        setvStartPos(state, action){
            state.vStartPos = action.payload;
        },
        addMoveVertexTransaction: (state, action) => {
            console.log(state.vStartPos);
            console.log(action.payload.endPos);
            let transaction = new MoveVertex_Transaction(action.payload.layerGroup, action.payload.featureIndex, state.vStartPos, action.payload.endPos);
            state.tps.addTransaction(transaction);
        },
        setfStartPos(state, action){
            state.fStartPos = action.payload;
        },
        addMoveFeatureTransaction: (state, action) => {
            let offsetX = state.fStartPos['lat'] - action.payload.endPos['lat'];
            let offsetY = state.fStartPos['lng'] - action.payload.endPos['lng'];
            
            console.log(offsetX);
            console.log(offsetY);

            let transaction = new MoveFeature_Transaction(action.payload.layerGroup, action.payload.featureIndex, offsetX, offsetY);
            state.tps.addTransaction(transaction);
        },
        addDeleteFeatureTransaction: (state, action) => {
            let transaction = new DeleteFeature_Transaction(action.payload.layerGroup, action.payload.latlngs, action.payload.properties, action.payload.featureIndex);
            state.tps.addTransaction(transaction);
        }
    }
})

export const { initTps, doTransaction, undoTransaction, addDeleteVertexTransaction, setVertexIndex,
    setvStartPos, addMoveVertexTransaction, setfStartPos, addMoveFeatureTransaction, addDeleteFeatureTransaction } = transactions.actions;
export default transactions.reducer;