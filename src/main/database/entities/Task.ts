import { defineEntity, p } from '@mikro-orm/core'
import { ColumnSchema } from './Column'
import { AuditableSchema } from './Auditable'
import { ChangeLogSchema } from './ChangeLog'

export const TaskSchema = defineEntity({
  name: 'Task',
  extends: AuditableSchema,
  properties: {
    id: p.uuid().primary(),
    title: p.string().length(127),
    description: p.text().nullable(),
    order: p.integer(),
    column: () => p.manyToOne(ColumnSchema).deleteRule('cascade'),
    changes: () => p.oneToMany(ChangeLogSchema).mappedBy('task')
  }
})

export class Task extends TaskSchema.class {}
TaskSchema.setClass(Task)
