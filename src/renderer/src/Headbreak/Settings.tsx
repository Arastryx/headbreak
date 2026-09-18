import React, { useRef, useState } from 'react'
import { useKanban } from './KanbanProvider'
import {
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  Popover,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { IconSelector } from './IconSelector'
import { CollisionPriority } from '@dnd-kit/abstract'
import { useDroppable } from '@dnd-kit/react'
import { MaterialIcon } from 'material-icons'
import { HexColorPicker } from 'react-colorful'
import { ColorPicker } from './Common/ColorPicker'

interface ColumnEditorProps {
  column: Headbreak.Column
}

function ColumnEditor({ column }: ColumnEditorProps) {
  const { editColumn, deleteColumn } = useKanban()

  const { ref } = useDroppable({
    id: column.id,
    type: 'column',
    accept: 'item',
    collisionPriority: CollisionPriority.Low
  })

  return (
    <Stack direction="row" sx={{ alignItems: 'center' }}>
      <Stack
        sx={{
          justifyContent: 'center',
          cursor: 'grab',
          width: 30
        }}
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
  const { kanban, createColumn } = useKanban()

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Columns
      </Typography>
      <Stack spacing={1}>
        {kanban
          ?.filter((c) => !c.markForDeletion)
          .map((c) => (
            <ColumnEditor key={c.id} column={c} />
          ))}
        <Button onClick={createColumn}>
          <Icon>add</Icon>
        </Button>
      </Stack>
    </Container>
  )
}
