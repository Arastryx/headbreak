import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'material-icons/iconfont/material-icons.css'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import Duration from 'dayjs/plugin/duration'
import RelativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(LocalizedFormat)
dayjs.extend(Duration)
dayjs.extend(RelativeTime)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
