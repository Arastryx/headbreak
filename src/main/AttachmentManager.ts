import { rel } from '@mikro-orm/core'
import { unitOfWork } from './database/database'
import { Attachment, AttachmentSchema } from './database/entities/Attachment'
import { normalizeEntities } from './normalize'
import { Task, TaskSchema } from './database/entities/Task'
import { TaskComment } from './database/entities/Comment'
import { app, clipboard, dialog, shell } from 'electron'
import { headbreakApp } from '.'
import { ThumbnailManager } from './ThumbnailManager'
import { unlink, writeFile, lstat, mkdir } from 'fs/promises'
import { v4 } from 'uuid'
import { APP_DIR, DEV_DIR } from './appDir'
import { existsSync } from 'fs'

interface AttachmentPayload {
  url: string
  title?: string
  taskId?: string
}

export namespace AttachmentManager {
  const PASTE_PATH = `${app.getPath('userData')}/${app.isPackaged ? APP_DIR : DEV_DIR}/pasted`

  export async function prepPasted() {
    if (!existsSync(PASTE_PATH)) {
      await mkdir(PASTE_PATH)
    }
  }

  // export async function createLink(payload: AttachmentPayload) {
  //   const unit = unitOfWork()

  //   const result = unit.create(AttachmentSchema, {
  //     type: 'link',
  //     link: payload.url,
  //     title: payload.title,
  //     task: payload.taskId ? rel(Task, payload.taskId) : undefined
  //   })

  //   await unit.flush()

  //   return normalizeEntities(result)
  // }

  export async function createFiles(type: 'file' | 'folder') {
    if (!headbreakApp.mainWindow) {
      throw new Error('Attempted to open a dialog before the window was ready')
    }
    const result = await dialog.showOpenDialog(headbreakApp.mainWindow, {
      properties: [type === 'file' ? 'openFile' : 'openDirectory', 'multiSelections']
    })

    return result.filePaths
  }

  export async function createFromClipboard() {
    const items = await clipboard.read()

    if (hasImage(items)) {
      //FOLLOW INSTRUCTIONS HERE: https://web.dev/articles/clipboard/paste-images
      // On how to extract the image
      console.log('You pasted an image!!!!')
      return []
    } else {
      return await readFiles(items)
    }
  }

  function hasImage(items: Electron.ClipboardItem[]) {
    const clipboardItems = items
    for (const clipboardItem of clipboardItems) {
      const imageTypes = clipboardItem.types.find((type) => type.startsWith('image/'))

      if (imageTypes) {
        return true
      }
    }

    return false
  }

  async function readFiles(items: Electron.ClipboardItem[]) {
    const [item] = items
    if (item.types.includes('text/uri-list')) {
      const blob = await item.getType('text/uri-list')
      const uriList = await blob.text()
      const paths = uriList
        .split(/\r?\n/)
        .filter(Boolean)
        .map((s) => s.slice(8))

      return await Promise.all(
        paths.map(async (p) => ({
          path: p,
          isDirectory: (await lstat(p)).isDirectory()
        }))
      )
    }
    return []
  }

  // export async function getForTask(taskId: string) {
  //   const unit = unitOfWork()

  //   const attachments = await unit.findAll(AttachmentSchema, {
  //     where: {
  //       task: { id: taskId }
  //     },
  //     populate: ['thumbnail']
  //   })

  //   return normalizeEntities(attachments.map((a) => a))
  // }

  export async function openFile(attachmentId: string) {
    const unit = unitOfWork()
    const attachment = await unit.findOneOrFail(AttachmentSchema, attachmentId)

    if (attachment.type === 'link') {
      throw new Error('Attempted to open a file on a link attachment')
    }

    await shell.openPath(attachment.link)
  }

  export async function openFileLocation(attachmentId: string) {
    const unit = unitOfWork()
    const attachment = await unit.findOneOrFail(AttachmentSchema, attachmentId)

    if (attachment.type === 'link') {
      throw new Error('Attempted to open a file on a link attachment')
    }

    await shell.showItemInFolder(attachment.link)
  }

  // export async function edit(attachmentId: string, payload: AttachmentPayload) {
  //   const unit = unitOfWork()

  //   const attachment = await unit.findOneOrFail(AttachmentSchema, attachmentId)

  //   attachment.link = payload.url
  //   attachment.title = payload.title

  //   await unit.flush()

  //   return attachment
  // }

  // export async function deleteAttachment(attachmentId: string) {
  //   const unit = unitOfWork()

  //   const attachment = await unit.findOneOrFail(AttachmentSchema, attachmentId, {
  //     populate: ['thumbnail']
  //   })
  //   unit.remove(attachment)

  //   if (attachment.thumbnail) {
  //     unit.remove(attachment.thumbnail)
  //     await unlink(attachment.thumbnail.path)
  //   }

  //   await unit.flush()
  // }
}
