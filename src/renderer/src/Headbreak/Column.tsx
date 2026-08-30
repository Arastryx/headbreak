import { Box, Button, Dialog, DialogContent, DialogTitle, Stack } from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { TaskEditor } from './TaskEditor'
import { TaskCard } from './TaskCard'
import { useDroppable } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'

export interface ColumnProps {
  id: number
  tasks?: Headbreak.Task[]
}

export function Column({ id, tasks }: ColumnProps) {
  const [showCreate, setShowCreate] = useState(false)

  const { ref } = useDroppable({
    id,
    type: 'column',
    accept: 'item',
    collisionPriority: CollisionPriority.Low
  })

  return (
    <Box>
      <Stack
        ref={ref}
        spacing={1}
        sx={{
          height: '100%',
          bgcolor: '#f2f1f3',
          width: 300,
          p: 1,
          borderRadius: 2,
          overflow: 'auto'
        }}
      >
        {tasks?.map((t, index) => (
          <TaskCard key={index} task={t} column={id} index={index} />
        ))}
        <Button sx={{ width: '100%' }} onClick={() => setShowCreate(true)}>
          <AddIcon />
        </Button>
      </Stack>
      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <TaskEditor
            onSubmit={() => {
              setShowCreate(false)
            }}
            columnId={id}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
