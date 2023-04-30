import { Box, ThemeProvider, createTheme } from '@mui/material';
import { React } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import { Provider } from 'react-redux';
import store from './app/store';
import AppBanner from './components/AppBanner';
import EditScreen from './components/EditMapScreen/EditScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
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
      dark: '#2B2B2B'
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
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto mono'
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          '&:hover': {
            color: '#FF3B6B',
            transition: 'all 0.3s ease'
          }
        },

      }
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto mono'
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
      <ThemeProvider theme={themeOptions}>
      <SnackbarProvider>
      <Provider store={store}>
        <Box sx={{display: "flex", height:"100%", flexDirection:"column"}}>
          <AppBanner />
          <Routes>
            <Route path="/" element={<HomeWrapper />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path='/maps/edit' element={<EditScreen/>}/>
            <Route path='/maps' element = {<MapsScreen/>}/>
            <Route path='/maps/view/:id' element = {<ViewMapScreen />} />
            <Route path='/forgotPassword' element ={<ForgotPasswordScreen/>}/>
            <Route path='/changePassword/:userId/:token' element ={<AfterVerifyScreen />}/>
          </Routes>          
        </Box>
      </Provider>
      </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
// Testing cypress tests on github actions
export default App;
