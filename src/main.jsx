import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import CreativeSystems from './CreativeSystems.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {['/', '/case/promotion-system'].includes(window.location.pathname.replace(/\/+$/, '') || '/') ? <CreativeSystems /> : <App />}
  </StrictMode>,
)
