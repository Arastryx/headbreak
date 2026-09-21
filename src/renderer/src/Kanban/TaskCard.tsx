import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Box
} from '@mui/material'
import { useSortable } from '@dnd-kit/react/sortable'
import { useState } from 'react'
import { useKanban } from '../KanbanProvider/KanbanProvider'
import dayjs from 'dayjs'
import { TaskDetails } from './TaskDetails'
import { ContextMenu } from '../Common/Components/ContextMenu'
import { FadeOutText } from '../Common/Components/FadeOutText'

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
            <CardHeader title={task.title} sx={{ pb: task.description ? 1 : undefined }} />
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
      <Dialog open={showFullTask} onClose={() => setShowFullTask(false)}>
        <DialogContent>
          <TaskDetails task={task} />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
