import { ElectronAPI } from '@electron-toolkit/preload'
import { MaterialIcon } from 'material-icons'

type Result<Payload> = Promise<Payload | Headbreak.Error>

declare global {
  namespace Headbreak {
    interface Auditable {
      createdAt: string
      updatedAt: string
    }

    interface Syncable extends Auditable {
      id: string

      //This field is never present when fetching syncables, but allowing it to be set on the frontend
      // makes managing the types WAY easier when submitting syncs
      markForDeletion?: boolean
    }

    interface Task extends Syncable {
      title: string
      description?: string
      column: string
      lastMoved: string
      comments: Comment[]
      mover?: TaskMover
      tags: string[]
    }

    interface Column extends Syncable {
      label?: string
      icon?: MaterialIcon
      color?: string
      hideDelay?: number
      tasks: Task[]
    }

    interface ChangeLog extends Auditable {
      id: number
      content: Change
    }

    interface Comment extends Syncable {
      content: string
      task: string
    }

    type PolicyType = 'cron' | 'interval'

    interface TaskMover extends Syncable {
      policy: string
      policyType: PolicyType
      sourceColumn: string
      destinationColumn: string
      task: string
    }

    interface Tag extends Syncable {
      label?: string
      icon?: MaterialIcon
      color?: string
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

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    //Payloads
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    namespace Payload {
      interface Syncable {
        id: string
        markForDeletion?: boolean
      }

      export interface TaskMover extends Syncable {
        policy: string
        policyType: PolicyType
        sourceColumn: string
        destinationColumn: string
      }

      export interface Comment extends Syncable {
        content: string
      }

      export interface Task extends Syncable {
        title: string
        description?: string
        lastMoved?: string
        comments: Comment[]
        mover?: TaskMover
        tags?: string[]
      }

      export interface ColumnPayload extends Syncable {
        label?: string
        icon?: string
        color?: string
        hideDelay?: number
        tasks: Task[]
      }

      export interface Tag extends Syncable {
        label?: string
        icon?: string
        color?: string
      }
    }

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    //Results
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    export interface Kanban {
      columns: Column[]
      tags: Tag[]
    }

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
    //Misc
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
      sync: (columns: Headbreak.Payload.Column[], tags: Headbreak.Payload.Tag[]) => Result<void>
      get: () => Result<Headbreak.Kanban>
      getChanges: (taskId: string) => Result<Headbreak.ChangeLog[]>
    }
  }
}
