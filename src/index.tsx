import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App'; // adjust if App.tsx is not inside /src
import '../styles/globals.css'; // if you have it

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
