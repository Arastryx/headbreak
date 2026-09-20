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
