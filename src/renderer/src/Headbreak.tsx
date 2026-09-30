import { useState } from 'react'
import { Kanban } from './Kanban/Kanban'
import { Box, Dialog, DialogContent, IconButton, Stack } from '@mui/material'
import { Settings } from './Settings/Settings'
import { Micon } from './Common/Components/Micon'
import { KanbanSearch } from './KanbanSearch'
import { TaskFilters } from './Kanban'

export interface HeadbreakProps {}

export function Headbreak({}: HeadbreakProps) {
  const [showSettings, setShowSettings] = useState(false)

  const [filters, setFilters] = useState<TaskFilters>({})

  return (
    <>
      <Stack spacing={1} sx={{ height: '100vh' }}>
        <Stack spacing={1} direction="row" sx={{ px: 1, pt: 1, alignItems: 'center' }}>
          <KanbanSearch filters={filters} onChange={setFilters} />
          <IconButton onClick={() => setShowSettings(true)}>
            <Micon icon="settings" />
          </IconButton>
        </Stack>
        <Box sx={{ flex: 1, flexShrink: 0, overflowX: 'auto', px: 1, pb: 1 }}>
          <Kanban filters={filters} />
        </Box>
      </Stack>
      <Dialog fullScreen open={showSettings} onClose={() => setShowSettings(false)}>
        <IconButton
          onClick={() => setShowSettings(false)}
          size="large"
          sx={{ position: 'absolute', top: 5, right: 5 }}
        >
          <Micon icon="close" fontSize="inherit" />
        </IconButton>
        <DialogContent>
          <Settings />
        </DialogContent>
      </Dialog>
    </>
  )
}
