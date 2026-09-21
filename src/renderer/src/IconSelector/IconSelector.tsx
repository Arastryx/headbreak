import React, { useRef, useState } from 'react'
import icons from './icon-names.json'
import { Box, TextField, Icon, Stack, IconButton, Popover } from '@mui/material'
import { type MaterialIcon } from 'material-icons'

export interface IconSelectorProps {
  icon: string
  color?: string
  onSelect: (icon: MaterialIcon) => void
}

export function IconSelector({ icon, color, onSelect }: IconSelectorProps) {
  const [search, setSearch] = useState('')
  const splitSearch = search.split(' ')

  const [showIconSelector, setShowIconSelector] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <IconButton
        size="small"
        onClick={() => setShowIconSelector(true)}
        ref={anchorRef}
        sx={{ color }}
      >
        <Icon>{icon}</Icon>
      </IconButton>
      <Popover
        open={showIconSelector}
        onClose={() => setShowIconSelector(false)}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Stack spacing={1}>
          <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              value={search}
              placeholder="Search"
              onChange={(e) => setSearch(e.currentTarget.value)}
              slotProps={{
                input: {
                  startAdornment: <Icon>search</Icon>
                }
              }}
            />
          </Box>
          <Box sx={{ width: 280, height: 300, overflowY: 'auto' }}>
            {icons
              .filter((i) => splitSearch.every((term) => i.includes(term)))
              .map((i) => (
                <Icon
                  key={i}
                  fontSize="large"
                  sx={{ cursor: 'pointer', color, '&:hover': { opacity: 0.6 } }}
                  onClick={() => onSelect(i as MaterialIcon)}
                >
                  {i}
                </Icon>
              ))}
          </Box>
        </Stack>
      </Popover>
    </>
  )
}
