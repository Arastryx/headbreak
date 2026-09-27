import { TextField, IconButton, Popover, Box, MenuItem, Stack } from '@mui/material'
import { Micon } from '@renderer/Common/Components/Micon'
import { useEffect, useRef, useState } from 'react'
import { intervalToString } from './intervalToString'
import { getIntervalType, intervalOptions, IntervalType } from './intervalTypes'

export interface IntervalSelectorProps {
  value?: string
  onChange: (value?: string, type?: Headbreak.PolicyType) => void
}

export function IntervalSelector({ value, onChange }: IntervalSelectorProps) {
  const inputRef = useRef<HTMLDivElement>(null)
  const [showPolicyEditor, setShowPolicyEditor] = useState(false)

  const [intervalType, setIntervalType] = useState<IntervalType | undefined>(getIntervalType(value))

  useEffect(() => {
    setIntervalType(getIntervalType(value))
  }, [value])

  const toPolicyType = (type?: IntervalType): Headbreak.PolicyType | undefined =>
    type === undefined ? undefined : type === 'interval' ? 'interval' : 'cron'

  const updateInterval = (nextType: IntervalType) => {
    const selectedOption = intervalOptions.find((o) => o.type == nextType)

    if (!selectedOption) {
      throw new Error('Attempted to select an invalid interval option type')
    }

    setIntervalType(nextType)
    onChange(selectedOption.defaultValue, toPolicyType(nextType))
  }

  const FieldComponent = intervalOptions.find((t) => t.type === intervalType)?.FieldComponent

  return (
    <>
      <TextField
        size="small"
        placeholder="Interval"
        value={value ? intervalToString(value) : ''}
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
        fullWidth
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
            {intervalOptions.map((t) => (
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
