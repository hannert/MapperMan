import { Box, ThemeProvider, createTheme } from '@mui/material';
import { React } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AppBanner from './components/AppBanner';
import EditScreen from './components/EditScreen';
import HomeWrapper from './components/HomeWrapper';
import LoginScreen from './components/LoginScreen';
import MapsScreen from './components/MapsScreen';
import RegisterScreen from './components/RegisterScreen';

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
});

function App() {

  return (
    // <div className="App">
    //   <FileUpload />
    //   <TestComponent />

    // </div>
    <BrowserRouter>
      <ThemeProvider theme={themeOptions}>
        <Box sx={{display: "flex", height:"100%", flexDirection:"column"}}>
          <AppBanner />
          <Routes>
            <Route path="/" element={<HomeWrapper />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path='/maps/edit' element={<EditScreen/>}/>
            <Route path='/maps' element = {<MapsScreen/>}/>
          </Routes>          
        </Box>

      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
