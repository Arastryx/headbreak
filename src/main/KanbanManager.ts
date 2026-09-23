import { Fork, unitOfWork } from './database/database'
import { Column, ColumnSchema } from './database/entities/Column'
import { Task, TaskSchema } from './database/entities/Task'
import { ChangeLogManager } from './ChangeLogManager'
import { normalizeEntities } from './normalize'
import { CommentSchema, TaskComment } from './database/entities/Comment'

interface Syncable {
  id: string
  markForDeletion?: boolean
}

export interface CommentPayload extends Syncable {
  content: string
}

export interface TaskPayload extends Syncable {
  title: string
  description?: string
  comments: CommentPayload[]
}

export interface ColumnPayload extends Syncable {
  label?: string
  icon?: string
  color?: string
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
    } else if (payload.markForDeletion) {
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

    await Promise.all(payload.comments.map((c) => createUpdateDeleteComment(c, task, unit)))
  }

  async function createUpdateDeleteComment(payload: CommentPayload, task: Task, unit: Fork) {
    let comment = await unit.findOne(CommentSchema, payload.id)

    if (!comment) {
      comment = new TaskComment()
      comment.id = payload.id

      //You can't move a comment to another task, so we might as well set this on
      // creation only
      comment.task = task

      unit.persist(comment)
    } else if (payload.markForDeletion) {
      unit.remove(comment)
    }

    comment.content = payload.content
  }

  export async function get() {
    const unit = unitOfWork()

    const result = await unit.findAll(ColumnSchema, {
      populate: ['tasks.comments'],
      populateOrderBy: { tasks: { order: 'ASC' } },
      orderBy: { order: 'ASC' }
    })

    return normalizeEntities(result)
  }
}
