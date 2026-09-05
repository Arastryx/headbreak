import { wrap } from '@mikro-orm/core'
import { unitOfWork } from './database/database'
import { ColumnSchema } from './database/entities/Column'
import { TaskSchema } from './database/entities/Task'

interface TaskPayload {
  title: string
  description?: string
  column: number
}

export namespace KanbanManager {
  export async function createTask(payload: TaskPayload) {
    const unit = unitOfWork()

    const task = unit.create(TaskSchema, {
      title: payload.title,
      description: payload.description,
      column: payload.column
    })

    await unit.flush()
    return normalize(task)
  }

  export async function createColumn() {
    const unit = unitOfWork()

    const column = unit.create(ColumnSchema, {})

    await unit.flush()
    return normalize(column)
  }

  export async function getKanban() {
    const unit = unitOfWork()

    const result = await unit.findAll(ColumnSchema, { populate: ['tasks'] })
    return normalize(result)
  }

  function normalize<T extends object>(item: T | T[]) {
    if (Array.isArray(item)) {
      return item.map((i) => wrap(i).toObject())
    }

    return wrap(item).toObject()
  }
}
