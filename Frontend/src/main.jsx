import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom'
import {Provider} from 'react-redux';
import store from './store/index.js';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
   <>
   
    <Provider store = {store}>
    <App />
    <Toaster position = "bottom-right" />
    </Provider>
   
   </>
);