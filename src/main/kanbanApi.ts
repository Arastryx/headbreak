import { ipcMain } from 'electron'
import { KanbanManager } from './KanbanManager'
import { handleError } from './handleError'

export function setupKanbanApi() {
  ipcMain.handle(
    'kanban/create-task',
    (e, ...params: Parameters<typeof KanbanManager.createTask>) =>
      handleError(() => KanbanManager.createTask(...params))
  )
  ipcMain.handle('kanban/get-tasks', (e, ...params: Parameters<typeof KanbanManager.createTask>) =>
    handleError(() => KanbanManager.getTasks())
  )
}
