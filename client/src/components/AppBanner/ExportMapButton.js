import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { IconButton, Tooltip, Button, Box } from '@mui/material';
import { shallowEqual, useSelector} from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';




export default function ExportMapButton (props) {
    const mapID = useSelector((state) => state.editMapList.activeMapId, shallowEqual);
    const user = useSelector((state) => state.accountAuth.user);
    const currentMap = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const mapName = useSelector((state) => state.editMapList.activeMapName, shallowEqual);
    const [fileTypeDialogOpen, setFileTypeDialogOpen] = useState(false);


    function downloadGeoJSON() {
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(currentMap)], { type: 'text/plain' });
        a.href = URL.createObjectURL(file);
        a.download = mapName + '.json';
        a.click();
    }

    const handleDeletePropertyConfirm = ()=>{
        setFileTypeDialogOpen(false);
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

        setFileTypeDialogOpen(true);
        downloadGeoJSON();
    }

    const fileTypeDialog = (
        <Box display='flex' justifyContent="center"
        alignItems="center">
        <Dialog open = {fileTypeDialogOpen} >
            <DialogTitle>Select a File Format:</DialogTitle>
            <DialogActions>
                <Button variant = 'contained'>SHP/DBF</Button> <Button variant = 'contained' onClick={handleGeoJSONClick}>GeoJSON</Button>
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
            <IconButton>
                <FileDownloadIcon onClick={handleClick}/>
            </IconButton>
            
        </Tooltip>
        {fileTypeDialog}
        </Box>
        
    )
}