import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'material-icons/iconfont/material-icons.css'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import Duration from 'dayjs/plugin/duration'
import RelativeTime from 'dayjs/plugin/relativeTime'

import '@fontsource-variable/geist'
import '@fontsource-variable/open-sans'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { KanbanProvider } from './KanbanProvider/KanbanProvider'
import { theme } from './theme'
import { Headbreak } from './Headbreak'
import { ActiveContextMenuProvider } from './Common/Components/ContextMenu/ActiveContextMenuProvider'
import { NotificationProvider } from './Common/Contexts/NotificationProvider'

dayjs.extend(LocalizedFormat)
dayjs.extend(Duration)
dayjs.extend(RelativeTime)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <KanbanProvider>
        <ThemeProvider theme={theme}>
          <ActiveContextMenuProvider>
            <CssBaseline />
            <Headbreak />
          </ActiveContextMenuProvider>
        </ThemeProvider>
      </KanbanProvider>
    </NotificationProvider>
  </StrictMode>
)
