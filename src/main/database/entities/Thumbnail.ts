import { defineEntity, p } from '@mikro-orm/core'
import { AuditableSchema } from './Auditable'
import { TaskSchema } from './Task'
import { Change } from '../changeTypes'
import { AttachmentSchema } from './Attachment'

export const ThumbnailSchema = defineEntity({
  name: 'Thumbnail',
  extends: AuditableSchema,
  properties: {
    id: p.integer().primary(),
    path: p.string(),
    width: p.integer(),
    height: p.integer(),
    attachment: () => p.oneToOne(AttachmentSchema).mappedBy('thumbnail')
  }
})

export class Thumbnail extends ThumbnailSchema.class {}
ThumbnailSchema.setClass(Thumbnail)
