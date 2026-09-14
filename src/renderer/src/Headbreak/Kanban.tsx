import React, { useState } from 'react'
import { Column } from './Column'
import { Box, Button, Stack } from '@mui/material'
import { DragDropProvider } from '@dnd-kit/react'
import { useTasks } from './TaskProvider'
import AddIcon from '@mui/icons-material/Add'
import { useIpcCall } from './Common/useIpcCall'
import { v4 } from 'uuid'

let idCounter = 1

interface Column {
  id: number
  label?: string
}

export interface KanbanProps {}

export function Kanban({}: KanbanProps) {
  const { data: kanban, reload: reloadKanban } = useTasks()
  const { callIpc: createColumn, isLoading } = useIpcCall(window.kanbanApi.createColumn, [])

  return (
    <DragDropProvider>
      <Stack direction={'row'} spacing={2} sx={{ height: '100vh', p: 2 }}>
        {kanban?.map((c) => (
          <Column key={c.id} column={c} />
        ))}
        <Button
          loading={isLoading}
          onClick={async () => {
            await createColumn(v4())
            reloadKanban()
          }}
        >
          <AddIcon />
        </Button>
      </Stack>
    </DragDropProvider>
  )
}
