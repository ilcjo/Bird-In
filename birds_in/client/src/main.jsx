import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import App from './App.jsx';
import theme from './assets/styles/theme.js';
import { CssBaseline } from '@mui/material';
import axios from 'axios';
const api = 'https://lasavesquepasaronpormisojos-com.onrender.com';
const apilocal = 'http://localhost:3001'; 
axios.defaults.baseURL = 'http://localhost:3001'
// 'https://lasavesquepasaronpormisojos-com.onrender.com' ;


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <CssBaseline />
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
)
