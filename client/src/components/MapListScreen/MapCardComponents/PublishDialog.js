import { Dialog, DialogTitle } from "@mui/material";

export default function PublishDialog(props){
    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    return (
        <div></div>
    //     <Dialog
    //     maxWidth='md' 
    //     fullWidth
    //     open={open} 
    //     onClose={handleClose}
    //     sx={{
    //         borderRadius: '10px',
    //     }}
    // >
    //     <DialogTitle 
    //         sx={{
    //             textAlign: 'center',
    //             backgroundColor: '#393C44'
    //         }}
    //     >
    //         Publish Map?
    //     </DialogTitle>
    //     </Dialog>
    )
}