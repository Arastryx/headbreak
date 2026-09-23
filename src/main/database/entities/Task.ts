import { defineEntity, p } from '@mikro-orm/core'
import { ColumnSchema } from './Column'
import { AuditableSchema } from './Auditable'
import { ChangeLogSchema } from './ChangeLog'
import { CommentSchema } from './Comment'

export const TaskSchema = defineEntity({
  name: 'Task',
  extends: AuditableSchema,
  properties: {
    id: p.uuid().primary(),
    title: p.string().length(127),
    description: p.text().nullable(),
    order: p.integer(),
    lastMoved: p.date(),
    column: () => p.manyToOne(ColumnSchema).deleteRule('cascade'),
    changes: () => p.oneToMany(ChangeLogSchema).mappedBy('task'),
    comments: () => p.oneToMany(CommentSchema).mappedBy('task')
  }
})

export class Task extends TaskSchema.class {}
TaskSchema.setClass(Task)
