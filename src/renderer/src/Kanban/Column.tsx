import { Button, Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { useState } from 'react'
import { TaskEditor } from './TaskEditor'
import { TASK_TYPE, TaskCard } from './TaskCard'
import { useDroppable } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'
import { Micon } from '../Common/Components/Micon'
import dayjs from 'dayjs'
import { fitsFilters, TaskFilters } from './filterTasks'
import { ColumnHeader } from './ColumnHeader'

function isStale(lastMoved: string, hideDelay?: number) {
  if (!hideDelay) {
    return false
  }

  return dayjs().diff(dayjs(lastMoved), 'days') > hideDelay
}

export const COLUMN_TYPE = 'column'

export interface ColumnProps {
  column: Headbreak.Column
  filters?: TaskFilters
}

export function Column({ column, filters }: ColumnProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [showStale, setShowStale] = useState(false)

  const { ref } = useDroppable({
    id: column.id,
    type: COLUMN_TYPE,
    accept: TASK_TYPE,
    collisionPriority: CollisionPriority.Low
  })

  return (
    <Stack
      sx={{
        width: 400,
        flexShrink: 0
      }}
    >
      <ColumnHeader column={column} showStale={showStale} onChange={setShowStale} />

      <Stack
        ref={ref}
        spacing={1}
        sx={{
          flex: 1,
          bgcolor: '#f2f1f3',
          p: 1,
          borderRadius: 2,
          overflow: 'auto',
          mt: 1
        }}
      >
        {column.tasks
          ?.filter(
            (t) =>
              !t.markForDeletion &&
              (showStale || !isStale(t.lastMoved, column.hideDelay)) &&
              fitsFilters(t, filters)
          )
          .map((t, index) => (
            <TaskCard key={t.id} task={t} columnId={column.id} index={index} />
          ))}
        <Button sx={{ width: '100%' }} onClick={() => setShowCreate(true)}>
          <Micon icon="add" />
        </Button>
      </Stack>
      <Dialog open={showCreate} onClose={() => setShowCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <TaskEditor onClose={() => setShowCreate(false)} columnId={column.id} />
        </DialogContent>
      </Dialog>
    </Stack>
  )
}
