import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { convertGeoJSONThunk } from '../../app/store-actions/editMapList';




export default function ExportMapButton (props) {
    const mapID = useSelector((state) => state.editMapList.activeMapId, shallowEqual);
    const user = useSelector((state) => state.accountAuth.user);
    const currentMap = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const mapName = useSelector((state) => state.editMapList.activeMapName, shallowEqual);
    const layerGroup = useSelector((state) => state.leafletEditing.layerGroup);
    const [fileTypeDialogOpen, setFileTypeDialogOpen] = useState(false);
    const properties = useSelector((state) => state.leafletEditing.properties);

    const dispatch = useDispatch();


    function downloadGeoJSON() {
        let geoJSON = null;

        try{
            geoJSON = layerGroup.toGeoJSON();
        }catch(e){
            console.log(e)
            // enqueueSnackbar('Error while trying to convert map!', {variant:'error'})
            return
        }
        if(geoJSON === null) return;
        let idx = 0; 
        console.log(properties);
        for(let feature of geoJSON.features){
            feature.properties = properties[idx];
            idx += 1;
            console.log(feature);
        }





        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(geoJSON)], { type: 'text/plain' });
        a.href = URL.createObjectURL(file);
        a.download = mapName + '.json';
        a.click();
    }


    function downloadShpDbf(){
        let geoJSON = null;

        try{
            geoJSON = layerGroup.toGeoJSON();
        }catch(e){
            console.log(e)
            // enqueueSnackbar('Error while trying to convert map!', {variant:'error'})
            return
        }
        if(geoJSON === null) return;
        let idx = 0; 
        console.log(properties);
        for(let feature of geoJSON.features){
            feature.properties = properties[idx];
            idx += 1;
            console.log(feature);
        }


        const a = document.createElement("a");
        dispatch(convertGeoJSONThunk(JSON.stringify(geoJSON))).unwrap().then(async(response) =>{
            const file = new Blob([response], {type: 'application/octet-stream'});
            const filename = mapName + '.zip';
            saveAs(file,filename)
            console.log("saved?!")

        });


        
    }



    const handleCloseDialog = () =>{
        setFileTypeDialogOpen(false);

    }

    const handleClick = () =>{
        if(!currentMap) return

        setFileTypeDialogOpen(true);
        // download();
    }

    const handleGeoJSONClick = () =>{
        if(!currentMap) return

        setFileTypeDialogOpen(false);
        downloadGeoJSON();
    }

    const handleShpDbfClick = () =>{
        if(!currentMap) return

        setFileTypeDialogOpen(false);
        downloadShpDbf();
    }

    const fileTypeDialog = (
        <Box display='flex' justifyContent="center"
        alignItems="center">
        <Dialog open = {fileTypeDialogOpen} >
            <DialogTitle>Select a File Format:</DialogTitle>
            <DialogActions>
                <Button variant = 'contained' onClick={handleShpDbfClick}>SHP/DBF</Button> <Button variant = 'contained' onClick={handleGeoJSONClick}>GeoJSON</Button>
            </DialogActions>
            <DialogActions  sx={{display: 'flex', justifyContent:'center'}}>
                <Button variant = 'contained' onClick={handleCloseDialog} color='error'>Cancel</Button>
            </DialogActions>
        </Dialog>
        </Box>
    )

    return (
        <Box>
        <Tooltip title='Download map'>
            <IconButton onClick={handleClick}>
                <FileDownloadIcon />
            </IconButton>
            
        </Tooltip>
        {fileTypeDialog}
        </Box>
        
    )
}