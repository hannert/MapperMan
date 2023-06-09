
import { jsTPS_Transaction } from "../jsTPS";

export default class MoveVertex_Transaction extends jsTPS_Transaction {

    constructor(layerGroup, featureIndex, subPolyIndex, startPos, endPos, socket, mapId) {
        super();
        this.layerGroup = layerGroup;
        this.featureIndex = featureIndex;
        this.subPolyIndex = subPolyIndex;
        this.startPos = startPos;
        this.endPos = endPos;
        this.dontDo = true;
        this.socket = socket;
        this.mapId = mapId;
    }

    doTransaction() {


        /**SEND TO OTHER CLIENTS */
        let room = this.mapId;
        console.log("emitting")
        this.socket.emit('create move vertex transaction', room, this.featureIndex, this.startPos.lat, this.startPos.lng, this.endPos.lat, this.endPos.lng, "move vertex" );



        for(let layer of this.layerGroup.getLayers()){
            if(layer.featureIndex === this.featureIndex){
                //can't search through latlngs like this on everything :(
                    for(let [i, estrangedPolygon] of layer._latlngs.entries()){
                        // If any child of initial depth is array, there is a GROUPED POLYGON subregion
                        let groupedPolygon = Array.isArray(estrangedPolygon[0])
    
                        if(groupedPolygon === true){
                            for(let [j, lattie] of estrangedPolygon.entries()){
                                for(let [k, latlng] of lattie.entries()){
                                    if(latlng.equals(this.startPos, .000001)){
                                        console.log('moved')
                                        let idx = k;
                                        layer._latlngs[i][j].splice(idx, 1);
                                        layer._latlngs[i][j].splice(idx, 0, this.endPos);
    
                                        //absolutely brutal on client side performance
                                        layer.redraw();
                                        layer.disableEdit();
                                        layer.enableEdit();
                                        return;
                                    }
                                }
                            }
                        }
                        if(groupedPolygon === false){
                            for(let [k, latlng] of estrangedPolygon.entries()){
                                if(latlng.equals(this.startPos, .000001)){
                                    console.log('moved')
                                    let idx = k;
                                    layer._latlngs[i].splice(idx, 1);
                                    layer._latlngs[i].splice(idx, 0, this.endPos);
    
                                    //absolutely brutal on client side performance
                                    layer.redraw();
                                    layer.disableEdit();
                                    layer.enableEdit();
                                    return;
                                }
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
        console.log("emitting")
        this.socket.emit('create move vertex transaction', room, this.featureIndex, this.startPos.lat, this.startPos.lng, this.endPos.lat, this.endPos.lng, "undo move vertex" );

        console.log("SubPolyIndex is ", this.subPolyIndex)



        for(let layer of this.layerGroup.getLayers()){
            if(layer.featureIndex === this.featureIndex){
                console.log(layer)
                //can't search through latlngs like this on everything :(
  
                for(let [i, estrangedPolygon] of layer._latlngs.entries()){
                    // If any child of initial depth is array, there is a GROUPED POLYGON subregion
                    let groupedPolygon = Array.isArray(estrangedPolygon[0])
                    if(groupedPolygon === true){
                        
                        for(let [j, lattie] of estrangedPolygon.entries()){
                            for(let [k, latlng] of lattie.entries()){
                                if(latlng.equals(this.endPos, .000001)){
                                    console.log('moved')
                                    let idx = k;
                                    layer._latlngs[i][j].splice(idx, 1);
                                    layer._latlngs[i][j].splice(idx, 0, this.startPos);

                                    //absolutely brutal on client side performance
                                    layer.redraw();
                                    layer.disableEdit();
                                    layer.enableEdit();
                                    return;
                                }
                            }
                        }
                    }
                    if(groupedPolygon === false){
                        for(let [k, latlng] of estrangedPolygon.entries()){
                            if(latlng.equals(this.endPos, .000001)){
                                console.log('moved')
                                let idx = k;
                                layer._latlngs[i].splice(idx, 1);
                                layer._latlngs[i].splice(idx, 0, this.startPos);

                                //absolutely brutal on client side performance
                                layer.redraw();
                                layer.disableEdit();
                                layer.enableEdit();
                                return;
                            }
                        }
                    }     
                }
            }
        }

    }
}