import { Box, IconButton, Stack, Typography } from '@mui/material'
import { useIpcData } from '../Common/Hooks/useIpcCall'
import dayjs from 'dayjs'
import { useState } from 'react'
import { TaskEditor } from './TaskEditor'
import { ChangeDisplay } from './ChangeDisplay'
import { Micon } from '../Common/Components/Micon'
import { CommentCard } from './CommentCard'
import { CommentBox } from './CommentBox'

interface TaskContentProps {
  task: Headbreak.Task
  onEditClicked: () => void
}

function TaskContent({ task, onEditClicked }: TaskContentProps) {
  return (
    <>
      <Stack
        direction={'row'}
        spacing={2}
        sx={{ mb: 2, justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <Typography variant="h5">{task.title}</Typography>
        <IconButton size="small" onClick={onEditClicked}>
          <Micon icon="edit" fontSize="inherit" />
        </IconButton>
      </Stack>

      {task.description && (
        <Typography sx={{ whiteSpace: 'pre-wrap' }} gutterBottom>
          {task.description}
        </Typography>
      )}
      {!task.description && (
        <Typography variant="body2" sx={{ color: 'text.secondary' }} gutterBottom>
          No description given
        </Typography>
      )}
    </>
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
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
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

      <Stack useFlexGap spacing={0.5} sx={{ py: 2 }}>
        {history?.map((c) => (
          <>
            {isComment(c) && <CommentCard comment={c} />}
            {!isComment(c) && (
              <Stack
                direction="row"
                spacing={2}
                sx={{ justifyContent: 'space-between', alignItems: 'center', px: 1 }}
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
      <CommentBox taskId={task.id} />
    </Box>
  )
}
