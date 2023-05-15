import { jsTPS_Transaction } from "../jsTPS";
import * as L from 'leaflet';

export default class DeleteFeature_Transaction extends jsTPS_Transaction {

    constructor(layerGroup, latlngs, properties, featureIndex, socket, mapId) {
        super();
        this.layerGroup = layerGroup;
        this.latlngs = latlngs;
        this.properties = properties
        this.featureIndex = featureIndex;
        this.dontDo = true;
        this.socket = socket;
        this.mapId = mapId;
    }

    /**
     * Find and remove layer from layergroup
     */
    doTransaction() {

        let room = this.mapId;
        console.log("emitting")
        this.socket.emit('create delete feature transaction', room, this.featureIndex, this.latlngs, this.properties, "delete feature" );



        for(let layer of this.layerGroup.getLayers()){
            if(layer.featureIndex === this.featureIndex){
                //can't search through latlngs like this on everything :(
                this.layerGroup.removeLayer(layer);
            }
        }
    }

    /**
     *  Add back feature with latlngs and properties
     */
    undoTransaction() {


        let room = this.mapId;
        console.log("emitting")
        this.socket.emit('create delete feature transaction', room, this.featureIndex, this.latlngs, this.properties, "undo delete feature" );


        const polygon = L.polygon(this.latlngs, {draggable:true});
        polygon.dragging.disable();
        console.log(polygon);
        polygon.featureIndex = this.featureIndex;
        polygon.properties = this.properties;
        //Don't add an extra transaction

        this.layerGroup.addLayer(polygon);
    }
}