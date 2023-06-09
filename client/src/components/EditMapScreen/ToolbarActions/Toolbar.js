import { Box } from "@mui/material";
import MergeSubregionButton from './MergeSubregionsButton';
import MouseButton from './MouseButton';
import PolygonButton from "./PolygonButton";
import PolylineButton from './PolylineButton';
import RedoButton from './RedoButton';
import RemoveFeatureButton from './RemoveFeatureButton';
import SplitButton from "./SplitButton.js";
import UndoButton from './UndoButton';

export default function Toolbar(){


    return (
        <Box sx={{ marginTop: '200px', marginLeft: '10px', position: 'absolute', left:0, width:'64px', 
        display: 'flex', flexDirection:'column', gap:'10px', zIndex: 999}}>
            {/*Had to explicitly set width to stop buttons from changing width when finish button 
            was clicked. 64 is default value */}
            <MouseButton></MouseButton>
            {/* <AddVertexButton></AddVertexButton> */}
            {/* <RemoveVertexButton></RemoveVertexButton> */}
            <PolylineButton></PolylineButton>
            <PolygonButton></PolygonButton>

            {/* circle is cursed */}
            {/* <AddCircleButton></AddCircleButton> */}

            {/* painful */}
            {/* <MarkerButton></MarkerButton> */}
            {/* <AddSubregionButton></AddSubregionButton> */}
            
            <RemoveFeatureButton></RemoveFeatureButton>
            <MergeSubregionButton></MergeSubregionButton>
            <SplitButton></SplitButton>
            <UndoButton></UndoButton>
            <RedoButton></RedoButton>
        </Box>
    )
}