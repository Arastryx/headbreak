import { ElectronAPI } from '@electron-toolkit/preload'
import { MaterialIcon } from 'material-icons'

type Result<Payload> = Promise<Payload | Headbreak.Error>

declare global {
  namespace Headbreak {
    interface Auditable {
      createdAt: Date
      updatedAt: Date
    }

    interface Task extends Auditable {
      id: string
      title: string
      description?: string
      markForDeletion?: boolean
      column: string
    }

    interface Column extends Auditable {
      id: string
      label?: string
      icon?: MaterialIcon
      color?: string
      markForDeletion?: boolean
      tasks: Task[]
    }

    interface ChangeLog extends Auditable {
      id: number
      content: Change
    }

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    //Change Types
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    export interface LogColumn {
      label?: string | null
      color?: string | null
      icon?: MaterialIcon | null
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

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    //MISC
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    interface Error {
      message: string
      name?: string
      stack?: string
    }
  }

  interface Window {
    electron: ElectronAPI
    api: unknown

    kanbanApi: {
      sync: (kanban: Headbreak.Column[]) => Result<void>
      get: () => Result<Headbreak.Column[]>
      getChanges: (taskId: string) => Result<Headbreak.ChangeLog[]>
    }
  }
}
