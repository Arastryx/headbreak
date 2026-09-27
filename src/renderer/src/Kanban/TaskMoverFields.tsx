import { Typography, Stack, FormControlLabel, Switch, Box, Collapse } from '@mui/material'
import { ColumnSelect } from '@renderer/Common/Components/ColumnSelect'
import { IntervalSelector } from './IntervalSelector/IntervalSelector'
import { Emphasize } from '@renderer/Common/Components/Emphasize'
import { TaskMoverPayload } from '@renderer/KanbanProvider/useKanbanManagement'

export interface TaskMoverFieldsProps {
  mover?: Partial<TaskMoverPayload>
  highlightErrors?: boolean
  onChange: (m?: Partial<TaskMoverPayload>) => void
}

export function TaskMoverFields({ mover, onChange, highlightErrors }: TaskMoverFieldsProps) {
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
