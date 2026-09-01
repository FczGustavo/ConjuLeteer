import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadUserSettings } from './utils/srsEngine'

const initialTheme = loadUserSettings().theme;
document.documentElement.dataset.theme = initialTheme;
document.documentElement.style.colorScheme = initialTheme === 'light' || initialTheme === 'alexandria-light' ? 'light' : 'dark';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
