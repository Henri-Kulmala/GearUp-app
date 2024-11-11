import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WorkdayApp from './WorkdayApp.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WorkdayApp />
  </StrictMode>,
)
