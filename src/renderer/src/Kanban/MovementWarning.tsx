import { Box, Tooltip, Typography } from '@mui/material'
import { ColumnLabel } from '@renderer/Common/Components/ColumnLabel'
import { Micon } from '@renderer/Common/Components/Micon'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'
import { parseCronExpression } from 'cron-schedule'
import { getIntervalType } from './IntervalSelector/intervalTypes'

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

function getSoonThreshold(mover: Headbreak.TaskMover) {
  const type = getIntervalType(mover.policy)

  switch (type) {
    case 'interval':
      return Math.max(Number(mover.policy) / 10, 0.25)
    case 'dayOfWeek':
      return 1
    case 'dayOfMonth':
      return 3
    case 'dayOfYear':
      return 14
  }

  return 0
}

export interface MovementWarningProps {
  task: Headbreak.Task
}

export function MovementWarning({ task }: MovementWarningProps) {
  if (!task.mover || task.mover.sourceColumn !== task.column) {
    return null
  }

  const numberOfDaysUntilChange = getNextMovementDate(task.mover, task.lastMoved).diff(
    dayjs(),
    'days',
    true
  )
  const soonThresholdInDays = getSoonThreshold(task.mover)

  return (
    <Tooltip
      title={
        <>
          This task will move to <ColumnLabel column={task.mover.destinationColumn} />{' '}
          <TimeUntilMove task={task} />
        </>
      }
      placement="top"
    >
      <Box>
        {soonThresholdInDays >= numberOfDaysUntilChange && (
          <Micon icon="alarm" color="warning" sx={{ fontSize: 16 }} />
        )}
        {soonThresholdInDays < numberOfDaysUntilChange && (
          <Micon icon="schedule" color="action" sx={{ fontSize: 14 }} />
        )}
      </Box>
    </Tooltip>
  )
}

export function TimeUntilMove({ task }: MovementWarningProps) {
  if (!task.mover || task.mover.sourceColumn !== task.column) {
    return null
  }

  const numberOfDaysUntilChange = getNextMovementDate(task.mover, task.lastMoved).diff(
    dayjs(),
    'days',
    true
  )
  const soonThresholdInDays = getSoonThreshold(task.mover)

  return (
    <Typography
      component={'span'}
      variant="inherit"
      color={soonThresholdInDays >= numberOfDaysUntilChange ? 'warning' : undefined}
    >
      {dayjs.duration(numberOfDaysUntilChange, 'days').humanize(true)}
    </Typography>
  )
}
