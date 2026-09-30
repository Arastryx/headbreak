import { Stack, Tooltip, IconButton, Typography } from '@mui/material'
import { Micon } from '@renderer/Common/Components/Micon'
import React from 'react'

export interface ColumnHeaderProps {
  column: Headbreak.Column
  showStale: boolean
  onChange: (showStale: boolean) => void
}

export function ColumnHeader({ column, showStale, onChange }: ColumnHeaderProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <Stack
        sx={{
          width: 30
        }}
      >
        {column.hideDelay && (
          <Tooltip title="Show/hide stale tasks">
            <IconButton
              size="small"
              onClick={() => onChange(!showStale)}
              sx={{ color: column.color }}
            >
              <Micon icon={showStale ? 'visibility' : 'visibility_off'} fontSize="inherit" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      <Typography variant="h6" sx={{ textAlign: 'center', flex: 1, color: column.color }}>
        {column.label ? column.label : 'Unnamed'}
      </Typography>
      <Stack sx={{ justifyContent: 'center', width: 30 }}>
        <Micon icon={column.icon ?? 'loop'} sx={{ color: column.color }} />
      </Stack>
    </Stack>
  )
}
