import { unitOfWork } from './database/database'
import { AttachmentSchema } from './database/entities/Attachment'
import { app, clipboard, dialog, nativeImage, shell } from 'electron'
import { headbreakApp } from '.'
import { writeFile, lstat, mkdir } from 'fs/promises'
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
      return [{ path: await pasteImageAndGetPath(items), type: 'pastedImage' }]
    } else {
      return await readFiles(items)
    }
  }

  function hasImage(items: Electron.ClipboardItem[]) {
    const clipboardItems = items
    for (const clipboardItem of clipboardItems) {
      const imageType = clipboardItem.types.find((type) => type.startsWith('image/'))

      if (imageType) {
        return true
      }
    }

    return false
  }

  async function pasteImageAndGetPath(items: Electron.ClipboardItem[]) {
    for (const clipboardItem of items) {
      const imageType = clipboardItem.types.find((type) => type.startsWith('image/'))

      if (imageType) {
        const blob = await clipboardItem.getType(imageType)

        if (blob instanceof Blob) {
          const buffer = await blob.arrayBuffer()
          const image = nativeImage.createFromBuffer(Buffer.from(buffer))

          const pastePath = `${PASTE_PATH}/${v4()}.png`

          await writeFile(pastePath, image.toPNG())

          return pastePath
        }
      }
    }
  }

  async function readFiles(items: Electron.ClipboardItem[]) {
    const [item] = items
    if (item.types.includes('text/uri-list')) {
      const blob = await item.getType('text/uri-list')
      const uriList = await blob.text()
      const paths = uriList
        .split(/\r?\n/)
        .filter(Boolean)
        .map((s) => decodeURI(s.slice(8)))

      return await Promise.all(
        paths.map(async (p) => ({
          path: p,
          type: (await lstat(p)).isDirectory() ? 'localFolder' : 'localFile'
        }))
      )
    }
    return []
  }

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
}
