import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Dialog,
  DialogContent,
  Box,
  Stack,
  Tooltip
} from '@mui/material'
import { useSortable } from '@dnd-kit/react/sortable'
import { useState } from 'react'
import { useKanban } from '../KanbanProvider/KanbanProvider'
import dayjs, { Dayjs } from 'dayjs'
import { TaskDetails } from './TaskDetails/TaskDetails'
import { ContextMenu } from '../Common/Components/ContextMenu'
import { FadeOutText } from '../Common/Components/FadeOutText'
import { TagChip } from '@renderer/Common/Components/TagChip'
import { Micon } from '@renderer/Common/Components/Micon'
import { ColumnLabel } from '@renderer/Common/Components/ColumnLabel'
import { parseCronExpression } from 'cron-schedule'

function getNextMovementDate(mover: Headbreak.TaskMover, lastMoved: string) {
  let nextDate: Dayjs

  if (mover.policyType === 'interval') {
    const numberOfDays = Number(mover.policy)
    nextDate = dayjs(lastMoved).add(numberOfDays, 'days').startOf('day')
  } else {
    const cron = parseCronExpression(mover.policy)
    nextDate = dayjs(cron.getNextDate(new Date(Date.parse(lastMoved))))
  }

  return nextDate
}

export const TASK_TYPE = 'task'

export interface TaskCardProps {
  task: Headbreak.Task
  index: number
  columnId: string
}

export function TaskCard({ task, index, columnId }: TaskCardProps) {
  const { ref, isDragging } = useSortable({
    id: task.id,
    index,
    type: TASK_TYPE,
    accept: TASK_TYPE,
    group: columnId
  })

  const [showFullTask, setShowFullTask] = useState(false)

  const { deleteTask } = useKanban()

  const createdThisYear = dayjs(task.createdAt).year() === dayjs().year()

  return (
    <Box ref={ref}>
      <ContextMenu
        options={[
          {
            label: 'Delete',
            danger: true,
            icon: 'delete',
            onClick: () => deleteTask(task.id)
          }
        ]}
        render={({ open }) => (
          <Card
            elevation={isDragging ? 6 : 1}
            onClick={() => setShowFullTask(true)}
            onContextMenu={open}
            sx={{
              position: 'relative',
              flexShrink: 0,
              cursor: 'pointer',
              '&:hover': {
                boxShadow: isDragging ? 6 : 3
              }
            }}
          >
            <CardHeader
              title={
                <Stack direction={'row'} spacing={1} sx={{ alignItems: 'center' }}>
                  {task.title}{' '}
                  {task.mover && task.mover.sourceColumn === task.column && (
                    <Tooltip
                      title={
                        <>
                          This task will move to{' '}
                          <ColumnLabel column={task.mover.destinationColumn} /> in{' '}
                          {dayjs
                            .duration(getNextMovementDate(task.mover, task.lastMoved).diff())
                            .humanize()}
                        </>
                      }
                      placement="top"
                    >
                      <Micon icon="schedule" color="action" sx={{ fontSize: 20 }} />
                    </Tooltip>
                  )}
                </Stack>
              }
              sx={{ pb: task.description ? 1 : undefined }}
            />
            {task.description && (
              <CardContent
                sx={{
                  pt: 0
                }}
              >
                <FadeOutText
                  active={(task.description.length ?? 0) > 164}
                  sx={{ whiteSpace: 'pre-wrap', maxHeight: 90, overflow: 'hidden' }}
                >
                  {task.description}
                </FadeOutText>
              </CardContent>
            )}
            {task.tags.length > 0 && (
              <CardContent
                sx={{
                  pt: 0
                }}
              >
                <Stack direction={'row'} spacing={1}>
                  {task.tags.map((t) => (
                    <TagChip key={t} tag={t} size="small" />
                  ))}
                </Stack>
              </CardContent>
            )}
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ position: 'absolute', bottom: 0, right: 2 }}
            >
              Created {dayjs(task.createdAt).format(createdThisYear ? 'MMM D' : 'll')}
            </Typography>
          </Card>
        )}
      ></ContextMenu>
      <Dialog open={showFullTask} onClose={() => setShowFullTask(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <TaskDetails task={task} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
