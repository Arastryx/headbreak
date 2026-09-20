import { ipcMain } from 'electron'
import { KanbanManager } from './KanbanManager'
import { handleError } from './handleError'
import { ChangeLogManager } from './ChangeLogManager'

export function setupKanbanApi() {
  ipcMain.handle('kanban/sync', (e, ...params: Parameters<typeof KanbanManager.sync>) =>
    handleError(() => KanbanManager.sync(...params))
  )
  ipcMain.handle('kanban/get', (e, ...params: Parameters<typeof KanbanManager.get>) =>
    handleError(() => KanbanManager.get())
  )
  ipcMain.handle(
    'kanban/get-changes',
    (e, ...params: Parameters<typeof ChangeLogManager.getChanges>) =>
      handleError(() => ChangeLogManager.getChanges(...params))
  )
}
