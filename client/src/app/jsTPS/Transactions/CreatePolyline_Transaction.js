import { jsTPS_Transaction } from "../jsTPS";
import * as L from 'leaflet';

export default class CreatePolyline_Transaction extends jsTPS_Transaction {

    constructor(layerGroup, latlngs, properties, featureIndex, socket, mapId, latlngArr) {
        super();
        this.layerGroup = layerGroup;
        this.latlngs = latlngs;
        this.properties = properties
        this.featureIndex = featureIndex;
        this.dontDo = true;
        this.socket = socket;
        this.mapId = mapId;
        this.latlngArr = latlngArr;
    }
    /**
     *  Add back feature with latlngs and properties
     */
    doTransaction() {

        let room = this.mapId;
        console.log("emitting")
        this.socket.emit('create add polyline transaction', room, this.featureIndex, this.latlngArr, this.properties, "add polyline" );
        console.log('Making polyline');
        console.log(this.latlngs);
        const polyline = L.polyline(this.latlngs, {draggable:true});
        polyline.dragging.disable();
        console.log(polyline);
        polyline.featureIndex = this.featureIndex;
        polyline.properties = this.properties;
        this.layerGroup.addLayer(polyline);
    }
    
    /**
     * Find and remove layer from layergroup
     */
    undoTransaction() {

        let room = this.mapId;
        console.log("emitting")
        this.socket.emit('create add polyline transaction', room, this.featureIndex, this.latlngArr, this.properties, "undo add polyline" );


        for(let layer of this.layerGroup.getLayers()){
            if(layer.featureIndex === this.featureIndex){
                //can't search through latlngs like this on everything :(
                this.layerGroup.removeLayer(layer);
            }
        }
    }

}