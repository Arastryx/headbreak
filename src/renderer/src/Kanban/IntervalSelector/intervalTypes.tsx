import {
  TimingFieldProps,
  IntervalField,
  DayOfWeekField,
  DayOfMonthField,
  DayOfYearField
} from './TimingFields'

export type IntervalType = 'interval' | 'dayOfWeek' | 'dayOfMonth' | 'dayOfYear'

export interface IntervalOption {
  type: IntervalType
  label: string
  FieldComponent: (props: TimingFieldProps) => React.ReactNode
  defaultValue: string
}

export const intervalOptions: IntervalOption[] = [
  { type: 'interval', label: 'Interval', FieldComponent: IntervalField, defaultValue: '7' },
  {
    type: 'dayOfWeek',
    label: 'Day of Week',
    FieldComponent: DayOfWeekField,
    defaultValue: '0 0 * * 0'
  },
  {
    type: 'dayOfMonth',
    label: 'Day of Month',
    FieldComponent: DayOfMonthField,
    defaultValue: '0 0 1 * *'
  },
  {
    type: 'dayOfYear',
    label: 'Day of Year',
    FieldComponent: DayOfYearField,
    defaultValue: '0 0 1 0 *'
  }
]

export function getIntervalType(value?: string): IntervalType | undefined {
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
