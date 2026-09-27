import {
  Typography,
  alpha,
  Stack,
  IconButton,
  FormControlLabel,
  Switch,
  Box,
  Collapse
} from '@mui/material'
import { ColumnSelect } from '@renderer/Common/Components/ColumnSelect'
import { Micon } from '@renderer/Common/Components/Micon'
import { useState } from 'react'
import { IntervalSelector } from './IntervalSelector/IntervalSelector'

export type TaskMoverPayload = Partial<
  Pick<Headbreak.TaskMover, 'sourceColumnId' | 'destinationColumnId' | 'policy' | 'policyType'>
>

export interface TaskMoverFieldsProps {
  mover?: TaskMoverPayload
  onChange: (m?: TaskMoverPayload) => void
}

export function TaskMoverFields({ mover, onChange }: TaskMoverFieldsProps) {
  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={mover != null}
            onChange={(e) => onChange(e.currentTarget.checked ? {} : undefined)}
          />
        }
        label="Recurring Task"
      />
      <Collapse in={mover != null}>
        <Stack spacing={1.5} sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography sx={{ pt: 1 }}>Move from</Typography>
            <ColumnSelect
              label="Start Column"
              value={mover?.sourceColumnId ?? ''}
              onChange={(value) => onChange({ ...mover, sourceColumnId: value })}
              sx={{ minWidth: 130, flex: 1 }}
              size="small"
            />
            <Typography sx={{ pt: 1 }}>to</Typography>
            <ColumnSelect
              label="Destination"
              value={mover?.destinationColumnId ?? ''}
              onChange={(value) => onChange({ ...mover, destinationColumnId: value })}
              sx={{ minWidth: 130, flex: 1 }}
              size="small"
            />
          </Stack>
          <IntervalSelector
            value={mover?.policy}
            onChange={(v, type) => onChange({ ...mover, policy: v, policyType: type })}
          />
        </Stack>
      </Collapse>
    </Box>
  )
}
