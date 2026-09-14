import { ElectronAPI } from '@electron-toolkit/preload'

type Result<Payload> = Promise<Payload | Headbreak.Error>

declare global {
  namespace Headbreak {
    interface Task {
      id: string
      title: string
      description?: string
      column: number
    }

    interface Column {
      id: number
      label?: string
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
      createTask: (task: Headbreak.Task) => Result<Headbreak.Task>
      createColumn: (id: string) => Result<Headbreak.Column>
      get: () => Result<Headbreak.Column[]>
    }
  }
}
