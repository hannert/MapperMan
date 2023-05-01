
import { jsTPS_Transaction } from "../jsTPS";

export default class MoveVertex_Transaction extends jsTPS_Transaction {

    constructor(layerGroup, featureIndex, startPos, endPos) {
        super();
        this.layerGroup = layerGroup;
        this.featureIndex = featureIndex;
        this.startPos = startPos;
        this.endPos = endPos;
        this.dontDo = true;
    }

    doTransaction() {
        for(let layer of this.layerGroup.getLayers()){
            if(layer.featureIndex === this.featureIndex){
                //can't search through latlngs like this on everything :(
                for(let latlng of layer._latlngs[0]){
                    console.log(this.startPos);
                    if(latlng.equals(this.startPos)){
                        console.log('found it');
                        let idx = layer._latlngs[0].indexOf(latlng);
                        layer._latlngs[0].splice(idx, 1);
                        layer._latlngs[0].splice(idx, 0, this.endPos);

                        //absolutely brutal on client side performance
                        layer.redraw();
                        layer.disableEdit();
                        layer.enableEdit();
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
                //can't search through latlngs like this on everything :(
                for(let latlng of layer._latlngs[0]){
                    console.log(this.endPos);
                    if(latlng.equals(this.endPos)){
                        console.log('found it');
                        let idx = layer._latlngs[0].indexOf(latlng);
                        layer._latlngs[0].splice(idx, 1);
                        layer._latlngs[0].splice(idx, 0, this.startPos);

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