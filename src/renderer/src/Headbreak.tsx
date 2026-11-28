import { useMemo, useState } from 'react'
import { Kanban } from './Kanban/Kanban'
import { Box, Dialog, DialogContent, IconButton, Stack } from '@mui/material'
import { Settings } from './Settings/Settings'
import { Micon } from './Common/Components/Micon'
import { KanbanSearch } from './KanbanSearch'
import { TaskFilters } from './Kanban'
import { Link, useNavigate, useParams } from 'react-router'
import { useKanban } from './KanbanProvider/KanbanProvider'
import { useRouteBasedModal } from './useRouteBasedModal'
import { TaskDetails } from './Kanban/TaskDetails'

export interface HeadbreakProps {}

export function Headbreak({}: HeadbreakProps) {
  const { show, task } = useRouteBasedModal()
  const [filters, setFilters] = useState<TaskFilters>({})
  const navigate = useNavigate()

  return (
    <>
      <Stack spacing={1} sx={{ height: '100vh' }}>
        <Stack spacing={1} direction="row" sx={{ px: 1, pt: 1, alignItems: 'center' }}>
          <KanbanSearch filters={filters} onChange={setFilters} />
          <IconButton component={Link} to="/settings">
            <Micon icon="settings" />
          </IconButton>
        </Stack>
        <Box sx={{ flex: 1, flexShrink: 0, overflowX: 'auto', px: 1, pb: 1 }}>
          <Kanban filters={filters} />
        </Box>
      </Stack>
      <Dialog fullScreen open={show === 'settings'} onClose={() => navigate('/')}>
        <IconButton
          onClick={() => navigate('/')}
          size="large"
          sx={{ position: 'absolute', top: 5, right: 5 }}
        >
          <Micon icon="close" fontSize="inherit" />
        </IconButton>
        <DialogContent>
          <Settings />
        </DialogContent>
      </Dialog>
      <Dialog open={show === 'task'} onClose={() => navigate('/')} maxWidth="sm" fullWidth>
        <DialogContent>{task && <TaskDetails task={task} />}</DialogContent>
      </Dialog>
    </>
  )
}
