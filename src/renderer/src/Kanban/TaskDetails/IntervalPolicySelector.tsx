import {
  TextField,
  IconButton,
  Popover,
  Box,
  MenuItem,
  Stack,
  Collapse,
  Typography
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { Micon } from '@renderer/Common/Components/Micon'
import NumberField from '@renderer/Common/Components/NumberField'
import React, { useRef, useState } from 'react'

type IntervalType = 'interval' | 'dayOfWeek' | 'dayOfMonth' | 'dayOfYear'

export interface IntervalPolicySelectorProps {}

export function IntervalPolicySelector({}: IntervalPolicySelectorProps) {
  const inputRef = useRef<HTMLDivElement>(null)
  const [showPolicyEditor, setShowPolicyEditor] = useState(false)

  const [intervalType, setIntervalType] = useState<IntervalType>()

  return (
    <>
      <TextField
        variant="outlined"
        size="small"
        label="Interval"
        value={'Every sunday'}
        slotProps={{
          input: {
            endAdornment: (
              <IconButton size="small" onClick={() => setShowPolicyEditor(true)}>
                <Micon icon="calendar_month" fontSize="inherit" />
              </IconButton>
            )
          },
          htmlInput: { readOnly: true }
        }}
        ref={inputRef}
      />
      <Popover
        open={showPolicyEditor}
        onClose={() => setShowPolicyEditor(false)}
        anchorEl={inputRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: -5,
          horizontal: 'center'
        }}
        elevation={3}
      >
        <Stack direction="row" spacing={2} sx={{ p: 2 }}>
          <TextField
            label="Interval Type"
            select
            size="small"
            value={intervalType}
            onChange={(e) => setIntervalType(e.target.value as IntervalType)}
            sx={{ minWidth: 201 }}
          >
            <MenuItem value="interval">Interval</MenuItem>
            <MenuItem value="dayOfWeek">Day of Week</MenuItem>
            <MenuItem value="dayOfMonth">Day of Month</MenuItem>
            <MenuItem value="dayOfYear">Day of Year</MenuItem>
          </TextField>
          <Collapse orientation="horizontal" in={intervalType != null}>
            {intervalType === 'interval' && (
              <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
                <Typography>After</Typography>
                <NumberField size="small" width={100} />
                <Typography>days</Typography>
              </Stack>
            )}
            {intervalType === 'dayOfWeek' && (
              <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center', mt: 2 }}>
                <Typography>Every</Typography>
                <TextField select size="small" sx={{ minWidth: 100 }}>
                  <MenuItem value="Sunday">Sunday</MenuItem>
                  <MenuItem value="Monday">Monday</MenuItem>
                  <MenuItem value="Tuesday">Tuesday</MenuItem>
                  <MenuItem value="Wednesday">Wednesday</MenuItem>
                  <MenuItem value="Thursday">Thursday</MenuItem>
                  <MenuItem value="Friday">Friday</MenuItem>
                  <MenuItem value="Saturday">Saturday</MenuItem>
                </TextField>
              </Stack>
            )}
            {intervalType === 'dayOfMonth' && (
              <Box>
                <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography>Day</Typography>
                  <NumberField width={100} size="small" min={1} max={31} />
                  <Typography>of month</Typography>
                </Stack>
                <Typography component={Box} variant="caption" sx={{ width: 190, mt: 0.5 }}>
                  Note: Days 29-31 will only proc for months that have that day
                </Typography>
              </Box>
            )}
            {intervalType === 'dayOfYear' && (
              <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center', mt: 2 }}>
                <Typography>Every</Typography>
                <DatePicker
                  format="MMMM Do"
                  slotProps={{ textField: { variant: 'standard' } }}
                  sx={{ width: 170 }}
                />
              </Stack>
            )}
          </Collapse>
        </Stack>
      </Popover>
    </>
  )
}
