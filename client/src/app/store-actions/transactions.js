import { createSlice } from "@reduxjs/toolkit";
import jsTPS from "../jsTPS/jsTPS";
import DeleteVertex_Transaction from "../jsTPS/Transactions/DeleteVertex_Transaction";
import MoveVertex_Transaction from "../jsTPS/Transactions/MoveVertex_Transaction";
import MoveFeature_Transaction from "../jsTPS/Transactions/MoveFeature_Transaction";
import DeleteFeature_Transaction from "../jsTPS/Transactions/DeleteFeature_Transaction";
import CreatePolygon_Transaction from "../jsTPS/Transactions/CreatePolygon_Transaction";
import CreatePolyline_Transaction from "../jsTPS/Transactions/CreatePolyline_Transaction";

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
            console.log(state.tps.toString())
            if(state.tps.hasTransactionToRedo()){
                console.log('Did transaction');
                state.tps.doTransaction();
            }
        },
        undoTransaction: (state, action) => {
            console.log(state.tps.toString())
            if(state.tps.hasTransactionToUndo()){
                console.log('Undid transaction');
                state.tps.undoTransaction();
            }
        },
        addDeleteVertexTransaction: (state, action) => {
            let transaction = 
            new DeleteVertex_Transaction(action.payload.layerGroup, action.payload.latlng, 
                action.payload.featureIndex, state.vertexIndex, action.payload.shape, 
                action.payload.socket, action.payload.mapId);
            state.tps.addTransaction(transaction);

            
            /**Send the action to other clients */
            let socket = action.payload.socket;
            let room = action.payload.mapId;
            socket.emit('create delete transaction', room, action.payload.latlng.lat, action.payload.latlng.lng, action.payload.featureIndex, action.payload.vertexIndex, action.payload.shape, "delete vertex" );


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
            let transaction = new MoveVertex_Transaction(action.payload.layerGroup, action.payload.featureIndex, state.vStartPos, action.payload.endPos, action.payload.socket, action.payload.mapId);
            state.tps.addTransaction(transaction);



            let socket = action.payload.socket;
            let room = action.payload.mapId;
            console.log("emitting");
            console.log(transaction)
            socket.emit('create move vertex transaction', room, action.payload.featureIndex, state.vStartPos.lat, state.vStartPos.lng, action.payload.endPos.lat, action.payload.endPos.lng, "move vertex" );
            console.log("heheh")
        },
        setfStartPos(state, action){
            state.fStartPos = action.payload;
        },
        addMoveFeatureTransaction: (state, action) => {
            let offsetX = action.payload.endPos['lat'] - state.fStartPos['lat'];
            let offsetY = action.payload.endPos['lng'] - state.fStartPos['lng'];

            let transaction = new MoveFeature_Transaction(action.payload.layerGroup, action.payload.featureIndex, offsetX, offsetY, action.payload.socket, action.payload.mapId);
            state.tps.addTransaction(transaction);

            let socket = action.payload.socket;
            let room = action.payload.mapId;
            console.log("emitting");
            console.log(transaction)
            socket.emit('create move feature transaction', room, action.payload.featureIndex, offsetX, offsetY, "move feature" );
            console.log("heheh")
        },
        addDeleteFeatureTransaction: (state, action) => {
            console.log('delete transaction');
            let transaction = new DeleteFeature_Transaction(action.payload.layerGroup, action.payload.latlngs, action.payload.properties, action.payload.featureIndex);
            state.tps.addTransaction(transaction);
        },
        addCreatePolygonTransaction: (state, action) => {
            let transaction = new CreatePolygon_Transaction(action.payload.layerGroup, action.payload.latlngs, action.payload.properties, action.payload.featureIndex);
            state.tps.addTransaction(transaction);
        },
        addCreatePolylineTransaction: (state, action) => {
            let transaction = new CreatePolyline_Transaction(action.payload.layerGroup, action.payload.latlngs, action.payload.properties, action.payload.featureIndex);
            state.tps.addTransaction(transaction);
        }
    }
})

export const { initTps, doTransaction, undoTransaction, addDeleteVertexTransaction, setVertexIndex,
    setvStartPos, addMoveVertexTransaction, setfStartPos, addMoveFeatureTransaction, addDeleteFeatureTransaction,
    addCreatePolygonTransaction, addCreatePolylineTransaction } = transactions.actions;
export default transactions.reducer;