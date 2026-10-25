import { defineEntity, p } from '@mikro-orm/core'
import { AuditableSchema } from './Auditable'
import { TaskSchema } from './Task'
import { CommentSchema } from './Comment'

export const AttachmentSchema = defineEntity({
  name: 'Attachment',
  extends: AuditableSchema,
  properties: {
    id: p.integer().primary(),
    type: p.enum(['link', 'localFile', 'pastedImage']),
    title: p.string().length(255).nullable(),
    link: p.string().length(1023),
    task: () => p.manyToOne(TaskSchema).nullable().deleteRule('cascade'),
    comment: () => p.manyToOne(CommentSchema).nullable().deleteRule('cascade')
  }
})

export class Attachment extends AttachmentSchema.class {}
AttachmentSchema.setClass(Attachment)
