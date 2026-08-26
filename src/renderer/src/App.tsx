import { ThemeProvider } from '@emotion/react'
import { Headbreak } from './Headbreak'
import { theme } from './theme'
import { CssBaseline } from '@mui/material'

function App(): React.JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Headbreak />
    </ThemeProvider>
  )
}

export default App
