
import { jsTPS_Transaction } from "../jsTPS";
import * as L from 'leaflet';

export default class MoveFeature_Transaction extends jsTPS_Transaction {

    constructor(layerGroup, featureIndex, offsetX, offsetY, socket, mapId) {
        super();
        this.layerGroup = layerGroup;
        this.featureIndex = featureIndex;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
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
                console.log('found it');
                //can't search through latlngs like this on everything :(
                for(let latlng of layer._latlngs[0]){
                    latlng['lat'] += this.offsetX;
                    latlng['lng'] += this.offsetY;
                    console.log(latlng['lat'] + ' ' + latlng['lng']);
                }
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
                console.log('found it');
                //can't search through latlngs like this on everything :(
                for(let latlng of layer._latlngs[0]){
                    latlng['lat'] -= this.offsetX;
                    latlng['lng'] -= this.offsetY;     
                    console.log(latlng['lat'] + ' ' + latlng['lng']);           
                }

                layer.redraw();
                layer.disableEdit();
                layer.enableEdit();
            }
        }

    }
}