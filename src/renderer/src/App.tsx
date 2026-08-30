import { Headbreak } from './Headbreak'
import { NotificationProvider } from './Headbreak/Common/NotificationProvider'
import { TaskProvider } from './Headbreak/TaskProvider'
import { theme } from './theme'
import { CssBaseline, ThemeProvider } from '@mui/material'

function App(): React.JSX.Element {
  return (
    <NotificationProvider>
      <TaskProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Headbreak />
        </ThemeProvider>
      </TaskProvider>
    </NotificationProvider>
  )
}

export default App
