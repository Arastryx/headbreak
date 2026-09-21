import { alpha, Box, Typography, TypographyProps } from '@mui/material'

export interface FadeOutTextProps extends TypographyProps {
  active?: boolean
}

export function FadeOutText({ active, ...props }: FadeOutTextProps) {
  if (!active) {
    return <Typography {...props}></Typography>
  }

  //Modified version of https://stackoverflow.com/questions/14500159/how-to-apply-a-css-gradient-over-a-text-from-a-transparent-to-an-opaque-colour
  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        '&:after': {
          position: 'absolute',
          bottom: 0,
          height: '100%',
          width: '100%',
          content: "''",
          background: `linear-gradient(to top, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0)} 50%)`,
          pointerEvents: 'none'
        }
      })}
    >
      <Typography {...props}></Typography>
    </Box>
  )
}
