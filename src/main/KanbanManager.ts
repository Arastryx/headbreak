import { Fork, unitOfWork } from './database/database'
import { Column, ColumnSchema } from './database/entities/Column'
import { Task, TaskSchema } from './database/entities/Task'
import { ChangeLogManager } from './ChangeLogManager'
import { normalizeEntities } from './normalize'
import { CommentSchema, TaskComment } from './database/entities/Comment'
import { TaskMover, TaskMoverSchema } from './database/entities/TaskMover'
import { rel, wrap } from '@mikro-orm/core'
import dayjs from 'dayjs'
import { Tag, TagSchema } from './database/entities/Tag'

interface Syncable {
  id: string
  markForDeletion?: boolean
}

export interface TaskMoverPayload extends Syncable {
  policy: string
  policyType: 'cron' | 'interval'
  sourceColumn: string
  destinationColumn: string
}

export interface CommentPayload extends Syncable {
  content: string
}

export interface TaskPayload extends Syncable {
  title: string
  description?: string
  lastMoved: string
  comments: CommentPayload[]
  mover?: TaskMoverPayload
}

export interface ColumnPayload extends Syncable {
  label?: string
  icon?: string
  color?: string
  hideDelay?: number
  tasks: TaskPayload[]
}

export interface TagPayload extends Syncable {
  label?: string
  icon?: string
  color?: string
}

export namespace KanbanManager {
  export async function sync(columns: ColumnPayload[], tags: TagPayload[]) {
    const unit = unitOfWork()

    await Promise.all([
      ...columns.map((c, index) => createUpdateColumn(c, index, unit)),
      ...tags.map((t) => createUpdateDeleteTag(t, unit))
    ])
    await unit.flush()
  }

  async function createUpdateColumn(payload: ColumnPayload, index: number, unit: Fork) {
    let column = await unit.findOne(ColumnSchema, payload.id)

    if (!column) {
      if (payload.markForDeletion) {
        return
      }

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
    column.hideDelay = payload.hideDelay
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

    let taskIsNew = false

    if (!task) {
      if (payload.markForDeletion) {
        return
      }

      task = new Task()
      task.id = payload.id
      task.lastMoved = dayjs().toISOString()
      unit.persist(task)
      taskIsNew = true
    } else {
      if (payload.markForDeletion) {
        unit.remove(task)
        return
      }

      if (task.column != null && column.id != task.column.id) {
        ChangeLogManager.recordColumnMove(task, column)
        task.lastMoved = dayjs().toISOString()
      }

      if (task.title != payload.title || task.description != payload.description) {
        ChangeLogManager.recordTaskEdit(task, payload)
      }
    }

    task.title = payload.title
    task.description = payload.description
    task.column = column
    task.order = index

    await Promise.all([
      ...payload.comments.map((c) => createUpdateDeleteComment(c, task, unit)),
      ...(payload.mover ? [createUpdateDeleteTaskMover(payload.mover, task, unit, taskIsNew)] : [])
    ])
  }

  async function createUpdateDeleteComment(payload: CommentPayload, task: Task, unit: Fork) {
    let comment = await unit.findOne(CommentSchema, payload.id)

    if (!comment) {
      if (payload.markForDeletion) {
        return
      }
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

  async function createUpdateDeleteTaskMover(
    payload: TaskMoverPayload,
    task: Task,
    unit: Fork,
    skipLogging: boolean = false
  ) {
    let mover = await unit.findOne(TaskMoverSchema, payload.id, {
      populate: ['sourceColumn', 'destinationColumn']
    })

    let created = false

    if (!mover) {
      mover = new TaskMover()
      mover.id = payload.id

      //You can't move a mover to another task, so we might as well set this on
      // creation only
      mover.task = task

      unit.persist(mover)
      created = true

      if (!skipLogging) {
        ChangeLogManager.recordRecurringChange(task, 'add')
      }
    } else if (payload.markForDeletion) {
      unit.remove(mover)

      if (!skipLogging) {
        ChangeLogManager.recordRecurringChange(task, 'delete')
      }

      return
    }

    let isDifferent =
      mover.policy != payload.policy ||
      mover.policyType != payload.policyType ||
      mover.sourceColumn.id != payload.sourceColumn ||
      mover.destinationColumn.id != payload.destinationColumn

    mover.policy = payload.policy
    mover.policyType = payload.policyType
    mover.sourceColumn = rel(Column, payload.sourceColumn)
    mover.destinationColumn = rel(Column, payload.destinationColumn)

    if (!skipLogging && !created && isDifferent) {
      ChangeLogManager.recordRecurringChange(task, 'edit')
    }
  }

  async function createUpdateDeleteTag(payload: TagPayload, unit: Fork) {
    let tag = await unit.findOne(TagSchema, payload.id)

    if (!tag) {
      if (payload.markForDeletion) {
        return
      }

      tag = new Tag()
      tag.id = payload.id
      unit.persist(tag)
    } else if (payload.markForDeletion) {
      unit.remove(tag)
      return
    }

    tag.label = payload.label
    tag.icon = payload.icon
    tag.color = payload.color
  }

  export async function get() {
    const unit = unitOfWork()

    const [columns, tags] = await Promise.all([
      unit.findAll(ColumnSchema, {
        populate: ['tasks.comments', 'tasks.mover'],
        populateOrderBy: { tasks: { order: 'ASC' } },
        orderBy: { order: 'ASC' }
      }),
      unit.findAll(TagSchema)
    ])

    return { columns: normalizeEntities(columns), tags: normalizeEntities(tags) }
  }
}
