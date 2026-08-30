import { ipcMain } from 'electron'
import { TaskManager } from './taskManager'
import { handleError } from './handleError'

export function setupTaskApi() {
  ipcMain.handle('task/create', (e, ...params: Parameters<typeof TaskManager.create>) =>
    handleError(() => TaskManager.create(...params))
  )
  ipcMain.handle('task/get', (e, ...params: Parameters<typeof TaskManager.create>) =>
    handleError(() => TaskManager.get())
  )
}
