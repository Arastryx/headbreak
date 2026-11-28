import { Box, Divider, IconButton, Skeleton, Stack, Typography } from '@mui/material'
import { useIpcData } from '../../Common/Hooks/useIpcCall'
import dayjs from 'dayjs'
import { useState } from 'react'
import { TaskEditor } from '../TaskEditor/TaskEditor'
import { Micon } from '../../Common/Components/Micon'
import { CommentCard } from './CommentCard'
import { ChangeDisplay } from './ChangeDisplay'
import { CommentBox } from './CommentBox'
import { intervalToString } from '../IntervalSelector/intervalToString'
import { ColumnLabel } from '@renderer/Common/Components/ColumnLabel'
import { TagChip } from '@renderer/Common/Components/TagChip'
import { calculateTimeUntilMove, TimeUntilMove } from '../MovementWarning'
import { AttachmentCreator } from '../AttachmentCreator'
import { AttachmentDisplay } from '../AttachmentDisplay'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import { linkifyText } from './linkifyText'
import { TaskNumber } from '../TaskNumber'
import { TaskHistory } from './TaskHistory'

export interface TaskDetailsProps {
  task: Headbreak.Task
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const [editMode, setEditMode] = useState(false)

  const createdThisYear = dayjs(task.createdAt).year() === dayjs().year()

  const { deleteAttachment } = useKanban()

  return (
    <Box sx={{ minWidth: 300 }}>
      <Typography variant="caption">
        Created {dayjs(task.createdAt).format(createdThisYear ? 'MMM D' : 'll')}
      </Typography>
      {!editMode && (
        <Stack spacing={2}>
          <Stack
            direction={'row'}
            spacing={2}
            sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <Typography variant="h5">
              <TaskNumber number={task.number} /> {task.title}
            </Typography>
            <IconButton size="small" onClick={() => setEditMode(true)}>
              <Micon icon="edit" fontSize="inherit" />
            </IconButton>
          </Stack>
          {task.description && (
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{linkifyText(task.description)}</Typography>
          )}
          {task.tags && (
            <Stack direction={'row'} spacing={1}>
              {task.tags.map((t) => (
                <TagChip key={t} tag={t} />
              ))}
            </Stack>
          )}

          <Box>
            <AttachmentCreator taskId={task.id} />
          </Box>
          <AttachmentDisplay
            attachments={task.attachments}
            onDelete={(a) => deleteAttachment(a.id)}
          />

          {task.mover && (
            <Typography variant="caption">
              This task moves from{' '}
              <ColumnLabel
                variant="caption"
                column={task.mover.sourceColumn}
                sx={{ opacity: 0.7 }}
              />{' '}
              to{' '}
              <ColumnLabel
                variant="caption"
                column={task.mover.destinationColumn}
                sx={{ opacity: 0.7 }}
              />{' '}
              {intervalToString(task.mover.policy, false)} (
              <TimeUntilMove {...calculateTimeUntilMove(task.mover, task.lastMoved)} />)
            </Typography>
          )}
        </Stack>
      )}
      {editMode && (
        <TaskEditor columnId={task.column} task={task} onClose={() => setEditMode(false)} />
      )}

      {!editMode && (
        <>
          <Divider sx={{ mx: -1, mt: 1 }} />
          <TaskHistory task={task} />
          <CommentBox taskId={task.id} />
        </>
      )}
    </Box>
  )
}
