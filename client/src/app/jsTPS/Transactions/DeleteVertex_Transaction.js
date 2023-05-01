import { jsTPS_Transaction } from "../jsTPS";

export default class DeleteVertex_Transaction extends jsTPS_Transaction {

    constructor(layerGroup, latlng, featureIndex, vertexIndex) {
        super();
        this.layerGroup = layerGroup;
        this.latlng = latlng;
        this.featureIndex = featureIndex;
        this.vertexIndex = vertexIndex;
        this.dontDo = true;
    }

    doTransaction() {
        for(let layer of this.layerGroup.getLayers()){
            if(layer.featureIndex === this.featureIndex){
                //can't search through latlngs like this on everything :(
                for(let latlng of layer._latlngs[0]){
                    if(latlng.equals(this.latlng)){
                        console.log('found it');
                        let idx = layer._latlngs[0].indexOf(latlng);
                        console.log(idx);
                        layer._latlngs[0].splice(idx, 1);
                        
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
                console.log('found it');
                console.log('Inserting latlng');
                console.log(this.latlng);
                console.log(this.vertexIndex)
                layer._latlngs[0].splice(this.vertexIndex, 0, this.latlng);

                //absolutely brutal on client side performance
                layer.redraw();
                layer.disableEdit();
                layer.enableEdit();
            }
        }

    }
}