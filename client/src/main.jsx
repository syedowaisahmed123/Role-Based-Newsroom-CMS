import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './auth/AuthProvider';
import { DarkModeProvider } from './auth/DarkModeContext';


createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
      <DarkModeProvider>
        <App />
        </DarkModeProvider>
      </AuthProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
