export interface HeadbreakTask {
  id: number
  columnId: number
  order: number
  title: string
  description?: string
}

export interface TaskPayload extends Omit<HeadbreakTask, 'id' | 'order'> {}

const tasks: Record<number, HeadbreakTask[]> = {}
let idCounter = 1

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export namespace KanbanManager {
  export async function createTask(task: TaskPayload) {
    await sleep(50 + 25 * Math.random())
    if (tasks[task.columnId] == null) {
      tasks[task.columnId] = []
    }

    tasks[task.columnId].push({ ...task, id: idCounter++, order: tasks[task.columnId].length + 1 })
  }

  export async function getTasks() {
    await sleep(75 + 50 * Math.random())
    return tasks
  }
}
