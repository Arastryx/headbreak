import { wrap } from '@mikro-orm/core'
import { Fork, unitOfWork } from './database/database'
import { Column, ColumnSchema } from './database/entities/Column'
import { Task, TaskSchema } from './database/entities/Task'

interface TaskPayload {
  id: string
  title: string
  description?: string
}

interface ColumnPayload {
  id: string
  label?: string
  tasks: TaskPayload[]
}

export namespace KanbanManager {
  export async function sync(payload: ColumnPayload[]) {
    const unit = unitOfWork()

    await Promise.all(payload.map((c) => createUpdateColumn(c, unit)))
    await unit.flush()
  }

  async function createUpdateColumn(payload: ColumnPayload, unit: Fork) {
    let column = await unit.findOne(ColumnSchema, payload.id)

    if (!column) {
      column = new Column()
      column.id = payload.id
      unit.persist(column)
    }

    column.label = payload.label

    await Promise.all(payload.tasks.map((t) => createUpdateTask(t, column, unit)))
  }

  async function createUpdateTask(payload: TaskPayload, column: Column, unit: Fork) {
    let task = await unit.findOne(TaskSchema, payload.id)

    if (!task) {
      task = new Task()
      task.id = payload.id
      unit.persist(task)
    }

    task.title = payload.title
    task.description = payload.description
    task.column = column
  }

  export async function get() {
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
