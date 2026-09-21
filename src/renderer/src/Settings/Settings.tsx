import { useKanban } from '../KanbanProvider/KanbanProvider'
import { Button, Container, Icon, Stack, Typography } from '@mui/material'
import { DragDropProvider } from '@dnd-kit/react'
import { ColumnEditor } from './ColumnEditor'

export interface SettingsProps {}

export function Settings({}: SettingsProps) {
  const { kanban, createColumn, reorderColumn } = useKanban()

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Columns
      </Typography>
      <DragDropProvider
        onDragOver={({ operation: e }) => {
          if (e.source?.id && e.target?.id && e.source.id != e.target.id) {
            reorderColumn(e.source.id as string, e.target.id as string)
          }
        }}
      >
        <Stack spacing={1}>
          {kanban
            ?.filter((c) => !c.markForDeletion)
            .map((c, index) => (
              <ColumnEditor key={c.id} column={c} index={index} />
            ))}
          <Button onClick={createColumn}>
            <Icon>add</Icon>
          </Button>
        </Stack>
      </DragDropProvider>
    </Container>
  )
}
