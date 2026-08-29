import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { TaskEditor } from './TaskEditor'
import { HeadbreakTask } from './task'
import { TaskCard } from './TaskCard'

export interface ColumnProps {
  name: string
}

export function Column({ name }: ColumnProps) {
  const [tasks, setTasks] = useState<HeadbreakTask[]>([])

  const [showCreate, setShowCreate] = useState(false)

  return (
    <Box>
      <Stack
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
        {tasks.map((t, index) => (
          <TaskCard key={index} task={t} column={name} index={index} />
        ))}
        <Button sx={{ width: '100%' }} onClick={() => setShowCreate(true)}>
          <AddIcon />
        </Button>
      </Stack>
      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <TaskEditor
            onSubmit={(t) => {
              setTasks([...tasks, t])
              setShowCreate(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
