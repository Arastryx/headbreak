import { Box, Popover } from '@mui/material'
import React, { useRef, useState } from 'react'
import { HexColorPicker } from 'react-colorful'

export interface ColorPickerProps {
  color: string
  onChange?: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [show, setShow] = useState(false)
  const iconRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Box
        onClick={() => setShow(true)}
        ref={iconRef}
        sx={{
          width: 32,
          height: 32,
          bgcolor: color ?? '#000',
          pointer: 'cursor',
          transition: '0.15s',
          borderRadius: '100%',
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 }
        }}
      ></Box>
      <Popover
        open={show}
        onClose={() => setShow(false)}
        anchorEl={iconRef.current}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'top'
        }}
        transformOrigin={{
          vertical: 0,
          horizontal: -8
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            '& .react-colorful': {
              width: 150,
              height: 160
            }
          }}
        >
          <HexColorPicker color={color ?? '#000'} onChange={onChange} />
        </Box>
      </Popover>
    </>
  )
}
