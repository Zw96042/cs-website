import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SiteApp from './SiteApp.jsx'
import '../styles.css'

export function renderApp () {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <SiteApp />
    </StrictMode>
  )
}
