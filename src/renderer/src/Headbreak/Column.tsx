import { Box, Button, Card, Stack } from '@mui/material'
import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'

interface Task {}

export interface ColumnProps {}

export function Column({}: ColumnProps) {
  const [tasks, setTasks] = useState<Task[]>([])

  return (
    <Box>
      <Stack
        spacing={1}
        sx={{ height: '100%', bgcolor: '#f2f1f3', width: 360, p: 1, borderRadius: 2 }}
      >
        {tasks.map((t, index) => (
          <Card elevation={1} sx={{ height: 140 }} key={index}></Card>
        ))}
        <Button sx={{ width: '100%' }} onClick={() => setTasks([...tasks, {}])}>
          <AddIcon />
        </Button>
      </Stack>
    </Box>
  )
}
