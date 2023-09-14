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
import { getInfoBirds } from './redux/actions/fetchAllBirds';
import { getOptionsData } from './redux/actions/fetchOptions';
import { saveOptions } from './redux/slices/BirdsSlice';

// Configurar la URL base de Axios
const api = 'https://lasavesquepasaronpormisojos-com.onrender.com';
const apilocal = 'http://localhost:3001';
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? api : apilocal;

// Realizar llamadas a la API antes de que la aplicación se monte
store.dispatch(getInfoBirds());
store.dispatch(getOptionsData());
store.dispatch(saveOptions());

// Utilizar createRoot en lugar de ReactDOM.render
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
// import * as React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
// import store from './redux/store';
// import { BrowserRouter } from 'react-router-dom';
// import { ThemeProvider } from '@emotion/react';
// import App from './App.jsx';
// import theme from './assets/styles/theme.js';
// import { CssBaseline } from '@mui/material';
// import axios from 'axios';
// import { getInfoBirds } from './redux/actions/fetchAllBirds';
// import { getOptionsData } from './redux/actions/fetchOptions';
// import { saveOptions } from './redux/slices/BirdsSlice';
// const api = 'https://lasavesquepasaronpormisojos-com.onrender.com';
// const apilocal = 'http://localhost:3001';
// axios.defaults.baseURL = 'http://localhost:3001'
// // 'https://lasavesquepasaronpormisojos-com.onrender.com' ;
// React.useEffect(() => {
//   // Realiza las llamadas de API necesarias antes de que la aplicación se monte completamente.
//   store.dispatch(getInfoBirds());
//   store.dispatch(getOptionsData());
//   store.dispatch(saveOptions())
// }, []);

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <ThemeProvider theme={theme}>
//       <Provider store={store}>
//         <BrowserRouter>
//           <CssBaseline />
//           <App />
//         </BrowserRouter>
//       </Provider>
//     </ThemeProvider>
//   </React.StrictMode>,
// )
