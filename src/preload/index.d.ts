import { ElectronAPI } from '@electron-toolkit/preload'
import { MaterialIcon } from 'material-icons'

type Result<Payload> = Promise<Payload | Headbreak.Error>

declare global {
  namespace Headbreak {
    interface Task {
      id: string
      title: string
      description?: string
      markForDeletion?: boolean
      column: string
    }

    interface Column {
      id: string
      label?: string
      icon?: MaterialIcon
      color?: string
      markForDeletion?: boolean
      tasks: Task[]
    }

    interface CreateTaskParams extends Task {}

    type TaskSet = Record<number, Task[]>

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
    }
  }
}
