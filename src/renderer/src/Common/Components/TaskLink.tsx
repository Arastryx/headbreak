import { Chip } from '@mui/material'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import { useMemo } from 'react'
import { Link } from 'react-router'

export interface TaskLinkProps {
  number: number
}

export function TaskLink({ number }: TaskLinkProps) {
  const { findTaskByNumber } = useKanban()

  const task = useMemo(() => findTaskByNumber(number), [findTaskByNumber, number])

  if (!task) {
    return `@${number}`
  }

  return (
    <Chip
      component={Link}
      to={`/${number}`}
      label={`#${number}`}
      variant="filled"
      size="small"
      clickable
      sx={{ height: 18, verticalAlign: 'text-bottom' }}
    />
  )
}
