import jsTPS_Transaction from "../common/jsTPS.js";
import { editMapPropertyThunk } from "../app/store-actions/leafletEditing.js";
import { setCurrentGeoJSON } from "../app/store-actions/leafletEditing.js";
import { useDispatch, useSelector } from 'react-redux';



/**
 * Represents a transaction that changes the current geoJSON object
 * using the jsondiffpatch library's delta object
 * 
 * Should handle both frontend and backend changes
 * 
 * Maybe could be used as a catch all if its fast enough
 * 
 * Not sure about the interactions with collaborative editing
 */
export default class ChangeGeoJSON_Transaction extends jsTPS_Transaction{
    constructor(initDelta, initOldJson, initjsondiffpatch){
        super();
        this.delta = initDelta;
        this.oldJson = initOldJson;
        this.jsondiffpatch = initjsondiffpatch;
    }

    doTransaction(){
        this.jsondiffpatch.patch(this.oldJson, this.delta);
    }

    undoTransaction(){
        this.jsondiffpatch.unpatch(this.oldJson, this.delta);
    }
    
}