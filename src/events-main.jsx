import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import EventsPage from './components/EventsPage.jsx';
import '../styles.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EventsPage />
  </StrictMode>
);
