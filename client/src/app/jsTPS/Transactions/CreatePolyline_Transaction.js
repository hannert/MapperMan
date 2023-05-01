import { jsTPS_Transaction } from "../jsTPS";
import * as L from 'leaflet';

export default class CreatePolyline_Transaction extends jsTPS_Transaction {

    constructor(layerGroup, latlngs, properties, featureIndex) {
        super();
        this.layerGroup = layerGroup;
        this.latlngs = latlngs;
        this.properties = properties
        this.featureIndex = featureIndex;
        this.dontDo = true;
    }
    /**
     *  Add back feature with latlngs and properties
     */
    doTransaction() {
        console.log('Making polyline');
        console.log(this.latlngs);
        const polyline = L.polyline(this.latlngs, {draggable:true});
        polyline.dragging.disable();
        console.log(polyline);
        polyline.featureIndex = this.featureIndex;
        polyline.properties = this.properties;
        //Don't add an extra transaction
        polyline.inStack = true;
        this.layerGroup.addLayer(polyline);
    }
    
    /**
     * Find and remove layer from layergroup
     */
    undoTransaction() {
        for(let layer of this.layerGroup.getLayers()){
            if(layer.featureIndex === this.featureIndex){
                //can't search through latlngs like this on everything :(
                this.layerGroup.removeLayer(layer);
            }
        }
    }

}