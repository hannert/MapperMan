import { jsTPS_Transaction } from "../jsTPS";
import * as L from 'leaflet';

export default class DeleteFeature_Transaction extends jsTPS_Transaction {

    constructor(layerGroup, latlngs, properties, featureIndex) {
        super();
        this.layerGroup = layerGroup;
        this.latlngs = latlngs;
        this.properties = properties
        this.featureIndex = featureIndex;
        this.dontDo = true;
    }

    /**
     * Find and remove layer from layergroup
     */
    doTransaction() {
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
        for(let layer of this.layerGroup.getLayers()){
            if(layer.featureIndex === this.featureIndex){
                const polygon = L.polygon(this.latlngs, {draggable:true});
                polygon.dragging.disable();
                console.log(polygon);
                polygon.featureIndex = this.featureIndex;
                polygon.properties = this.properties;
                this.layerGroup.addLayer(polygon);
            }
        }

    }
}