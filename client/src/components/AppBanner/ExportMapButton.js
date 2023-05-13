import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { IconButton, Tooltip } from '@mui/material';
import { shallowEqual, useSelector } from 'react-redux';

export default function ExportMapButton (props) {
    const mapID = useSelector((state) => state.editMapList.activeMapId, shallowEqual);
    const user = useSelector((state) => state.accountAuth.user);
    const currentMap = useSelector((state) => state.leafletEditing.currentGeoJSON);
    const mapName = useSelector((state) => state.editMapList.activeMapName, shallowEqual);



    function download() {
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(currentMap)], { type: 'text/plain' });
        a.href = URL.createObjectURL(file);
        a.download = mapName + '.json';
        a.click();
    }

    const handleClick = () =>{
        if(!currentMap) return

        download();
    }

    return (
        <Tooltip title='Download map'>
            <IconButton onClick={handleClick}>
                <FileDownloadIcon />
            </IconButton>
        </Tooltip>
        
    )
}