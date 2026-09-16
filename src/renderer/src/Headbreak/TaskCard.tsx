import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  darken
} from '@mui/material'
import { useSortable } from '@dnd-kit/react/sortable'
import { FadeOutText } from './Common/FadeOutText'
import { useState } from 'react'

export interface TaskCardProps {
  task: Headbreak.Task
  index: number
  column: string
}

export function TaskCard({ task, index, column }: TaskCardProps) {
  const { ref, isDragging } = useSortable({
    id: task.id,
    index,
    type: 'item',
    accept: 'item',
    group: column
  })

  const [showFullTask, setShowFullTask] = useState(false)

  return (
    <>
      <Card
        elevation={1}
        ref={ref}
        onClick={() => setShowFullTask(true)}
        sx={(theme) => ({
          flexShrink: 0,
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 3
          }
        })}
      >
        <CardHeader title={task.title} sx={{ pb: 1 }} />
        {task.description && (
          <CardContent
            sx={{
              pt: 0,
              '&:last-child': { pb: 2 }
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
      </Card>
      <Dialog open={showFullTask} onClose={() => setShowFullTask(false)}>
        <DialogTitle>{task.title}</DialogTitle>
        <DialogContent>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{task.description}</Typography>
        </DialogContent>
      </Dialog>
    </>
  )
}
