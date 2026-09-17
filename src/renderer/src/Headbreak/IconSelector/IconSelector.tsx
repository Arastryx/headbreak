import React, { useState } from 'react'
import icons from './icon-names.json'
import { Box, TextField, Icon, Stack } from '@mui/material'
import { type MaterialIcon } from 'material-icons'

export interface IconSelectorProps {
  onSelect: (icon: MaterialIcon) => void
}

export function IconSelector({ onSelect }: IconSelectorProps) {
  const [search, setSearch] = useState('')
  const splitSearch = search.split(' ')

  return (
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
              sx={{ cursor: 'pointer', '&:hover': { opacity: 0.6 } }}
              onClick={() => onSelect(i as MaterialIcon)}
            >
              {i}
            </Icon>
          ))}
      </Box>
    </Stack>
  )
}
