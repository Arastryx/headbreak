import { useState } from 'react'
import { Kanban } from './Kanban'
import { Box, Dialog, DialogContent, IconButton, Stack } from '@mui/material'
import { Settings } from './Settings'
import { Micon } from './Common/Micon'

export interface HeadbreakProps {}

export function Headbreak({}: HeadbreakProps) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <Stack direction="row">
        <Box sx={{ height: '100vh', flex: 1, flexShrink: 0, overflowX: 'auto' }}>
          <Kanban />
        </Box>
        <Box sx={{ p: 1 }}>
          <IconButton onClick={() => setShowSettings(true)}>
            <Micon icon="settings" />
          </IconButton>
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
