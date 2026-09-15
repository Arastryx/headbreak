import { defineEntity, p } from '@mikro-orm/core'
import { TaskSchema } from './Task'

export const ColumnSchema = defineEntity({
  name: 'Column',
  properties: {
    id: p.uuid().primary(),
    label: p.string().length(255).nullable(),
    tasks: () => p.oneToMany(TaskSchema).mappedBy('column')
  }
})

export class Column extends ColumnSchema.class {}
ColumnSchema.setClass(Column)
