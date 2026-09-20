import { Box, Stack, Typography, TypographyProps } from '@mui/material'
import { useIpcData } from './Common/useIpcCall'
import dayjs from 'dayjs'
import { Micon } from './Common/Micon'

interface ColumnLabelProps extends Omit<TypographyProps, 'children'> {
  column: Headbreak.LogColumn
}

function ColumnLabel({ column, ...props }: ColumnLabelProps) {
  return (
    <Typography component="span" {...props} sx={{ color: column.color, ...props.sx }}>
      {column.label ?? 'Unnamed'}{' '}
      <Micon fontSize="inherit" icon={column.icon ?? 'loop'} sx={{ verticalAlign: 'middle' }} />
    </Typography>
  )
}

interface ChangeDisplayProps {
  change: Headbreak.Change
}

function ChangeDisplay({ change }: ChangeDisplayProps) {
  if (change.type === 'columnMove') {
    return (
      <Typography>
        Moved from <ColumnLabel column={change.from} /> to <ColumnLabel column={change.to} />
      </Typography>
    )
  }

  return '[WIP]'
}

export interface TaskDetailsProps {
  task: Headbreak.Task
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const { data: changes } = useIpcData(() => window.kanbanApi.getChanges(task.id), [task.id])

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {task.title}
      </Typography>
      {task.description && (
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{task.description}</Typography>
      )}
      {!task.description && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          No description given
        </Typography>
      )}
      <Stack spacing={0.5} sx={{ pt: 2 }}>
        {changes?.map((c) => (
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <ChangeDisplay key={c.id} change={c.content} />
            <Typography variant="caption">
              {dayjs.duration(dayjs(c.createdAt).diff(dayjs()), 'milliseconds').humanize(true)}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
