import { Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { editTools, setEditTool } from "../../../app/store-actions/leafletEditing";

export default function CancelButton(props){
    
    // cancel function to stop editing in some mode
    const {cancelFunction, setHidden} = props;
    const dispatch = useDispatch();

    function handleClick(){
        setHidden(true);
        dispatch(setEditTool(null));
        dispatch(cancelFunction());
    }

    return (
        <Button onClick ={handleClick} size="small" sx={{backgroundColor:'gray',
        '&:hover': {
           backgroundColor:'gray',
           filter: 'brightness(0.85)',
        }}}>
            <Typography fontSize={10} variant='overline' sx={{color:'white'}}>
                Cancel
            </Typography>
        </Button>
    )
}