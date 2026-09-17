import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Popover,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { TaskEditor } from './TaskEditor'
import { TaskCard } from './TaskCard'
import { useDroppable } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import { useKanban } from './KanbanProvider'
import DragIcon from '@mui/icons-material/DragIndicator'
import { IconSelector } from './IconSelector'
import { MaterialIcon } from 'material-icons'

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

  const [showIconSelector, setShowIconSelector] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const [icon, setIcon] = useState<MaterialIcon>('loop')

  return (
    <Box sx={{ '&:hover .drag-handle': { opacity: 1 } }}>
      {!showEdit && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Stack
            className="drag-handle"
            sx={{
              justifyContent: 'center',
              cursor: 'grab',
              width: 30,
              transition: '0.15s',
              opacity: 0
            }}
          >
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
              {column.label ? column.label : 'Unnamed'}
            </Typography>
          </ButtonBase>
          <Stack sx={{ justifyContent: 'center', width: 30 }}>
            <Icon>{icon}</Icon>
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
          <IconButton size="small" onClick={() => setShowIconSelector(true)} ref={anchorRef}>
            <Icon>{icon}</Icon>
          </IconButton>
          <Popover
            open={showIconSelector}
            onClose={() => setShowIconSelector(false)}
            anchorEl={anchorRef.current}
            anchorOrigin={{
              horizontal: 'center',
              vertical: 'bottom'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <IconSelector
              onSelect={(i) => {
                setIcon(i)
                setShowIconSelector(false)
              }}
            />
          </Popover>
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
