import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'material-icons/iconfont/material-icons.css'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(LocalizedFormat)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
