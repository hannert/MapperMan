import './App.css';
import TestComponent from './components/TestComponent';
import { FileUpload } from './components/FileUpload';
import { React } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppBanner  from './components/AppBanner';
import HomeWrapper from './components/HomeWrapper';
function App() {
  return (
    // <div className="App">
    //   <FileUpload />
    //   <TestComponent />

    // </div>
    <BrowserRouter>
      <AppBanner />
      <Routes>
        <Route path="/" element={<HomeWrapper />} />
      </Routes>
    
    
    
    
    </BrowserRouter>
  );
}

export default App;
