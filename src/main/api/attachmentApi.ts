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
    'attachment/createFiles',
    (e, ...params: Parameters<typeof AttachmentManager.createFiles>) =>
      handleError(() => AttachmentManager.createFiles(...params))
  )

  ipcMain.handle(
    'attachment/attachFromClipboard',
    (e, ...params: Parameters<typeof AttachmentManager.attachFromClipboard>) =>
      handleError(() => AttachmentManager.attachFromClipboard(...params))
  )

  ipcMain.handle(
    'attachment/getForTask',
    (e, ...params: Parameters<typeof AttachmentManager.getForTask>) =>
      handleError(() => AttachmentManager.getForTask(...params))
  )

  ipcMain.on('attachment/openFile', (_e, id: number) => AttachmentManager.openFile(id))
  ipcMain.on('attachment/openFileLocation', (_e, id: number) =>
    AttachmentManager.openFileLocation(id)
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
