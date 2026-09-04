import { defineEntity, InferEntity, p } from '@mikro-orm/core'
import { ColumnSchema, IColumn } from './Column'

export const TaskSchema = defineEntity({
  name: 'Task',
  properties: {
    id: p.integer().primary(),
    title: p.string().length(255),
    description: p.text().nullable(),
    column: () => p.manyToOne(ColumnSchema)
  }
})

export class Task extends TaskSchema.class {}
TaskSchema.setClass(Task)
