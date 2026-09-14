import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { TaskEditor } from './TaskEditor'
import { TaskCard } from './TaskCard'
import { useDroppable } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

export interface ColumnProps {
  column: Headbreak.Column
}

export function Column({ column }: ColumnProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const { ref } = useDroppable({
    id: column.id,
    type: 'column',
    accept: 'item',
    collisionPriority: CollisionPriority.Low
  })

  return (
    <Box>
      {!showEdit && (
        <ButtonBase sx={{ width: '100%' }} onClick={() => setShowEdit(true)}>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>
            {column.label ?? 'Unnamed'}
          </Typography>
        </ButtonBase>
      )}
      {showEdit && (
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <TextField placeholder="Label" size="small" sx={{ flex: 1 }} />
          <IconButton size="small">
            <CheckIcon />
          </IconButton>{' '}
          <IconButton size="small" onClick={() => setShowEdit(false)}>
            <CloseIcon />
          </IconButton>
        </Stack>
      )}
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
        {column.tasks?.map((t, index) => (
          <TaskCard key={index} task={t} column={column.id} index={index} />
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
            columnId={column.id}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
