import React, { useRef, useState } from 'react'
import icons from './icon-names.json'
import { Box, TextField, Icon, Stack, IconButton, Popover, Button, Typography } from '@mui/material'
import { type MaterialIcon } from 'material-icons'
import { Micon } from '../Micon'

export interface IconSelectorProps {
  icon?: MaterialIcon
  color?: string
  clearable?: boolean
  onSelect: (icon?: MaterialIcon) => void
}

export function IconSelector({ icon, color, onSelect, clearable }: IconSelectorProps) {
  const [search, setSearch] = useState('')
  const splitSearch = search.toLocaleLowerCase().split(' ')

  const [showIconSelector, setShowIconSelector] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const select = (i?: MaterialIcon) => {
    onSelect(i)
    setSearch('')
    setShowIconSelector(false)
  }

  return (
    <>
      <IconButton onClick={() => setShowIconSelector(true)} ref={anchorRef} sx={{ color }}>
        {icon && <Micon icon={icon} />}
        {!icon && (
          <Typography
            variant="caption"
            sx={{ width: 30, lineHeight: 1, fontWeight: 700, mx: -0.4, opacity: 0.3, color }}
          >
            NO ICON
          </Typography>
        )}
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
                  onClick={() => select(i as MaterialIcon)}
                >
                  {i}
                </Icon>
              ))}
          </Box>
          {icon && clearable && (
            <Button startIcon={<Micon icon="clear" />} onClick={() => select(undefined)}>
              Clear Selection
            </Button>
          )}
        </Stack>
      </Popover>
    </>
  )
}
