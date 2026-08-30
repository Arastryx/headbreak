import { Box, Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { useIpcCall } from './Common/useIpcCall'
import { useTasks } from './TaskProvider'

export interface TaskEditorProps {
  onSubmit: () => void
  columnId: number
}

export function TaskEditor({ columnId, onSubmit }: TaskEditorProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const { callIpc: createTask, isLoading } = useIpcCall(window.taskApi.create, [])
  const { reload } = useTasks()

  return (
    <Box sx={{ width: 400 }}>
      <Stack spacing={4}>
        <TextField
          placeholder="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          slotProps={{
            input: { sx: { fontSize: 30 } }
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={async () => {
            await createTask({ columnId, title, description })
            reload()
            onSubmit()
          }}
        >
          Create
        </Button>
      </Stack>
    </Box>
  )
}
