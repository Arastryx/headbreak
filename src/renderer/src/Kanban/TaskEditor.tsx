import { Box, Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { useKanban } from '../KanbanProvider/KanbanProvider'
import { Micon } from '../Common/Components/Micon'

export interface TaskEditorProps {
  columnId: string
  task?: Headbreak.Task
  onSubmit?: () => void
  onClose?: () => void
}

export function TaskEditor({ columnId, onSubmit, onClose, task }: TaskEditorProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')

  const { createTask, editTask } = useKanban()

  const submit = () => {
    if (task) {
      editTask(task.id, {
        title,
        description
      })
    } else {
      createTask({
        description,
        title,
        columnId
      })
    }

    onSubmit?.()
    onClose?.()
  }

  return (
    <Box sx={{ width: 400 }}>
      <Stack spacing={4}>
        <TextField
          placeholder="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          slotProps={{
            input: { sx: { fontSize: 19, fontFamily: 'Open Sans Variable', fontWeight: '400' } },
            htmlInput: { maxLength: 127 }
          }}
        />
        <TextField
          placeholder="Description"
          multiline
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
      </Stack>
      <Stack direction="row" spacing={2} sx={{ pt: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<Micon icon={task ? 'save' : 'add'} />}
          onClick={submit}
        >
          {task ? 'Save' : 'Create'}
        </Button>
      </Stack>
    </Box>
  )
}
