import { Typography } from '@mui/material'
import { ColumnLabel } from '../../Common/Components/ColumnLabel'

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
        {change.automatic ? 'Automatically moved' : 'Moved'} from{' '}
        <ColumnLabel column={change.from} sx={{ fontWeight: '500' }} /> to{' '}
        <ColumnLabel column={change.to} sx={{ fontWeight: '500' }} />
      </Typography>
    )
  }

  if (change.type === 'recurringChange') {
    switch (change.change) {
      case 'add':
        return <Typography>The task was made recurring</Typography>
      case 'edit':
        return <Typography>The recurring task settings were changed</Typography>
      case 'delete':
        return <Typography>The task was made no longer recurring</Typography>
    }
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
