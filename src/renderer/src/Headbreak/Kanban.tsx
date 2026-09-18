import { Column } from './Column'
import { Stack } from '@mui/material'
import { DragDropProvider } from '@dnd-kit/react'
import { useKanban } from './KanbanProvider'

interface Column {
  id: number
  label?: string
}

export interface KanbanProps {}

export function Kanban({}: KanbanProps) {
  const { kanban } = useKanban()

  return (
    <DragDropProvider>
      <Stack direction={'row'} spacing={2} sx={{ height: '100%', p: 2 }}>
        {kanban
          ?.filter((c) => !c.markForDeletion)
          .map((c) => (
            <Column key={c.id} column={c} />
          ))}
      </Stack>
    </DragDropProvider>
  )
}
