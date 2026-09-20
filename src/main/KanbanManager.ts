import { Fork, unitOfWork } from './database/database'
import { Column, ColumnSchema } from './database/entities/Column'
import { Task, TaskSchema } from './database/entities/Task'
import { ChangeLogManager } from './ChangeLogManager'
import { normalizeEntities } from './normalize'

export interface TaskPayload {
  id: string
  title: string
  description?: string
  markForDeletion?: boolean
}

export interface ColumnPayload {
  id: string
  label?: string
  icon?: string
  color?: string
  markForDeletion?: boolean
  tasks: TaskPayload[]
}

export namespace KanbanManager {
  export async function sync(payload: ColumnPayload[]) {
    const unit = unitOfWork()

    await Promise.all(payload.map((c, index) => createUpdateColumn(c, index, unit)))
    await unit.flush()
  }

  async function createUpdateColumn(payload: ColumnPayload, index: number, unit: Fork) {
    let column = await unit.findOne(ColumnSchema, payload.id)

    if (!column) {
      column = new Column()
      column.id = payload.id
      unit.persist(column)
    }

    if (payload.markForDeletion) {
      unit.remove(column)
      return
    }

    column.label = payload.label
    column.icon = payload.icon
    column.color = payload.color
    column.order = index

    await Promise.all(
      payload.tasks.map((t, index) => createUpdateDeleteTask(t, index, column, unit))
    )
  }

  async function createUpdateDeleteTask(
    payload: TaskPayload,
    index: number,
    column: Column,
    unit: Fork
  ) {
    let task = await unit.findOne(TaskSchema, payload.id, { populate: ['column'] })

    if (!task) {
      task = new Task()
      task.id = payload.id
      unit.persist(task)
    } else {
      if (payload.markForDeletion) {
        unit.remove(task)
        return
      }

      if (task.column != null && column.id != task.column.id) {
        ChangeLogManager.recordColumnMove(task, column)
      }

      if (task.title != payload.title || task.description != payload.description) {
        ChangeLogManager.recordTaskEdit(task, payload)
      }
    }

    task.title = payload.title
    task.description = payload.description
    task.column = column
    task.order = index
  }

  export async function get() {
    const unit = unitOfWork()

    const result = await unit.findAll(ColumnSchema, {
      populate: ['tasks'],
      populateOrderBy: { tasks: { order: 'ASC' } },
      orderBy: { order: 'ASC' }
    })

    return normalizeEntities(result)
  }
}
