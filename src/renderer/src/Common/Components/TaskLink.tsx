import { Chip } from '@mui/material'
import { useTaskSelection } from '@renderer/Kanban/TaskSelectionProvider'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import React, { useMemo } from 'react'

export interface TaskLinkProps {
  number: number
}

export function TaskLink({ number }: TaskLinkProps) {
  const { findTaskByNumber } = useKanban()
  const { setTask } = useTaskSelection()

  const task = useMemo(() => findTaskByNumber(number), [findTaskByNumber, number])

  if (!task) {
    return `@${number}`
  }

  return (
    <Chip
      label={`#${number}`}
      variant="filled"
      size="small"
      clickable
      onClick={() => setTask(task)}
      sx={{ height: 18, verticalAlign: 'text-bottom' }}
    />
  )
}
