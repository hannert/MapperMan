import { shapes } from "../../store-actions/leafletEditing";
import { jsTPS_Transaction } from "../jsTPS";

export default class DeleteVertex_Transaction extends jsTPS_Transaction {

    constructor(layerGroup, latlng, featureIndex,  vertexIndex, subPolyIndex, shape, socket, mapId) {
        super();
        this.layerGroup = layerGroup;
        this.latlng = latlng;
        this.featureIndex = featureIndex;
        this.vertexIndex = vertexIndex;
        this.subPolyIndex = subPolyIndex;
        this.shape = shape;
        this.dontDo = true;
        this.socket = socket;
        this.mapId = mapId;
    }

    doTransaction() {


        /**SEND TO OTHER CLIENTS: */

        let room = this.mapId;
        console.log("emitting");
        this.socket.emit('create delete transaction', room, this.latlng.lat, this.latlng.lng, this.featureIndex, this.vertexIndex, this.subPolyIndex, this.shape, "delete vertex" )




        for(let layer of this.layerGroup.getLayers()){
            if(layer.featureIndex === this.featureIndex){
                //can't search through latlngs like this on everything :(
                if(this.shape === shapes.polygon){
                    console.log('found it');

                    let groupedPolygon = Array.isArray(layer._latlngs[0])
                    if(layer._latlngs.length > 1 && groupedPolygon === true){
                        console.log("This is a grouped polygon!")
                        console.log(layer._latlngs[this.subPolyIndex])
                        layer._latlngs[this.subPolyIndex][0].splice(this.vertexIndex, 1);
                    } else {
                        layer._latlngs[this.subPolyIndex].splice(this.vertexIndex, 1);
                    }
                    
                    console.log('deleted vertex')
                    //absolutely brutal on client side performance
                    layer.redraw();
                    layer.disableEdit();
                    layer.enableEdit();
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

        let room = this.mapId;
        console.log("emitting");
        this.socket.emit('create delete transaction', room, this.latlng.lat, this.latlng.lng, this.featureIndex, this.vertexIndex, this.subPolyIndex, this.shape, "undo delete vertex" );
        console.log(this.subPolyIndex)

        for(let layer of this.layerGroup.getLayers()){
            
            if(layer.featureIndex === this.featureIndex){
                if(this.shape === shapes.polygon){
                    // console.log('found it');
                    // console.log('Inserting latlng');
                    // console.log(this.latlng);
                    // console.log(this.vertexIndex)
                    console.log('Layer latlngs:',  layer._latlngs)
                    let groupedPolygon = Array.isArray(layer._latlngs[0])
                    if(layer._latlngs.length > 1 && groupedPolygon === true){
                        console.log("This is a grouped polygon!")
                        console.log(layer._latlngs[this.subPolyIndex])
                        layer._latlngs[this.subPolyIndex][0].splice(this.vertexIndex, 0, this.latlng);
                    } else {
                        layer._latlngs[this.subPolyIndex].splice(this.vertexIndex, 0, this.latlng);
                    }
                    
    
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