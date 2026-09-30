import { Box, Divider, IconButton, Stack, Typography } from '@mui/material'
import { useIpcData } from '../../Common/Hooks/useIpcCall'
import dayjs from 'dayjs'
import { useState } from 'react'
import { TaskEditor } from '../TaskEditor'
import { Micon } from '../../Common/Components/Micon'
import { CommentCard } from './CommentCard'
import { ChangeDisplay } from './ChangeDisplay'
import { CommentBox } from './CommentBox'
import { intervalToString } from '../IntervalSelector/intervalToString'
import { ColumnLabel } from '@renderer/Common/Components/ColumnLabel'
import { TagChip } from '@renderer/Common/Components/TagChip'

interface TaskContentProps {
  task: Headbreak.Task
  onEditClicked: () => void
}

function TaskContent({ task, onEditClicked }: TaskContentProps) {
  return (
    <Stack spacing={2}>
      <Stack
        direction={'row'}
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <Typography contentEditable={true} variant="h5">
          {task.title}
        </Typography>
        <IconButton size="small" onClick={onEditClicked}>
          <Micon icon="edit" fontSize="inherit" />
        </IconButton>
      </Stack>
      {task.description && (
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{task.description}</Typography>
      )}
      {task.tags && (
        <Stack direction={'row'} spacing={1}>
          {task.tags.map((t) => (
            <TagChip key={t} tag={t} />
          ))}
        </Stack>
      )}
      {task.mover && (
        <Typography variant="caption">
          This task moves from{' '}
          <ColumnLabel variant="caption" column={task.mover.sourceColumn} sx={{ opacity: 0.7 }} />{' '}
          to{' '}
          <ColumnLabel
            variant="caption"
            column={task.mover.destinationColumn}
            sx={{ opacity: 0.7 }}
          />{' '}
          {intervalToString(task.mover.policy, false)}
        </Typography>
      )}
    </Stack>
  )
}

function isComment(c: Headbreak.Comment | Headbreak.ChangeLog): c is Headbreak.Comment {
  return typeof c.content === 'string'
}

export interface TaskDetailsProps {
  task: Headbreak.Task
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const { data: changes } = useIpcData(() => window.kanbanApi.getChanges(task.id), [task.id])
  const [editMode, setEditMode] = useState(false)

  const createdThisYear = dayjs(task.createdAt).year() === dayjs().year()

  const history = [...task.comments.filter((c) => !c.markForDeletion), ...(changes ?? [])].sort(
    (a, b) => dayjs(a.createdAt).diff(b.createdAt)
  )

  return (
    <Box sx={{ minWidth: 300 }}>
      <Typography variant="caption">
        Created {dayjs(task.createdAt).format(createdThisYear ? 'MMM D' : 'll')}
      </Typography>
      {!editMode && <TaskContent task={task} onEditClicked={() => setEditMode(true)} />}
      {editMode && (
        <TaskEditor columnId={task.column} task={task} onClose={() => setEditMode(false)} />
      )}

      {!editMode && (
        <>
          <Divider sx={{ mx: -1, mt: 1 }} />
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
                      {dayjs
                        .duration(dayjs(c.createdAt).diff(dayjs()), 'milliseconds')
                        .humanize(true)}
                    </Typography>
                  </Stack>
                )}
              </>
            ))}
          </Stack>
          <CommentBox taskId={task.id} />
        </>
      )}
    </Box>
  )
}
