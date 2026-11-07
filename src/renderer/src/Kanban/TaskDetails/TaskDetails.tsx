import { Box, Divider, Grid, IconButton, Stack, Typography } from '@mui/material'
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
import { ImageAttachment } from './ImageAttachment'
import { TextAttachment } from './TextAttachment'

function isComment(c: Headbreak.Comment | Headbreak.ChangeLog): c is Headbreak.Comment {
  return typeof c.content === 'string'
}

export interface TaskDetailsProps {
  task: Headbreak.Task
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const { data: changes } = useIpcData(() => window.kanbanApi.getChanges(task.id), [task.id])
  const { data: attachments, reload: reloadAttachments } = useIpcData(
    () => window.attachmentApi.getForTask(task.id),
    [task.id]
  )
  const [editMode, setEditMode] = useState(false)

  const createdThisYear = dayjs(task.createdAt).year() === dayjs().year()

  const history = [...task.comments.filter((c) => !c.markForDeletion), ...(changes ?? [])].sort(
    (a, b) => dayjs(a.createdAt).diff(b.createdAt)
  )

  const imageAttachments = attachments?.filter((a) => a.thumbnail != null)
  const textAttachments = attachments?.filter((a) => a.thumbnail == null)

  const imageGridSizing: { size: number; maxHeight: number } =
    imageAttachments?.length == 1
      ? { size: 12, maxHeight: 512 }
      : (imageAttachments?.length ?? 0) >= 9
        ? { size: 4, maxHeight: 190 }
        : { size: 6, maxHeight: 232 }

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
            <Typography variant="h5">{task.title}</Typography>
            <IconButton size="small" onClick={() => setEditMode(true)}>
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

          <Box>
            <AttachmentCreator taskId={task.id} onChange={reloadAttachments} />
          </Box>
          <Grid container sx={{ alignItems: 'stretch' }}>
            {imageAttachments?.map((a) => (
              <Grid key={a.id} size={imageGridSizing.size}>
                <ImageAttachment
                  attachment={a}
                  onChange={reloadAttachments}
                  maxHeight={imageGridSizing.maxHeight}
                />
              </Grid>
            ))}
          </Grid>
          {textAttachments?.length != 0 && (
            <Stack>
              {textAttachments?.map((a) => (
                <TextAttachment key={a.id} attachment={a} onChange={reloadAttachments} />
              ))}
            </Stack>
          )}

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
