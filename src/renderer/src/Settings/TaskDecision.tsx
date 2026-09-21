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
import { Micon } from '@renderer/Common/Components/Micon'

export type Decision = 'move' | 'delete'

export interface TaskDecisionProps {
  decision: Decision
  targetColumnId: string
  otherColumns: Headbreak.Column[]
  onChange: (d: Decision, id: string) => void
}

export function TaskDecision({
  decision,
  targetColumnId,
  otherColumns,
  onChange
}: TaskDecisionProps) {
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
        <TextField
          placeholder="Target Column"
          select
          size="small"
          value={targetColumnId}
          onChange={(e) => onChange(decision, e.target.value)}
          slotProps={{
            select: {
              displayEmpty: true,
              renderValue: (value: unknown) => {
                const target = otherColumns?.find((c) => c.id === value)

                if (!target) {
                  return <Typography color="textSecotendary">Selected Column</Typography>
                }
                return renderOption(target)
              }
            }
          }}
          sx={{ mt: 1 }}
          fullWidth
        >
          {otherColumns.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {renderOption(c)}
            </MenuItem>
          ))}
        </TextField>
      </Collapse>
    </>
  )
}
