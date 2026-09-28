import { defineEntity, p } from '@mikro-orm/core'
import { TaskSchema } from './Task'
import { AuditableSchema } from './Auditable'

export const TagSchema = defineEntity({
  name: 'Tag',
  extends: AuditableSchema,
  properties: {
    id: p.uuid().primary(),
    label: p.string().length(32).nullable(),
    icon: p.string().length(64).nullable(),
    color: p.string().length(16).nullable(),
    tasks: () => p.manyToMany(TaskSchema).mappedBy('tags')
  }
})

export class Tag extends TagSchema.class {}
TagSchema.setClass(Tag)
