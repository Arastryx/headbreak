import { ipcMain } from 'electron'
import { KanbanManager } from './KanbanManager'
import { handleError } from './handleError'

export function setupKanbanApi() {
  ipcMain.handle(
    'kanban/create-task',
    (e, ...params: Parameters<typeof KanbanManager.createTask>) =>
      handleError(() => KanbanManager.createTask(...params))
  )
  ipcMain.handle(
    'kanban/create-column',
    (e, ...params: Parameters<typeof KanbanManager.createColumn>) =>
      handleError(() => KanbanManager.createColumn(...params))
  )
  ipcMain.handle('kanban/get', (e, ...params: Parameters<typeof KanbanManager.getKanban>) =>
    handleError(() => KanbanManager.getKanban())
  )
}
