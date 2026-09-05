import { ElectronAPI } from '@electron-toolkit/preload'

type Result<Payload> = Promise<Payload | Headbreak.Error>

declare global {
  namespace Headbreak {
    interface Task {
      id: number
      title: string
      description?: string
      column: number
    }

    interface Column {
      id: number
      label?: string
      tasks: Task[]
    }

    interface CreateTaskParams extends Omit<Task, 'id'> {}

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
      createTask: (task: Headbreak.CreateTaskParams) => Result<Headbreak.Task>
      createColumn: () => Result<Headbreak.Column>
      get: () => Result<Headbreak.Column[]>
    }
  }
}
