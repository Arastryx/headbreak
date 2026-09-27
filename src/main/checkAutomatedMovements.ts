import dayjs from 'dayjs'
import { unitOfWork } from './database/database'
import { TaskSchema } from './database/entities/Task'
import { parseCronExpression } from 'cron-schedule'

export async function checkAutomatedMovements() {
  const unit = unitOfWork()
  const automatedTasks = await unit.findAll(TaskSchema, {
    populate: ['mover.sourceColumn', 'mover.destinationColumn', 'column'],
    where: { mover: { $ne: undefined } }
  })

  automatedTasks.forEach((task) => {
    if (task.column.id !== task.mover.sourceColumn.id) {
      return
    }

    let shouldMove = false

    if (task.mover.policyType === 'interval') {
      const numberOfDays = Number(task.mover.policy)
      const daysInColumn = dayjs().diff(dayjs(task.lastMoved).startOf('day'), 'days')

      if (daysInColumn >= numberOfDays) {
        shouldMove = true
      }
    } else {
      const cron = parseCronExpression(task.mover.policy)
      const nextDate = cron.getNextDate(new Date(Date.parse(task.lastMoved)))

      if (dayjs(nextDate).isBefore()) {
        shouldMove = true
      }
    }

    if (shouldMove) {
      task.column = task.mover.destinationColumn
      task.lastMoved = dayjs().toISOString()
    }
  })

  await unit.flush()
}
