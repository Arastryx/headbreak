import { ColumnMove, LogColumn, LogTask, TaskEdit } from './database/changeTypes'
import { unitOfWork } from './database/database'
import { ChangeLog, ChangeLogSchema } from './database/entities/ChangeLog'
import { Column } from './database/entities/Column'
import { Task } from './database/entities/Task'
import { TaskPayload } from './KanbanManager'
import { normalizeEntities } from './normalize'

export namespace ChangeLogManager {
  export function recordColumnMove(task: Task, column: Column) {
    const change: ColumnMove = {
      type: 'columnMove',
      from: mapToLogColumn(task.column),
      to: mapToLogColumn(column)
    }

    const log = new ChangeLog()

    log.content = change
    task.changes.add(log)
  }

  export function recordTaskEdit(task: Task, payload: TaskPayload) {
    const change: TaskEdit = {
      type: 'taskEdit',
      prev: mapToLogTask(task),
      next: {
        title: payload.title,
        description: payload.description
      }
    }

    const log = new ChangeLog()

    log.content = change
    task.changes.add(log)
  }

  function mapToLogColumn(column: Column): LogColumn {
    return {
      label: column.label,
      color: column.color,
      icon: column.icon
    }
  }

  function mapToLogTask(task: Task): LogTask {
    return {
      title: task.title,
      description: task.description
    }
  }

  export async function getChanges(taskId: string) {
    const unit = unitOfWork()

    const changes = await unit.findAll(ChangeLogSchema, {
      orderBy: { createdAt: 'asc' },
      where: { task: { id: taskId } },
      limit: 100
    })

    return normalizeEntities(changes)
  }
}
