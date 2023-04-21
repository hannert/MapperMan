import { Button, Typography } from "@mui/material";

export default function CancelButton(props){
    
    // cancel function to stop editing in some mode
    const {cancelFunction, setHidden} = props;

    function handleClick(){
        console.log(props);
        cancelFunction();
        setHidden(true);

    }

    return (
        <Button onClick ={handleClick} size="small" sx={{backgroundColor:'gray'}}>
            <Typography fontSize={10} variant='overline' sx={{color:'white'}}>
                Cancel
            </Typography>
        </Button>
    )
}