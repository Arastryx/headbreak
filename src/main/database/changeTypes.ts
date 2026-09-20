export interface LogColumn {
  label?: string | null
  color?: string | null
  icon?: string | null
}

export interface LogTask {
  title: string | null
  description?: string | null
}

export interface ColumnMove {
  type: 'columnMove'
  from: LogColumn
  to: LogColumn
}

export interface TaskEdit {
  type: 'taskEdit'
  prev: LogTask
  next: LogTask
}

export type Change = ColumnMove | TaskEdit
