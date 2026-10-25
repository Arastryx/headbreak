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
}
