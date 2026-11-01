import { ipcMain } from 'electron'
import { handleError } from '../handleError'
import { KanbanManager } from '../KanbanManager'
import { AttachmentManager } from '../AttachmentManager'

export function setupAttachmentApi() {
  ipcMain.handle(
    'attachment/createLink',
    (e, ...params: Parameters<typeof AttachmentManager.createLink>) =>
      handleError(() => AttachmentManager.createLink(...params))
  )

  ipcMain.handle(
    'attachment/getForTask',
    (e, ...params: Parameters<typeof AttachmentManager.getForTask>) =>
      handleError(() => AttachmentManager.getForTask(...params))
  )

  ipcMain.handle('attachment/edit', (e, ...params: Parameters<typeof AttachmentManager.edit>) =>
    handleError(() => AttachmentManager.edit(...params))
  )

  ipcMain.handle(
    'attachment/delete',
    (e, ...params: Parameters<typeof AttachmentManager.deleteAttachment>) =>
      handleError(() => AttachmentManager.deleteAttachment(...params))
  )
}
