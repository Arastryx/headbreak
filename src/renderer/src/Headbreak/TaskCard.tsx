import { Card, CardHeader, CardContent, Typography } from '@mui/material'
import { useSortable } from '@dnd-kit/react/sortable'

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

  return (
    <Card elevation={1} sx={{ flexShrink: 0 }} ref={ref}>
      <CardHeader title={task.title} sx={{ pb: 1 }} />
      {task.description && (
        <CardContent sx={{ pt: 0, '&:last-child': { pb: 2 } }}>
          <Typography sx={{ whiteSpace: 'pre' }}>{task.description}</Typography>
        </CardContent>
      )}
    </Card>
  )
}
