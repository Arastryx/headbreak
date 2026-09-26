import {
  RadioGroup,
  FormControlLabel,
  Radio,
  Collapse,
  TextField,
  Typography,
  Stack,
  MenuItem
} from '@mui/material'
import { ColumnSelect } from '@renderer/Common/Components/ColumnSelect'
import { Micon } from '@renderer/Common/Components/Micon'

export type Decision = 'move' | 'delete'

export interface TaskDecisionProps {
  decision: Decision
  targetColumnId: string
  columnId: string
  onChange: (d: Decision, id: string) => void
}

export function TaskDecision({ decision, targetColumnId, columnId, onChange }: TaskDecisionProps) {
  const renderOption = (c: Headbreak.Column) => (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: c.color }}>
      <Micon icon={c.icon ?? 'loop'} />
      <Typography> {c.label}</Typography>
    </Stack>
  )

  return (
    <>
      <RadioGroup
        value={decision}
        onChange={(e) => onChange(e.currentTarget.value as Decision, targetColumnId)}
        row
      >
        <FormControlLabel value="delete" control={<Radio />} label="Delete tasks" />
        <FormControlLabel value="move" control={<Radio />} label="Move to another column" />
      </RadioGroup>
      <Collapse in={decision == 'move'}>
        <ColumnSelect
          placeholder="Target Column"
          size="small"
          omit={(c) => c.id == columnId}
          value={targetColumnId}
          onChange={(value) => onChange(decision, value)}
          sx={{ mt: 1 }}
          fullWidth
        />
      </Collapse>
    </>
  )
}
