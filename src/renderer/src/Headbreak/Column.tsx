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
import { useKanban } from './KanbanProvider'
import DragIcon from '@mui/icons-material/DragIndicator'
import AutorenewIcon from '@mui/icons-material/Autorenew'

export interface ColumnProps {
  column: Headbreak.Column
}

export function Column({ column }: ColumnProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [internalLabel, setInternalLabel] = useState(column.label ?? '')

  const { editColumn } = useKanban()

  const { ref } = useDroppable({
    id: column.id,
    type: 'column',
    accept: 'item',
    collisionPriority: CollisionPriority.Low
  })

  const updateLabel = () => {
    editColumn(column.id, internalLabel)
    setShowEdit(false)
  }

  const cancelLabelChange = () => {
    setInternalLabel(column.label ?? '')
    setShowEdit(false)
  }

  return (
    <Box>
      {!showEdit && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Stack sx={{ justifyContent: 'center', cursor: 'grab', width: 30 }}>
            <DragIcon />
          </Stack>
          <ButtonBase
            onClick={() => setShowEdit(true)}
            sx={{
              flex: 1,
              transition: '0.15s',
              '&:hover': {
                bgcolor: '#00000005'
              }
            }}
          >
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              {column.label ?? 'Unnamed'}
            </Typography>
          </ButtonBase>
          <Stack sx={{ justifyContent: 'center', width: 30 }}>
            <AutorenewIcon />
          </Stack>
        </Stack>
      )}
      {showEdit && (
        <Stack direction="row" sx={{ alignItems: 'center' }}>
          <TextField
            placeholder="Label"
            value={internalLabel}
            onChange={(e) => setInternalLabel(e.currentTarget.value)}
            size="small"
            sx={{ flex: 1 }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                updateLabel()
              } else if (e.key === 'Escape') {
                cancelLabelChange()
              }
            }}
          />
          <IconButton size="small" onClick={updateLabel}>
            <CheckIcon />
          </IconButton>
          <IconButton size="small" onClick={cancelLabelChange}>
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
