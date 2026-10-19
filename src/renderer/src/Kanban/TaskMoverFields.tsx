import { Typography, Stack, FormControlLabel, Switch, Box, Collapse, Tooltip } from '@mui/material'
import { ColumnSelect } from '@renderer/Common/Components/ColumnSelect'
import { IntervalSelector } from './IntervalSelector/IntervalSelector'
import { Emphasize } from '@renderer/Common/Components/Emphasize'
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers'
import { Micon } from '@renderer/Common/Components/Micon'

export interface TaskMoverFieldsProps {
  mover?: Partial<Headbreak.Payload.TaskMover>
  highlightErrors?: boolean
  currentColumnId: string
  onChange: (m?: Partial<Headbreak.Payload.TaskMover>) => void
}

export function TaskMoverFields({
  mover,
  onChange,
  highlightErrors,
  currentColumnId
}: TaskMoverFieldsProps) {
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
            <Emphasize
              color="error"
              show={highlightErrors && !mover?.sourceColumn}
              sx={{ flex: 1 }}
            >
              <ColumnSelect
                label="Start Column"
                value={mover?.sourceColumn ?? ''}
                onChange={(value) => onChange({ ...mover, sourceColumn: value })}
                sx={{ minWidth: 130 }}
                size="small"
                fullWidth
              />
            </Emphasize>
            <Typography sx={{ pt: 1 }}>to</Typography>
            <Emphasize
              color="error"
              show={highlightErrors && !mover?.destinationColumn}
              sx={{ flex: 1 }}
            >
              <ColumnSelect
                label="Destination"
                value={mover?.destinationColumn ?? ''}
                onChange={(value) => onChange({ ...mover, destinationColumn: value })}
                sx={{ minWidth: 130 }}
                size="small"
                fullWidth
              />
            </Emphasize>
          </Stack>
          <Emphasize color="error" show={highlightErrors && (!mover?.policy || !mover.policyType)}>
            <IntervalSelector
              value={mover?.policy}
              onChange={(v, type) => onChange({ ...mover, policy: v, policyType: type })}
            />
          </Emphasize>
        </Stack>
      </Collapse>
    </Box>
  )
}
