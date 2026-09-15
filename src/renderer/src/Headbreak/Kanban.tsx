import { Column } from './Column'
import { Button, Stack } from '@mui/material'
import { DragDropProvider } from '@dnd-kit/react'
import AddIcon from '@mui/icons-material/Add'
import { useKanban } from './KanbanProvider'

let idCounter = 1

interface Column {
  id: number
  label?: string
}

export interface KanbanProps {}

export function Kanban({}: KanbanProps) {
  const { kanban, createColumn } = useKanban()
  // const { callIpc: createColumn, isLoading } = useIpcCall(window.kanbanApi.createColumn, [])

  return (
    <DragDropProvider>
      <Stack direction={'row'} spacing={2} sx={{ height: '100vh', p: 2 }}>
        {kanban?.map((c) => (
          <Column key={c.id} column={c} />
        ))}
        <Button
          // loading={isLoading}
          onClick={async () => {
            createColumn()
          }}
        >
          <AddIcon />
        </Button>
      </Stack>
    </DragDropProvider>
  )
}
