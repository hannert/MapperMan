import { Box } from "@mui/material";
import MouseButton from './MouseButton';
import AddVertexButton from './AddVertexButton';
import RemoveVertexButton from './RemoveVertexButton';
import PolylineButton from './PolylineButton';
import AddSubregionButton from './AddSubregionButton';
import RemoveFeatureButton from './RemoveFeatureButton';
import MergeSubregionButton from './MergeSubregionsButton';
import UndoButton from './UndoButton';
import RedoButton from './RedoButton';
import PolygonButton from "./PolygonButton";
import MarkerButton from "./MarkerButton";

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
            <MarkerButton></MarkerButton>
            {/* <AddSubregionButton></AddSubregionButton> */}
            <RemoveFeatureButton></RemoveFeatureButton>
            <MergeSubregionButton></MergeSubregionButton>
            <UndoButton></UndoButton>
            <RedoButton></RedoButton>
        </Box>
    )
}