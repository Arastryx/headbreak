import { ElectronAPI } from '@electron-toolkit/preload'

type Result<Payload> = Promise<Payload | Headbreak.Error>

declare global {
  namespace Headbreak {
    interface Task {
      id: number
      columnId: number
      order: number
      title: string
      description?: string
    }

    interface CreateTaskParams extends Omit<Task, 'id' | 'order'> {}

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
      getTasks: () => Result<Headbreak.TaskSet>
    }
  }
}
