import './App.css';
import TestComponent from './components/TestComponent';
import { FileUpload } from './components/FileUpload';
import { React } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppBanner  from './components/AppBanner';
import HomeWrapper from './components/HomeWrapper';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material';
import EditScreen from './components/EditScreen';
import MapsScreen from './components/MapsScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';

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
        <AppBanner />
        <Routes>
          <Route path="/" element={<HomeWrapper />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path='/maps/edit' element={<EditScreen/>}/>
          <Route path='/maps' element = {<MapsScreen/>}/>
          <Route path='/forgotPassword/' element ={<ForgotPasswordScreen/>}/>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
