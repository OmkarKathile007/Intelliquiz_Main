import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {FirebaseProvider} from './context/Firebase.jsx'
// import { Analytics } from '@vercel/analytics/next';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FirebaseProvider>
       <App />
        {/* <Analytics /> */}
    </FirebaseProvider>
   
  </React.StrictMode>,
)
