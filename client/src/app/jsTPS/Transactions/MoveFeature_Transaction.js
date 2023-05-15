
import { jsTPS_Transaction } from "../jsTPS";
import * as L from 'leaflet';

export default class MoveFeature_Transaction extends jsTPS_Transaction {

    constructor(layerGroup, featureIndex, newPos, oldPos, socket, mapId) {
        super();
        this.layerGroup = layerGroup;
        this.featureIndex = featureIndex;
        this.oldPos = oldPos;
        this.newPos = newPos;
        this.dontDo = true;
        this.socket = socket;
        this.mapId = mapId;
    }

    doTransaction() {

        /**SEND TO OTHER CLIENTS: */
        let room = this.mapId;
        console.log("emitting")
        this.socket.emit('create move feature transaction', room, this.featureIndex, this.offsetX, this.offsetY, "move feature" )



        for(let layer of this.layerGroup.getLayers()){
            if(layer.featureIndex === this.featureIndex){
                layer._latlngs = this.newPos;

                layer.redraw();
                layer.disableEdit();
                layer.enableEdit();
            }
        }

    }

    /**
     *  Need to add the vertex to whatever shape had it
     */
    undoTransaction() {

        let room = this.mapId;
        console.log("emitting")
        this.socket.emit('create move feature transaction', room, this.featureIndex, this.offsetX, this.offsetY, "undo move feature" )



        for(let layer of this.layerGroup.getLayers()){
            if(layer.featureIndex === this.featureIndex){
                layer._latlngs = this.oldPos;

                layer.redraw();
                layer.disableEdit();
                layer.enableEdit();
            }
        }

    }
}