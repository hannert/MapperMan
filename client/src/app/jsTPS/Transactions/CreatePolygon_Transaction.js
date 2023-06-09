import { jsTPS_Transaction } from "../jsTPS";
import * as L from 'leaflet';

export default class CreatePolygon_Transaction extends jsTPS_Transaction {

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
        this.socket.emit('create add polygon transaction', room, this.featureIndex, this.latlngArr, this.properties, "add polygon" );


        const polygon = L.polygon(this.latlngs, {draggable:true});
        polygon.dragging.disable();
        console.log(polygon);
        polygon.featureIndex = this.featureIndex;
        polygon.properties = this.properties;
        //Don't add an extra transaction
        this.layerGroup.addLayer(polygon);
    }
    
    /**
     * Find and remove layer from layergroup
     */
    undoTransaction() {

        let room = this.mapId;
        console.log("emitting")
        this.socket.emit('create add polygon transaction', room, this.featureIndex, this.latlngArr, this.properties, "undo add polygon" );

        for(let layer of this.layerGroup.getLayers()){
            if(layer.featureIndex === this.featureIndex){
                //can't search through latlngs like this on everything :(
                
                // add a property like layer.ignore = true so remove event
                // doesn't fire or sometihng like htat still need to think it through
                this.layerGroup.removeLayer(layer);
            }
        }
    }

}