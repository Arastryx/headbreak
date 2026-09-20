import { defineEntity, p } from '@mikro-orm/core'
import { AuditableSchema } from './Auditable'
import { TaskSchema } from './Task'
import { Change } from '../changeTypes'

export const ChangeLogSchema = defineEntity({
  name: 'ChangeLog',
  extends: AuditableSchema,
  properties: {
    id: p.integer().primary(),
    content: p.json<Change>(),
    task: () => p.manyToOne(TaskSchema).deleteRule('cascade')
  }
})

export class ChangeLog extends ChangeLogSchema.class {}
ChangeLogSchema.setClass(ChangeLog)
