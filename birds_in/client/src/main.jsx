import * as React from 'react';
import axios from 'axios';
import { createRoot } from "react-dom/client";// Importar createRoot
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import theme from './assets/styles/theme.js';
import { CssBaseline } from '@mui/material';
//components
import App from './App.jsx';
import './index.css'
//redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { getOptionsData } from './redux/birds/actions/fetchOptions.js';
import { saveOptions } from './redux/birds/slices/FilterSlice.js';
import { getOptionsDataP } from './redux/paisaje/actionsP/fetchOptionsLand.js';
import { saveOptionsP } from './redux/paisaje/slicesP/LandscapeSlice.js';
import { getAllCustomizes } from './redux/settings/actions/Custom.js';

// Configurar la URL base de Axios
// const api = 'https://lasavesquepasaronpormisojos-com.onrender.com';
const api = 'https://pruebabird.onrender.com';
// const api = 'http://181.48.223.2';
const apilocal = 'http://localhost:3001';
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? api : apilocal;

// Realizar llamadas a la API antes de que la aplicación se monte
// store.dispatch(getInfoBirds());

store.dispatch(getOptionsData());
store.dispatch(saveOptions());
store.dispatch(getAllCustomizes());
store.dispatch(getOptionsDataP());
store.dispatch(saveOptionsP());

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <CssBaseline />
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

