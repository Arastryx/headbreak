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

export interface TaskAutomationFieldProps {
  mover?: Headbreak.TaskMover
}

export function TaskAutomationField({ mover }: TaskAutomationFieldProps) {
  const [showEditor, setShowEditor] = useState(false)
  const [value, setValue] = useState<string | undefined>()

  console.log(value)

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch checked={showEditor} onChange={(e) => setShowEditor(e.currentTarget.checked)} />
        }
        label="Recurring Task"
      />
      <Collapse in={showEditor}>
        <Stack spacing={1.5} sx={{ flex: 1 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography sx={{ pt: 1 }}>Move from</Typography>
            <ColumnSelect label="Start Column" sx={{ minWidth: 130, flex: 1 }} size="small" />
            <Typography sx={{ pt: 1 }}>to</Typography>
            <ColumnSelect label="Destination" sx={{ minWidth: 130, flex: 1 }} size="small" />
          </Stack>
          <IntervalSelector value={value} onChange={(v) => setValue(v)} />
        </Stack>
      </Collapse>
    </Box>
  )
}
