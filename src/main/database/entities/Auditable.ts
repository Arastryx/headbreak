import { defineEntity, p } from '@mikro-orm/core'

export const AuditableSchema = defineEntity({
  name: 'Auditable',
  abstract: true,
  properties: {
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date())
  }
})

export abstract class Auditable extends AuditableSchema.class {}
AuditableSchema.setClass(Auditable)
