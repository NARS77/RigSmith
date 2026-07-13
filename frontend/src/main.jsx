import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BuildProvider } from './context/BuildContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BuildProvider>
      <App />
    </BuildProvider>
  </StrictMode>,
)
