import { defineEntity, p } from '@mikro-orm/core'
import { TaskSchema } from './Task'
import { AuditableSchema } from './Auditable'
import { ColumnSchema } from './Column'

export const TaskMoverSchema = defineEntity({
  name: 'TaskMover',
  extends: AuditableSchema,
  properties: {
    id: p.uuid().primary(),
    policy: p.string().length(8),
    policyType: p.enum(['cron', 'interval']),
    sourceColumn: () => p.manyToOne(ColumnSchema),
    destinationColumn: () => p.manyToOne(ColumnSchema),
    task: () => p.oneToOne(TaskSchema).owner()
  }
})

export class TaskMover extends TaskMoverSchema.class {}
TaskMoverSchema.setClass(TaskMover)
