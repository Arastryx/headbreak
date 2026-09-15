import { Headbreak } from './Headbreak'
import { NotificationProvider } from './Headbreak/Common/NotificationProvider'
import { KanbanProvider } from './Headbreak/KanbanProvider'
import { theme } from './theme'
import { CssBaseline, ThemeProvider } from '@mui/material'

function App(): React.JSX.Element {
  return (
    <NotificationProvider>
      <KanbanProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Headbreak />
        </ThemeProvider>
      </KanbanProvider>
    </NotificationProvider>
  )
}

export default App
