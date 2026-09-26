import { Stack, Typography, TextField, MenuItem, Box } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import NumberField from '@renderer/Common/Components/NumberField'
import dayjs from 'dayjs'

export interface TimingFieldProps {
  value: string
  onChange: (value: string) => void
}

export function IntervalField({ value, onChange }: TimingFieldProps) {
  return (
    <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
      <Typography>After</Typography>
      <NumberField
        size="small"
        width={100}
        value={Number(value)}
        onValueChange={(value) => onChange(value?.toString() ?? '1')}
      />
      <Typography>days</Typography>
    </Stack>
  )
}

export function DayOfWeekField({ value, onChange }: TimingFieldProps) {
  return (
    <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center', mt: 2 }}>
      <Typography>Every</Typography>
      <TextField
        select
        size="small"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ minWidth: 100 }}
      >
        <MenuItem value="* * * * 0">Sunday</MenuItem>
        <MenuItem value="* * * * 1">Monday</MenuItem>
        <MenuItem value="* * * * 2">Tuesday</MenuItem>
        <MenuItem value="* * * * 3">Wednesday</MenuItem>
        <MenuItem value="* * * * 4">Thursday</MenuItem>
        <MenuItem value="* * * * 5">Friday</MenuItem>
        <MenuItem value="* * * * 6">Saturday</MenuItem>
      </TextField>
    </Stack>
  )
}

export function DayOfMonthField({ value, onChange }: TimingFieldProps) {
  const day = Number(value.split(' ')[2])

  return (
    <Box>
      <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
        <Typography>Day</Typography>
        <NumberField
          width={100}
          size="small"
          value={day}
          min={1}
          max={31}
          onValueChange={(value) => onChange(`* * ${value} * *`)}
        />
        <Typography>of month</Typography>
      </Stack>
      <Typography component={Box} variant="caption" sx={{ width: 190, mt: 0.5 }}>
        Note: Days 29-31 will only proc for months that have that day
      </Typography>
    </Box>
  )
}

export function DayOfYearField({ value, onChange }: TimingFieldProps) {
  const split = value.split(' ')
  const day = Number(split[2])
  const month = Number(split[3])

  const dateValue = dayjs().set('date', day).set('month', month)

  return (
    <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center', mt: 2 }}>
      <Typography>Every</Typography>
      <DatePicker
        format="MMMM Do"
        value={dateValue}
        onChange={(d) => onChange(`* * ${d?.date()} ${d?.month()} *`)}
        slotProps={{ textField: { variant: 'standard' } }}
        sx={{ width: 170 }}
      />
    </Stack>
  )
}
