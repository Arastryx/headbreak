import React, { useState } from 'react'
import { Column } from './Column'
import { Box, Button, Stack } from '@mui/material'
import { DragDropProvider } from '@dnd-kit/react'
import { useTasks } from './TaskProvider'
import AddIcon from '@mui/icons-material/Add'

let idCounter = 1

interface Column {
  id: number
  label?: string
}

export interface KanbanProps {}

export function Kanban({}: KanbanProps) {
  const { data: tasks } = useTasks()
  const [columns, setColumns] = useState<Column[]>([])

  return (
    <DragDropProvider>
      <Stack direction={'row'} spacing={2} sx={{ height: '100vh', p: 2 }}>
        {columns.map((c) => (
          <Column key={c.id} id={c.id} tasks={tasks?.[c.id]} />
        ))}
        <Button onClick={() => setColumns([...columns, { id: idCounter++ }])}>
          <AddIcon />
        </Button>
      </Stack>
    </DragDropProvider>
  )
}
