import React, { useState } from 'react'
import { Column } from './Column'
import { Box, Stack } from '@mui/material'
import { DragDropProvider } from '@dnd-kit/react'
import { useTasks } from './TaskProvider'

export interface KanbanProps {}

export function Kanban({}: KanbanProps) {
  const { data: tasks } = useTasks()

  return (
    <DragDropProvider>
      <Stack direction={'row'} spacing={2} sx={{ height: '100vh', p: 2 }}>
        <Column id={1} tasks={tasks?.[1]} />
        <Column id={2} tasks={tasks?.[2]} />
        <Column id={3} tasks={tasks?.[3]} />
      </Stack>
    </DragDropProvider>
  )
}
