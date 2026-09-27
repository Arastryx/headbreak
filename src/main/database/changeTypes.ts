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
  automatic?: boolean
}

export interface TaskEdit {
  type: 'taskEdit'
  prev: LogTask
  next: LogTask
}

export interface RecurringChange {
  type: 'recurringChange'
  change: 'add' | 'edit' | 'delete'
}

export type Change = ColumnMove | TaskEdit | RecurringChange
