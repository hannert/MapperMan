import { Box } from "@mui/material";
import MouseButton from './MouseButton';
import AddVertexButton from './AddVertexButton';
import RemoveVertexButton from './RemoveVertexButton';
import PolylineButton from './PolylineButton';
import AddSubregionButton from './AddSubregionButton';
import RemoveSubregionButton from './RemoveSubregionButton';
import MergeSubregionButton from './MergeSubregionsButton';
import UndoButton from './UndoButton';
import RedoButton from './RedoButton';

export default function Toolbar(){


    return (
        <Box sx={{ marginTop: '200px', marginLeft: '10px', position: 'absolute', left:0, width:'64px', 
        display: 'flex', flexDirection:'column', gap:'10px', zIndex: 999}}>
            {/*Had to explicitly set width to stop buttons from changing width when finish button 
            was clicked. 64 is default value */}
            
            <MouseButton></MouseButton>
            <AddVertexButton></AddVertexButton>
            <RemoveVertexButton></RemoveVertexButton>
            <PolylineButton></PolylineButton>
            <AddSubregionButton></AddSubregionButton>
            <RemoveSubregionButton></RemoveSubregionButton>
            <MergeSubregionButton></MergeSubregionButton>
            <UndoButton></UndoButton>
            <RedoButton></RedoButton>
        </Box>
    )
}