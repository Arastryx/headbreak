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
import {
  DayOfMonthField,
  DayOfWeekField,
  DayOfYearField,
  IntervalField,
  TimingFieldProps
} from './TimingFields'

type IntervalType = 'interval' | 'dayOfWeek' | 'dayOfMonth' | 'dayOfYear'

interface IntervalOption {
  type: IntervalType
  label: string
  FieldComponent: (props: TimingFieldProps) => React.ReactNode
  defaultValue: string
}

const options: IntervalOption[] = [
  { type: 'interval', label: 'Interval', FieldComponent: IntervalField, defaultValue: '7' },
  {
    type: 'dayOfWeek',
    label: 'Day of Week',
    FieldComponent: DayOfWeekField,
    defaultValue: '* * * * 0'
  },
  {
    type: 'dayOfMonth',
    label: 'Day of Month',
    FieldComponent: DayOfMonthField,
    defaultValue: '* * 1 * *'
  },
  {
    type: 'dayOfYear',
    label: 'Day of Year',
    FieldComponent: DayOfYearField,
    defaultValue: '* * 1 0 *'
  }
]

export interface IntervalSelectorProps {
  value?: string
  onChange: (value?: string, type?: Headbreak.PolicyType) => void
}

function getInitialIntervalType(value?: string): IntervalType | undefined {
  if (!value) {
    return
  }

  if (!value.includes('*')) {
    return 'interval'
  }

  const split = value.split(' ')

  if (split[4] != '*') {
    return 'dayOfWeek'
  }

  return split[3] != '*' ? 'dayOfYear' : 'dayOfMonth'
}

export function IntervalSelector({ value, onChange }: IntervalSelectorProps) {
  const inputRef = useRef<HTMLDivElement>(null)
  const [showPolicyEditor, setShowPolicyEditor] = useState(false)

  const [intervalType, setIntervalType] = useState<IntervalType | undefined>(
    getInitialIntervalType(value)
  )

  const toPolicyType = (type?: IntervalType): Headbreak.PolicyType | undefined =>
    type === undefined ? undefined : type === 'interval' ? 'interval' : 'cron'

  const updateInterval = (nextType: IntervalType) => {
    const selectedOption = options.find((o) => o.type == nextType)

    if (!selectedOption) {
      throw new Error('Attempted to select an invalid interval option type')
    }

    setIntervalType(nextType)
    onChange(selectedOption.defaultValue, toPolicyType(nextType))
  }

  const FieldComponent = options.find((t) => t.type === intervalType)?.FieldComponent

  return (
    <>
      <TextField
        variant="outlined"
        size="small"
        label="Interval"
        value={'Every sunday'}
        onClick={() => setShowPolicyEditor(true)}
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
            onChange={(e) => updateInterval(e.target.value as IntervalType)}
            sx={{ minWidth: 201 }}
          >
            {options.map((t) => (
              <MenuItem key={t.type} value={t.type}>
                {t.label}
              </MenuItem>
            ))}
          </TextField>
          {FieldComponent && value && (
            <Box>
              <FieldComponent
                value={value}
                onChange={(v) => onChange(v, toPolicyType(intervalType))}
              />
            </Box>
          )}
        </Stack>
      </Popover>
    </>
  )
}
