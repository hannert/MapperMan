import { createSlice } from "@reduxjs/toolkit";
import CreatePolygon_Transaction from "../jsTPS/Transactions/CreatePolygon_Transaction";
import CreatePolyline_Transaction from "../jsTPS/Transactions/CreatePolyline_Transaction";
import DeleteFeature_Transaction from "../jsTPS/Transactions/DeleteFeature_Transaction";
import DeleteVertex_Transaction from "../jsTPS/Transactions/DeleteVertex_Transaction";
import MoveFeature_Transaction from "../jsTPS/Transactions/MoveFeature_Transaction";
import MoveVertex_Transaction from "../jsTPS/Transactions/MoveVertex_Transaction";
import jsTPS from "../jsTPS/jsTPS";

const initialState = {
    tps: null,
    vertexIndex: null,
    subPolyIndex: 0,
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
                action.payload.featureIndex, state.vertexIndex, state.subPolyIndex,
                action.payload.shape, action.payload.socket, action.payload.mapId);
            state.tps.addTransaction(transaction);

            
            /**Send the action to other clients */
            let socket = action.payload.socket;
            let room = action.payload.mapId;
            socket.emit('create delete transaction', room, action.payload.latlng.lat, action.payload.latlng.lng, action.payload.featureIndex, action.payload.vertexIndex, action.payload.shape, "delete vertex" );


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
        }
    }
})

export const { initTps, doTransaction, undoTransaction, addDeleteVertexTransaction, setVertexIndex, setSubPolyIndex, setDeleteParams,
    setvStartPos, addMoveVertexTransaction, setfStartPos, addMoveFeatureTransaction, addDeleteFeatureTransaction,
    addCreatePolygonTransaction, addCreatePolylineTransaction } = transactions.actions;
export default transactions.reducer;