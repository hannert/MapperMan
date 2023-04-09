import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function HomeScreen(){
    return(
        <Box id="Home-screen">
            <Box>
                <Typography color ={'white'} sx={{fontFamily: 'Lato', fontSize: '20pt'}}>Welcome user!</Typography>
            </Box>
        </Box>
    )
}