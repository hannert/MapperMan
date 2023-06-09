import { createSlice } from "@reduxjs/toolkit";
import CreatePolygon_Transaction from "../jsTPS/Transactions/CreatePolygon_Transaction";
import CreatePolyline_Transaction from "../jsTPS/Transactions/CreatePolyline_Transaction";
import DeleteFeature_Transaction from "../jsTPS/Transactions/DeleteFeature_Transaction";
import DeleteVertex_Transaction from "../jsTPS/Transactions/DeleteVertex_Transaction";
import MoveFeature_Transaction from "../jsTPS/Transactions/MoveFeature_Transaction";
import MoveVertex_Transaction from "../jsTPS/Transactions/MoveVertex_Transaction";
import jsTPS from "../jsTPS/jsTPS";
import * as L from 'leaflet';
const initialState = {
    tps: null,
    vertexIndex: null,
    subPolyIndex: 0,
    render: false,
    vStartPos: null,
    fStartPos: null,
    ping: false,
    removed: null
}


export const transactions = createSlice({
    name: 'transactions',
    initialState,
    reducers: {        
        initTps: (state, action) => {
            state.tps = new jsTPS();
        },
        clearTps: (state, action) => {
            state.tps.clearAllTransactions();
        },
        doTransaction: (state, action) => {
            console.log(state.tps.toString())
            if(state.tps.hasTransactionToRedo()){
                console.log('Did transaction');
                state.tps.doTransaction();
                state.ping = !state.ping;
            }
        },
        undoTransaction: (state, action) => {
            console.log(state.tps.toString())
            if(state.tps.hasTransactionToUndo()){
                console.log('Undid transaction');
                state.tps.undoTransaction();
                state.ping = !state.ping;
            }
        },
        addDeleteVertexTransaction: (state, action) => {
            state.ping = !state.ping;

            let transaction = 
            new DeleteVertex_Transaction(action.payload.layerGroup, action.payload.latlng, 
                action.payload.featureIndex, state.vertexIndex, state.subPolyIndex,
                action.payload.shape, action.payload.socket, action.payload.mapId);
            state.tps.addTransaction(transaction);

            
            /**Send the action to other clients */
            let socket = action.payload.socket;
            let room = action.payload.mapId;
            socket.emit('create delete transaction', room, 
                action.payload.latlng.lat, action.payload.latlng.lng, 
                action.payload.featureIndex, state.vertexIndex, state.subPolyIndex, 
                action.payload.shape, "delete vertex" );


        },
        setVertexIndex(state, action){
            state.vertexIndex = action.payload;
        },
        setSubPolyIndex(state, action){
            state.subPolyIndex = action.payload;
        },
        setDeleteParams(state, action){
            state.vertexIndex = action.payload.vertexIndex;
            state.subPolyIndex = action.payload.subPolyIndex;

        },
        setvStartPos(state, action){
            state.vStartPos = action.payload;
        },
        addMoveVertexTransaction: (state, action) => {
            state.ping = !state.ping;

            console.log(state.vStartPos);
            console.log(action.payload.endPos);
            let transaction = new MoveVertex_Transaction(action.payload.layerGroup, action.payload.featureIndex, action.payload.subPolyIndex, state.vStartPos, action.payload.endPos, action.payload.socket, action.payload.mapId);
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
            state.ping = !state.ping;
            
            //cancer
            let copy = JSON.parse(JSON.stringify(state.fStartPos));
            let temp = [];
            for(let latlng of copy){
                temp.push(L.latLng(latlng.lat, latlng.lng));
            }

            console.log(action.payload.endPos);
            let transaction = new MoveFeature_Transaction(action.payload.layerGroup, action.payload.featureIndex, action.payload.endPos, temp, action.payload.socket, action.payload.mapId);
            state.tps.addTransaction(transaction);

            let socket = action.payload.socket;
            let room = action.payload.mapId;
            console.log("emitting");
            console.log(transaction)
            socket.emit('create move feature transaction', room, action.payload.featureIndex, "move feature" );
            console.log("heheh")
        },
        addDeleteFeatureTransaction: (state, action) => {
            state.ping = !state.ping;

            console.log('delete transaction');
            let transaction = new DeleteFeature_Transaction(action.payload.layerGroup, action.payload.latlngs, action.payload.properties, action.payload.featureIndex, action.payload.socket, action.payload.mapId);
            state.tps.addTransaction(transaction);

            let socket = action.payload.socket;
            let room = action.payload.mapId;
            console.log("emitting");
            console.log(transaction)
            socket.emit('create delete feature transaction', room, action.payload.featureIndex, action.payload.latlngs, action.payload.properties, "delete feature" );
            console.log("heheh")
        },
        addCreatePolygonTransaction: (state, action) => {
            state.ping = !state.ping;

            /**put lat lng pairs in an array so it can be sent thru sockets  */
            let latlngArr = [];
            for(let pair=0; pair<action.payload.latlngs.length; pair++){
                latlngArr.push({
                    lat: action.payload.latlngs[pair].lat,
                    lng: action.payload.latlngs[pair].lng
                })
            }
            console.log(latlngArr)


            let transaction = new CreatePolygon_Transaction(action.payload.layerGroup, action.payload.latlngs, action.payload.properties, action.payload.featureIndex, action.payload.socket, action.payload.mapId, latlngArr);
            state.tps.addTransaction(transaction);

            

            let socket = action.payload.socket;
            let room = action.payload.mapId;
            console.log("emitting");
            console.log(transaction)
            socket.emit('create add polygon transaction', room, action.payload.featureIndex, latlngArr, action.payload.properties, "add polygon" );
            console.log("heheh")
        },
        addCreatePolylineTransaction: (state, action) => {
            state.ping = !state.ping;

            /**put lat lng pairs in an array so it can be sent thru sockets  */
            console.log(action.payload.latlngs)
            
            let latlngArr = [];
            for(let pair=0; pair<action.payload.latlngs.length; pair++){
                latlngArr.push({
                    lat: action.payload.latlngs[pair].lat,
                    lng: action.payload.latlngs[pair].lng
                })
            }
            console.log(latlngArr)

            let transaction = new CreatePolyline_Transaction(action.payload.layerGroup, action.payload.latlngs, action.payload.properties, action.payload.featureIndex, action.payload.socket, action.payload.mapId, latlngArr);
            state.tps.addTransaction(transaction);



            let socket = action.payload.socket;
            let room = action.payload.mapId;
            console.log("emitting");
            console.log(transaction)
            socket.emit('create add polyline transaction', room, action.payload.featureIndex, latlngArr, action.payload.properties, "add polyline" );
            console.log("heheh")
        },
        setRemoved: (state, action) => {
            state.removed = action.payload;
            console.log('Just removed');
            console.log(state.removed);
        }
    }
})

export const { initTps, doTransaction, undoTransaction, addDeleteVertexTransaction, setVertexIndex, setSubPolyIndex, setDeleteParams,
    setvStartPos, addMoveVertexTransaction, setfStartPos, addMoveFeatureTransaction, addDeleteFeatureTransaction,
    addCreatePolygonTransaction, addCreatePolylineTransaction, setRemoved, clearTps } = transactions.actions;
export default transactions.reducer;