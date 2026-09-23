import { ElectronAPI } from '@electron-toolkit/preload'
import { MaterialIcon } from 'material-icons'

type Result<Payload> = Promise<Payload | Headbreak.Error>

declare global {
  namespace Headbreak {
    interface Auditable {
      createdAt: Date
      updatedAt: Date
    }

    interface Syncable extends Auditable {
      id: string
      markForDeletion?: boolean
    }

    interface Task extends Syncable {
      title: string
      description?: string
      column: string
      comments: Comment[]
    }

    interface Column extends Syncable {
      label?: string
      icon?: MaterialIcon
      color?: string
      tasks: Task[]
    }

    interface ChangeLog extends Auditable {
      id: number
      content: Change
    }

    interface Comment extends Syncable {
      content: string
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
