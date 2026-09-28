import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '../styles.css'

export function renderApp (Inspector) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
      {Inspector ? <Inspector /> : null}
    </StrictMode>
  )
}
