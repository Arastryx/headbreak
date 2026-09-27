import dayjs from 'dayjs'

const weekdays = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
}

// Source - https://stackoverflow.com/a/13627586
// Posted by Salman Arshad, modified by community. See post 'Timeline' for change history
// Retrieved 2026-09-26, License - CC BY-SA 4.0
function withOrdinalSuffix(i: number) {
  let j = i % 10,
    k = i % 100
  if (j === 1 && k !== 11) {
    return i + 'st'
  }
  if (j === 2 && k !== 12) {
    return i + 'nd'
  }
  if (j === 3 && k !== 13) {
    return i + 'rd'
  }
  return i + 'th'
}

export function intervalToString(interval: string) {
  if (!interval.includes('*')) {
    return `After ${interval} day${interval != '1' ? 's' : ''}`
  }

  const [, , date, month, weekday] = interval.split(' ')

  if (weekday != '*') {
    return `Every ${weekdays[weekday]}`
  }

  return month == '*'
    ? `Every ${withOrdinalSuffix(Number(date))} of the month`
    : `Every ${dayjs().date(Number(date)).month(Number(month)).format('MMM D')}`
}
