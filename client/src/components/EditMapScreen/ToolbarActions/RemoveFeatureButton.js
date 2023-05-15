import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button, Tooltip } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import CancelButton from "./CancelButton";

import { useDispatch, useSelector } from "react-redux";
import { editTools, removeFeature, setChosenForDeletion, setEditTool, setLayerClickedEditor, setLayerClickedId, startMouseTracking, startRemoveTool, stopMouseTracking, unselectTool } from "../../../app/store-actions/leafletEditing";
import { addDeleteFeatureTransaction } from '../../../app/store-actions/transactions';
import { SocketContext } from '../../../socket';
import * as L from 'leaflet';

export default function RemoveFeatureButton() {

    const [hidden, setHidden] = useState(true);
    const [disabled, setDisabled] = useState(false);

    const dispatch = useDispatch()
    const currentEditTool = useSelector(state => state.leafletEditing.editTool);
    const layerGroup = useSelector(state => state.leafletEditing.layerGroup);
    const chosenForDeletion = useSelector(state => state.leafletEditing.chosenForDeletion);

    const mapId = useSelector((state) => state.editMapList.activeMapId);
    const socket = useContext(SocketContext);

    function handleButtonClick(){
        dispatch(unselectTool());
        console.log('Remove Feature Button Clicked');
        setHidden(false);
        setDisabled(true);
        dispatch(setEditTool(editTools.removeFeature));
    }
    
    const RemoveFeature = (e) => {
        if(chosenForDeletion !== null){
            console.log('removeFeature');
            console.log(chosenForDeletion)
            layerGroup.removeLayer(chosenForDeletion);
            layerGroup.eachLayer(function(layer){
                layer.off(
                    'click'
                );
            });             
            dispatch(setChosenForDeletion(null))
        }else{
            console.log('chooseFeature');
            e.target.setStyle({ color: "red" });
            // e.target.enableEdit();
            console.log(e.target._leaflet_id);
            dispatch(setChosenForDeletion(e.target._leaflet_id));
        }
    }
    useEffect(()=>{
        if(chosenForDeletion !== null){
            console.log(chosenForDeletion);
            console.log('Removed something');
            let arr = []
            let groupedPolygon = Array.isArray(chosenForDeletion._latlngs)

            for(let latlngs of chosenForDeletion._latlngs){
                // If any child of initial depth is array, there is a GROUPED POLYGON subregion

                if(groupedPolygon === true){
                    for(let latlng of latlngs){
                        arr.push(latlng)
                    }
                }
                if(groupedPolygon === false){
                    arr = chosenForDeletion._latlngs
                }     
            }

            console.log(arr);

            dispatch(addDeleteFeatureTransaction({
                layerGroup: layerGroup,
                latlngs: arr,
                properties: chosenForDeletion.properties,
                featureIndex: chosenForDeletion.featureIndex,
                socket: socket,
                mapId: mapId
            }))
        }
    }, [chosenForDeletion])

    // useEffect(()=>{
    //     if (chosenForDeletion !== null){
    //         dispatch(setLayerClickedEditor(layerGroup.getLayer(chosenForDeletion).editor));
    //     }
    //     console.log('Onclick readded')
    //     dispatch(startRemoveTool(RemoveFeature));
    // }, [chosenForDeletion])

    //kind of redunant, but this is to make sure that the button is hidden 
    //when the user switches to a different tool
    useEffect(()=>{
        if(currentEditTool === null){
            setDisabled(false);
        }else if (currentEditTool !== editTools.removeFeature){
            setHidden(true);
            setDisabled(true);
        }
    }, [currentEditTool])

    return (
        <Box sx={{display: 'flex', flexDirection:'row'}}>
            <Tooltip enterDelay={1000} title='Remove Feature' placement='right'>
                <Button disabled={disabled} onClick = {handleButtonClick} variant='contained' sx={{backgroundColor:'#2B2B2B',
                '&:disabled': {
                    backgroundColor:'#2B2B2B',
                    filter: 'brightness(1)',
                    }}}>
                    <ClearIcon />
                </Button>
            </Tooltip>
            { !hidden && <CancelButton setHidden={setHidden} cancelFunction={unselectTool}/>}
        </Box>
    );
}