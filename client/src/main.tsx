// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { HashRouter } from 'react-router-dom'; // ✅ Add this import

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter> {/* ✅ Wrap App in HashRouter */}
      <App />
    </HashRouter>
  </React.StrictMode>
);
