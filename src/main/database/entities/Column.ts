import { defineEntity, InferEntity, p } from '@mikro-orm/core'

export const ColumnSchema = defineEntity({
  name: 'Column',
  properties: {
    id: p.integer().primary(),
    label: p.string().length(255)
  }
})

export type IColumn = InferEntity<typeof ColumnSchema>
