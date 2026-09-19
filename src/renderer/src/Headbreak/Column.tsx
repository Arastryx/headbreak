import { Button, Dialog, DialogContent, DialogTitle, Icon, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { TaskEditor } from './TaskEditor'
import { TASK_TYPE, TaskCard } from './TaskCard'
import { useDroppable } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'
import { Micon } from './Common/Micon'

export const COLUMN_TYPE = 'column'

export interface ColumnProps {
  column: Headbreak.Column
}

export function Column({ column }: ColumnProps) {
  const [showCreate, setShowCreate] = useState(false)

  const { ref } = useDroppable({
    id: column.id,
    type: COLUMN_TYPE,
    accept: TASK_TYPE,
    collisionPriority: CollisionPriority.Low
  })

  return (
    <Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Stack
          sx={{
            width: 30
          }}
        ></Stack>

        <Typography variant="h6" sx={{ textAlign: 'center', flex: 1, color: column.color }}>
          {column.label ? column.label : 'Unnamed'}
        </Typography>
        <Stack sx={{ justifyContent: 'center', width: 30 }}>
          <Micon icon={column.icon ?? 'loop'} sx={{ color: column.color }} />
        </Stack>
      </Stack>

      <Stack
        ref={ref}
        spacing={1}
        sx={{
          flex: 1,
          bgcolor: '#f2f1f3',
          width: 300,
          p: 1,
          borderRadius: 2,
          overflow: 'auto',
          mt: 1
        }}
      >
        {column.tasks
          ?.filter((t) => !t.markForDeletion)
          .map((t, index) => (
            <TaskCard key={t.id} task={t} columnId={column.id} index={index} />
          ))}
        <Button sx={{ width: '100%' }} onClick={() => setShowCreate(true)}>
          <Micon icon="add" />
        </Button>
      </Stack>
      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <TaskEditor
            onSubmit={() => {
              setShowCreate(false)
            }}
            columnId={column.id}
          />
        </DialogContent>
      </Dialog>
    </Stack>
  )
}
