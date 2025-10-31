
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'uuid'; // Ensure uuid is imported to be bundled, though not directly used in index.tsx

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
