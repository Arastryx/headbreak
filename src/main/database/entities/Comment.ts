import { defineEntity, p } from '@mikro-orm/core'
import { TaskSchema } from './Task'
import { AuditableSchema } from './Auditable'

export const CommentSchema = defineEntity({
  name: 'Comment',
  extends: AuditableSchema,
  properties: {
    id: p.uuid().primary(),
    content: p.text(),
    task: () => p.manyToOne(TaskSchema).deleteRule('cascade')
  }
})

export class TaskComment extends CommentSchema.class {}
CommentSchema.setClass(TaskComment)
