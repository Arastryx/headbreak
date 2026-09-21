import { useKanban } from './KanbanProvider/KanbanProvider'
import {
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { IconSelector } from './IconSelector'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { ColorPicker } from './Common/Components/ColorPicker'

interface ColumnEditorProps {
  column: Headbreak.Column
  index: number
}

function ColumnEditor({ column, index }: ColumnEditorProps) {
  const { editColumn, deleteColumn } = useKanban()

  const { ref, handleRef } = useSortable({
    id: column.id,
    index
  })

  return (
    <Stack direction="row" sx={{ alignItems: 'center' }} ref={ref}>
      <Stack
        sx={{
          justifyContent: 'center',
          cursor: 'grab',
          width: 30
        }}
        ref={handleRef}
      >
        <Icon sx={{ color: column.color }}>drag_indicator</Icon>
      </Stack>
      <TextField
        placeholder="Label"
        value={column.label}
        onChange={(e) => editColumn(column.id, { label: e.currentTarget.value })}
        sx={{ flex: 1 }}
        slotProps={{ input: { sx: { color: column.color } } }}
      />

      <Box sx={{ ml: 1, mr: 0.5 }}>
        <ColorPicker
          color={column.color ?? '#000'}
          onChange={(c) => editColumn(column.id, { color: c })}
        />
      </Box>
      <IconSelector
        icon={column.icon ?? 'loop'}
        color={column.color}
        onSelect={(icon) => editColumn(column.id, { icon })}
      />
      <IconButton color="error" onClick={() => deleteColumn(column.id)}>
        <Icon>delete</Icon>
      </IconButton>
    </Stack>
  )
}

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
