import { shapes } from "../../store-actions/leafletEditing";
import { jsTPS_Transaction } from "../jsTPS";
import * as L from 'leaflet';

export default class DeleteVertex_Transaction extends jsTPS_Transaction {

    constructor(layerGroup, latlng, featureIndex, vertexIndex, shape) {
        super();
        this.layerGroup = layerGroup;
        this.latlng = latlng;
        this.featureIndex = featureIndex;
        this.vertexIndex = vertexIndex;
        this.shape = shape;
        this.dontDo = true;
    }

    doTransaction() {
        for(let layer of this.layerGroup.getLayers()){
            if(layer.featureIndex === this.featureIndex){
                //can't search through latlngs like this on everything :(
                if(this.shape === shapes.polygon){
                    for(let latlng of layer._latlngs[0]){
                        if(latlng.equals(this.latlng)){
                            console.log('found it');
                            let idx = layer._latlngs[0].indexOf(latlng);
                            console.log(idx);
                            layer._latlngs[0].splice(idx, 1);
                            
                            console.log('deleted vertex')
                            //absolutely brutal on client side performance
                            layer.redraw();
                            layer.disableEdit();
                            layer.enableEdit();
                        }
                    }
                }
                if(this.shape === shapes.polyline){
                    for(let latlng of layer.getLatLngs()){
                        if(latlng.equals(this.latlng, .1)){
                            console.log('found it');
                            let idx = layer.getLatLngs().indexOf(latlng);
                            console.log(idx);
                            layer.getLatLngs().splice(idx, 1);
                            
                            console.log('deleted vertex')
                            //absolutely brutal on client side performance
                            layer.redraw();
                            layer.disableEdit();
                            layer.enableEdit();
                        }
                    }
                }
            }
        }

    }

    /**
     *  Need to add the vertex to whatever shape had it
     */
    undoTransaction() {
        for(let layer of this.layerGroup.getLayers()){
            
            if(layer.featureIndex === this.featureIndex){
                if(this.shape === shapes.polygon){
                    console.log('found it');
                    console.log('Inserting latlng');
                    console.log(this.latlng);
                    console.log(this.vertexIndex)
                    layer._latlngs[0].splice(this.vertexIndex, 0, this.latlng);
    
                    console.log('added vertex')
                    //absolutely brutal on client side performance
                    layer.redraw();
                    layer.disableEdit();
                    layer.enableEdit();
                }
                if(this.shape === shapes.polyline){
                    console.log('found it');
                    layer._latlngs.splice(this.vertexIndex, 0, this.latlng);
                    
                    console.log('added vertex')
                    //absolutely brutal on client side performance
                    layer.redraw();
                    layer.disableEdit();
                    layer.enableEdit();
                }
            }
        }

    }
}