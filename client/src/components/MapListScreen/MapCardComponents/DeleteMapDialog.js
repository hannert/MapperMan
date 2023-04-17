import { Dialog, DialogTitle } from "@mui/material";


export default function DeleteMapDialog(props){

    const {open, handleClose} = props;
    
    return (
        <Dialog
        maxWidth='md' 
        fullWidth
        open={open} 
        onClose={handleClose}
        sx={{
            borderRadius: '10px',
        }}
    >
        <DialogTitle 
            sx={{
                textAlign: 'center',
                backgroundColor: '#393C44'
            }}
        >
            Upload GeoJSON or SHP/DBF
        </DialogTitle>
        </Dialog>
        

    )
}