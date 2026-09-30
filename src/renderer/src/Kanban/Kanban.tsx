import { Column, COLUMN_TYPE } from './Column'
import { Stack } from '@mui/material'
import { DragDropProvider } from '@dnd-kit/react'
import { useKanban } from '../KanbanProvider/KanbanProvider'
import { TaskFilters } from './filterTasks'

interface Column {
  id: number
  label?: string
}

export interface KanbanProps {
  filters?: TaskFilters
}

export function Kanban({ filters }: KanbanProps) {
  const { kanban, moveTaskToColumn, reorderTasks } = useKanban()

  return (
    <DragDropProvider
      onDragOver={({ operation }) => {
        if (
          !operation.source?.id ||
          !operation.target?.id ||
          operation.source?.id === operation.target?.id
        ) {
          return
        }

        if (operation.target.type === COLUMN_TYPE) {
          moveTaskToColumn(operation.source.id as string, operation.target.id as string)
        } else {
          reorderTasks(operation.source.id as string, operation.target.id as string)
        }
      }}
    >
      <Stack direction={'row'} spacing={2} sx={{ height: '100%' }}>
        {kanban
          ?.filter((c) => !c.markForDeletion)
          .map((c) => (
            <Column key={c.id} column={c} filters={filters} />
          ))}
      </Stack>
    </DragDropProvider>
  )
}
