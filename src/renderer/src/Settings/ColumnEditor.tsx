import { useSortable } from '@dnd-kit/react/sortable'
import {
  Stack,
  Icon,
  TextField,
  Box,
  IconButton,
  Typography,
  Collapse,
  FormControl,
  FormControlLabel,
  Checkbox,
  Tooltip
} from '@mui/material'
import { ColorPicker } from '@renderer/Common/Components/ColorPicker'
import { IconSelector } from '@renderer/Common/Components/IconSelector'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import { useEffect, useState } from 'react'
import { DeleteColumnDialog } from './DeleteColumnDialog'
import { Micon } from '@renderer/Common/Components/Micon'
import NumberField from '@renderer/Common/Components/NumberField'

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

  const [showDetails, setShowDetails] = useState(false)
  const [enableHiding, setEnableHiding] = useState(column.hideDelay != null && column.hideDelay > 0)

  const toggleHiding = (hidingWillBeEnabled: boolean) => {
    editColumn(column.id, { hideDelay: hidingWillBeEnabled ? 30 : undefined })
    setEnableHiding(hidingWillBeEnabled)
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ alignItems: 'center', bgcolor: '#f3f3f3', borderRadius: 1, p: 1 }}
      ref={ref}
    >
      <Stack
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'grab',
          width: 30
        }}
        ref={handleRef}
      >
        <Micon icon="drag_indicator" sx={{ color: column.color }} />
      </Stack>
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <IconButton onClick={() => setShowDetails(!showDetails)}>
            <Micon icon={showDetails ? 'expand_less' : 'expand_more'} />
          </IconButton>
          <TextField
            placeholder="Label"
            value={column.label}
            onChange={(e) => editColumn(column.id, { label: e.currentTarget.value })}
            sx={{ flex: 1 }}
            slotProps={{ input: { sx: { color: column.color } } }}
          />

          <Stack direction="row" useFlexGap sx={{ alignItems: 'center' }}>
            <Box sx={{ ml: 1, mr: 1 }}>
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
              sx={{ ml: 3 }}
            >
              <Micon icon="delete" />
            </IconButton>
          </Stack>
          <DeleteColumnDialog
            columnId={column.id}
            open={showDeleteWarning}
            onClose={() => setShowDeleteWarning(false)}
          />
        </Stack>
        <Collapse in={showDetails}>
          <Stack direction="row" spacing={2} sx={{ py: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={enableHiding}
                  onChange={(e) => toggleHiding(e.currentTarget.checked)}
                />
              }
              label={
                <Stack direction={'row'} spacing={0.5}>
                  <Typography>Hide stale tasks</Typography>
                  <Tooltip title="Hides tasks that have been in this column for a certain amount of days">
                    <Micon icon="info" fontSize="small" sx={{ opacity: 0.9 }} />
                  </Tooltip>
                </Stack>
              }
            />
            <Collapse in={enableHiding} orientation="horizontal">
              <NumberField
                label="Days until hidden"
                value={column.hideDelay}
                size="small"
                width={155}
                onValueChange={(value) => editColumn(column.id, { hideDelay: value ?? undefined })}
              />
            </Collapse>
          </Stack>
        </Collapse>
      </Box>
    </Stack>
  )
}
