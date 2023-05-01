import { Comment, ForkRight } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { Box, Container } from '@mui/system';
import { useState } from "react";
import { useSelector } from "react-redux";
import CollaboratorGroup from "./CollaboratorGroup.js";
import ExportMapButton from "./ExportMapButton.js";
import ForkModal from "./ForkModal.js";

/**
 * This component is a container for the buttons that appear on App Banner when on the ViewMapScreen
 * Responsible for conditional rendering of the buttons. 
 * @returns Box of all of the ViewMapScreen AppBanner Actions
 */
export default function ViewMapActions () {
    // Should contain the comments button and fork map button
    const [forkDialogOpen, setForkDialogOpen] = useState(false);
    const mapName = useSelector((state) => state.editMapList.activeMapName);


    const toggleForkDialog = () => {
        setForkDialogOpen(!forkDialogOpen);
        console.log("Toggled fork dialog")
        console.log(mapName)
    }

    let forkDialog = "";
    forkDialog = (forkDialogOpen) ? <ForkModal open={true} toggleForkDialog={toggleForkDialog}/> : <ForkModal open={false} toggleForkDialog={toggleForkDialog}/> ;

    return (
        <Container>
            <Box>
                <Tooltip title='View comments'>
                    <IconButton>
                        <Comment />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Fork map'>
                    <IconButton>
                        <ForkRight onClick={toggleForkDialog} />
                    </IconButton>
                </Tooltip>
                <ExportMapButton />
                <CollaboratorGroup />
            </Box>

            {forkDialog}
        </Container>
    )

}