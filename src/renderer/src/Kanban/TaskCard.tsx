import { Card, CardHeader, CardContent, Typography, Box, Stack } from '@mui/material'
import { useSortable } from '@dnd-kit/react/sortable'
import { useKanban } from '../KanbanProvider/KanbanProvider'
import dayjs from 'dayjs'
import { ContextMenu } from '../Common/Components/ContextMenu'
import { FadeOutText } from '../Common/Components/FadeOutText'
import { TagChip } from '@renderer/Common/Components/TagChip'
import { MovementWarning } from './MovementWarning'
import { UnstyledLink } from '@renderer/Common/Components/UnstyledLink'
import { TaskNumber } from './TaskNumber'

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
          <UnstyledLink to={`/${task.number}`}>
            <Card
              elevation={isDragging ? 6 : 1}
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
                    <Typography variant="h5">
                      <TaskNumber number={task.number} /> {task.title}
                    </Typography>{' '}
                    <MovementWarning task={task} />
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
          </UnstyledLink>
        )}
      ></ContextMenu>
    </Box>
  )
}
