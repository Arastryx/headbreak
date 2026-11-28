import { Stack, Box, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { ChangeDisplay } from './ChangeDisplay'
import { CommentCard } from './CommentCard'
import { useIpcData } from '@renderer/Common/Hooks/useIpcCall'

function isComment(c: Headbreak.Comment | Headbreak.ChangeLog): c is Headbreak.Comment {
  return typeof c.content === 'string'
}

export interface TaskHistoryProps {
  task: Headbreak.Task
}

export function TaskHistory({ task }: TaskHistoryProps) {
  const { data: changes } = useIpcData(() => window.kanbanApi.getChanges(task.id), [task.id])

  const history = [...task.comments.filter((c) => !c.markForDeletion), ...(changes ?? [])].sort(
    (a, b) => dayjs(a.createdAt).diff(b.createdAt)
  )

  return (
    <Stack useFlexGap spacing={0.5} sx={{ py: 2 }}>
      {history?.map((c) => (
        <>
          {isComment(c) && (
            <Box sx={{ mx: -1 }}>
              <CommentCard comment={c} />
            </Box>
          )}
          {!isComment(c) && (
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
          )}
        </>
      ))}
    </Stack>
  )
}
