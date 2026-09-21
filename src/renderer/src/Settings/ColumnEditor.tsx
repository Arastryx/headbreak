import { useSortable } from '@dnd-kit/react/sortable'
import { Stack, Icon, TextField, Box, IconButton } from '@mui/material'
import { ColorPicker } from '@renderer/Common/Components/ColorPicker'
import { IconSelector } from '@renderer/Common/Components/IconSelector'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import { useState } from 'react'
import { DeleteColumnDialog } from './DeleteColumnDialog'
import { Micon } from '@renderer/Common/Components/Micon'

export interface ColumnEditorProps {
  column: Headbreak.Column
  index: number
}

export function ColumnEditor({ column, index }: ColumnEditorProps) {
  const { editColumn, deleteColumn } = useKanban()

  const [showDeleteWarning, setShowDeleteWarning] = useState(false)

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
      <IconButton
        color="error"
        onClick={() => {
          if (column.tasks.length > 0) {
            setShowDeleteWarning(true)
          } else {
            deleteColumn(column.id)
          }
        }}
      >
        <Micon icon="delete" />
      </IconButton>
      <DeleteColumnDialog
        columnId={column.id}
        open={showDeleteWarning}
        onClose={() => setShowDeleteWarning(false)}
      />
    </Stack>
  )
}
