import { alpha, createTheme } from '@mui/material'

const error = '#e31e63'

export const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#514f5e'
    },
    background: {
      default: '#f7f7f7',
      paper: '#f9f9f9'
    },
    text: {
      secondary: '#999'
    },
    error: {
      main: error
    }
  },
  typography: {
    fontFamily: 'Geist Variable',
    h5: {
      fontSize: 19,
      fontFamily: 'Open Sans Variable'
    },
    h6: {
      fontSize: 16,
      fontFamily: 'Open Sans Variable'
    },
    body1: {
      fontSize: 13,
      fontWeight: '300'
    },
    body2: {
      fontSize: 11.5
    },
    caption: {
      fontSize: 10,
      color: '#999'
    }
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        gutterBottom: {
          marginBottom: 8
        }
      }
    },

    MuiTextField: {
      defaultProps: {
        variant: 'standard'
      }
    },

    MuiIconButton: {
      styleOverrides: {
        sizeSmall: {
          padding: 4,
          fontSize: '1rem'
        }
      }
    },

    MuiStack: {
      defaultProps: {
        useFlexGap: true
      }
    },

    MuiChip: {
      defaultProps: {
        variant: 'outlined'
      },
      styleOverrides: {
        root: {
          letterSpacing: -0.2
        },
        outlined: {
          borderWidth: 1
        },
        sizeMedium: {
          fontSize: 13,
          fontWeight: 500,
          height: 30,

          '& .MuiIcon-root': {
            fontSize: 18,
            paddingLeft: 1
          }
        },
        sizeSmall: {
          fontSize: 10,
          fontWeight: 500,
          height: 22,

          '& .MuiIcon-root': {
            fontSize: 15,
            paddingLeft: 1
          }
        }
      }
    }
  }
})
