import { alpha, Box, BoxProps, Palette, PaletteColor } from '@mui/material'

//Modified from https://www.totaltypescript.com/get-keys-of-an-object-where-values-are-of-a-given-type
type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

export interface EmphasizeProps {
  color: KeysOfType<Palette, PaletteColor>
  show?: boolean
  sx?: BoxProps['sx']
  children?: React.ReactNode
}

export function Emphasize({ color = 'primary', show, children, sx }: EmphasizeProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          transition: '0.2s',
          p: 0.5,
          m: -0.5,
          bgcolor: show ? alpha(theme.palette[color].main, 0.15) : undefined
        }),
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      {children}
    </Box>
  )
}
