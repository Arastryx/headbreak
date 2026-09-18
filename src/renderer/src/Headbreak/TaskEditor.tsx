import { Box, Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'
import { useKanban } from './KanbanProvider'
import { Micon } from './Common/Micon'

export interface TaskEditorProps {
  onSubmit: () => void
  columnId: string
}

export function TaskEditor({ columnId, onSubmit }: TaskEditorProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const { createTask } = useKanban()

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
          startIcon={<Micon icon="add" />}
          onClick={async () => {
            createTask({ columnId, title, description })
            onSubmit()
          }}
        >
          Create
        </Button>
      </Stack>
    </Box>
  )
}
