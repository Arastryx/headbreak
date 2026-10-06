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
import { MovementWarning } from './MovementWarning'

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
                <Stack direction={'row'} spacing={0.5} sx={{ alignItems: 'center' }}>
                  {task.title} <MovementWarning task={task} />
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
