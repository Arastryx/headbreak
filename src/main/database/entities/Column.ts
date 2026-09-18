import { Cascade, defineEntity, p } from '@mikro-orm/core'
import { TaskSchema } from './Task'

export const ColumnSchema = defineEntity({
  name: 'Column',
  properties: {
    id: p.uuid().primary(),
    label: p.string().length(255).nullable(),
    icon: p.string().length(64).nullable(),
    color: p.string().length(16).nullable(),
    tasks: () => p.oneToMany(TaskSchema).mappedBy('column')
  }
})

export class Column extends ColumnSchema.class {}
ColumnSchema.setClass(Column)
