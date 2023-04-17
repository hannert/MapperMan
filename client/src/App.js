import { Box, ThemeProvider, createTheme } from '@mui/material';
import { React } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { AuthContextProvider } from './api';
import AppBanner from './components/AppBanner';
import EditScreen from './components/EditScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import HomeScreen from './components/HomeScreen';
import HomeWrapper from './components/HomeWrapper';
import LoginScreen from './components/LoginScreen';
import MapsScreen from './components/MapListScreen/MapsScreen';
import RegisterScreen from './components/RegisterScreen';
import ViewMapScreen from './components/ViewMapScreen';

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });
const themeOptions = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#2B2B2B',
      paper: '#2B2B2B',
    },
    largeIcon: {
      width:64,
      height:64
    },
    buttonColor: createColor("#59A0E2")
  },
  dialog: {
    backgroundColor: 'black',
    typography: {
      color: 'red'
    }
  },
  components: {
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: 'koulen'
        }
      }
    }
  }
  
});

function App() {

  return (
    // <div className="App">
    //   <FileUpload />
    //   <TestComponent />

    // </div>
    <BrowserRouter>
      <AuthContextProvider>
        <ThemeProvider theme={themeOptions}>
          <Box sx={{display: "flex", height:"100%", flexDirection:"column"}}>
            <AppBanner />
            <Routes>
              <Route path="/" element={<HomeWrapper />} />
              <Route path='/home' element = {<HomeScreen />}/>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path='/maps/edit' element={<EditScreen/>}/>
              <Route path='/maps' element = {<MapsScreen/>}/>
              <Route path='/maps/view/:id' element = {<ViewMapScreen />} />
              <Route path='/forgotPassword/' element ={<ForgotPasswordScreen/>}/>
            </Routes>          
          </Box>

        </ThemeProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}
// Epic! Netlify Tests Change ENV // Testing 
export default App;
