import * as React from 'react';
import { createRoot } from "react-dom/client";// Importar createRoot
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import App from './App.jsx';
import theme from './assets/styles/theme.js';
import { CssBaseline } from '@mui/material';
import axios from 'axios';
import { getOptionsData } from './redux/actions/fetchOptions';
import { saveOptions } from './redux/slices/BirdsSlice';
import { getAllCustomizes } from './redux/actions/Custome';
import './index.css'
import { getOptionsDataP } from './redux/paisaje/actionsP/fetchOptionsLand.js';
import { saveOptionsP } from './redux/paisaje/slicesP/LandscapeSlice.js';

// Configurar la URL base de Axios
const api = 'https://lasavesquepasaronpormisojos-com.onrender.com';
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

