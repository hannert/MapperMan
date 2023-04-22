import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { Box } from "@mui/system";
import { AddCircle, AddLocation, Circle, Merge, Mouse, Redo, RemoveCircle, Timeline, Undo, WrongLocation } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useDispatch, useSelector } from 'react-redux';
import { setFeatureClicked} from '../../app/store-actions/leafletEditing';
import PropertyCard from './PropertyCard';




export default function PropertyEditor(props){
    const {handleToggleProperty} = props;
    const feature = useSelector((state)=>state.leafletEditing.featureClicked);

    /**
     * Holds the properties in the feature that was taken
     * from the state
     */
    const featureProperties = feature.properties

    /**
     * Puts the properties into the
     * rows that can be seen by the user
     * Another approach is to create a custom properties section of the
     * GeoJSON file once it is uploaded, haven't looked into if thats
     * even possible
     */
    const rows = []

    
    for (var key in featureProperties){
        rows.push(<PropertyCard propKey={key} propType={typeof(key)} propValue={featureProperties[key]} />)
    }
    

    function createData(name, type, value) {
        return { name, type, value};
    }



    



    return(
        <Box id='property-editor' sx={{width:'35%', height:'100%', backgroundColor:'#1D2026', display:'flex',  flexDirection:'column', alignItems:'flex-start'}}>
            <IconButton onClick={handleToggleProperty} >
                <ChevronLeftIcon />
            </IconButton>
            <Typography variant='h4' sx={{fontFamily:'Koulen', color:"#B9D3E9", marginLeft:'20px'}}>
                Edit Region Properties
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant='h6' sx={{fontFamily:'koulen'}}>
                                    Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant='h6' sx={{fontFamily:'koulen'}}>
                                    Type
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant='h6' sx={{fontFamily:'koulen'}}>
                                    Value
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead> 
                    <TableBody>
                        {
                            rows
                        }
                        <TableRow >
                            <TableCell colSpan={3}>
                                <Box sx={{display:'flex', justifyContent:'center'}}>
                                    <Button>
                                        <AddCircle/>
                                    </Button>    
                                </Box>                        
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}