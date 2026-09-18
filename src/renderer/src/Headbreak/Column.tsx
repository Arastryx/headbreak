import { Button, Dialog, DialogContent, DialogTitle, Icon, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { TaskEditor } from './TaskEditor'
import { TaskCard } from './TaskCard'
import { useDroppable } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'
import { Micon } from './Common/Micon'

export interface ColumnProps {
  column: Headbreak.Column
}

export function Column({ column }: ColumnProps) {
  const [showCreate, setShowCreate] = useState(false)

  const { ref } = useDroppable({
    id: column.id,
    type: 'column',
    accept: 'item',
    collisionPriority: CollisionPriority.Low
  })

  return (
    <Stack sx={{ '&:hover .drag-handle': { opacity: 1 } }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Stack
          sx={{
            width: 30
          }}
        ></Stack>

        <Typography variant="h6" sx={{ textAlign: 'center', flex: 1 }}>
          {column.label ? column.label : 'Unnamed'}
        </Typography>
        <Stack sx={{ justifyContent: 'center', width: 30 }}>
          <Micon icon="loop" />
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
            <TaskCard key={index} task={t} column={column.id} index={index} />
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
