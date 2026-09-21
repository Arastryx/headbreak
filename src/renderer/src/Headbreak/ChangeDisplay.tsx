import { Typography } from '@mui/material'
import { ColumnLabel } from './Common/ColumnLabel'

function andify(list: React.ReactNode[]) {
  const result = list.flatMap((l) => [l, ', ']).slice(0, -1)

  if (result.length >= 3) {
    result[result.length - 2] = ' and '
  }

  return result
}

export interface ChangeDisplayProps {
  change: Headbreak.Change
}

export function ChangeDisplay({ change }: ChangeDisplayProps) {
  if (change.type === 'columnMove') {
    return (
      <Typography>
        Moved from <ColumnLabel column={change.from} sx={{ fontWeight: '500' }} /> to{' '}
        <ColumnLabel column={change.to} sx={{ fontWeight: '500' }} />
      </Typography>
    )
  }

  const updated: string[] = []

  if (change.prev.title != change.next.title) {
    updated.push('title')
  }

  if (change.prev.description != change.next.description) {
    updated.push('description')
  }

  return (
    <Typography>
      Updated{' '}
      {andify(
        updated.map((u) => (
          <Typography component="span" sx={{ fontWeight: '500' }}>
            {u}
          </Typography>
        ))
      )}
    </Typography>
  )
}
