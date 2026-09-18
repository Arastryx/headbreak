import { Column } from './Column'
import { Button, Stack } from '@mui/material'
import { DragDropProvider } from '@dnd-kit/react'
import { useKanban } from './KanbanProvider'
import { Micon } from './Common/Micon'

interface Column {
  id: number
  label?: string
}

export interface KanbanProps {}

export function Kanban({}: KanbanProps) {
  const { kanban, createColumn } = useKanban()

  return (
    <DragDropProvider>
      <Stack direction={'row'} spacing={2} sx={{ height: '100%', p: 2 }}>
        {kanban?.map((c) => (
          <Column key={c.id} column={c} />
        ))}
        <Button
          onClick={async () => {
            createColumn()
          }}
        >
          <Micon icon="add" />
        </Button>
      </Stack>
    </DragDropProvider>
  )
}
