import { rel } from '@mikro-orm/core'
import { unitOfWork } from './database/database'
import { AttachmentSchema } from './database/entities/Attachment'
import { normalizeEntities } from './normalize'
import { Task, TaskSchema } from './database/entities/Task'
import { TaskComment } from './database/entities/Comment'
import { dialog, shell } from 'electron'
import { headbreakApp } from '.'

interface AttachmentPayload {
  url: string
  title?: string
  taskId?: string
}

export namespace AttachmentManager {
  export async function createLink(payload: AttachmentPayload) {
    const unit = unitOfWork()

    const result = unit.create(AttachmentSchema, {
      type: 'link',
      link: payload.url,
      title: payload.title,
      task: payload.taskId ? rel(Task, payload.taskId) : undefined
    })

    await unit.flush()

    return normalizeEntities(result)
  }

  export async function createFiles(taskId: string, type: 'file' | 'folder') {
    if (!headbreakApp.mainWindow) {
      throw new Error('Attempted to open a dialog before the window was ready')
    }

    const result = await dialog.showOpenDialog(headbreakApp.mainWindow, {
      properties: [type === 'file' ? 'openFile' : 'openDirectory', 'multiSelections']
    })

    const unit = unitOfWork()

    result.filePaths.forEach((p) =>
      unit.create(AttachmentSchema, {
        type: type === 'file' ? 'localFile' : 'localFolder',
        link: p,
        task: rel(Task, taskId)
      })
    )

    await unit.flush()
  }

  export async function getForTask(taskId: string) {
    const unit = unitOfWork()

    const attachments = await unit.findAll(AttachmentSchema, {
      where: {
        task: { id: taskId }
      }
    })

    return normalizeEntities(attachments.map((a) => a))
  }

  export async function openFile(attachmentId: number) {
    const unit = unitOfWork()
    const attachment = await unit.findOneOrFail(AttachmentSchema, attachmentId)

    if (attachment.type === 'link') {
      throw new Error('Attempted to open a file on a link attachment')
    }

    await shell.openPath(attachment.link)
  }

  export async function openFileLocation(attachmentId: number) {
    const unit = unitOfWork()
    const attachment = await unit.findOneOrFail(AttachmentSchema, attachmentId)

    if (attachment.type === 'link') {
      throw new Error('Attempted to open a file on a link attachment')
    }

    await shell.showItemInFolder(attachment.link)
  }

  export async function edit(attachmentId: number, payload: AttachmentPayload) {
    const unit = unitOfWork()

    const attachment = await unit.findOneOrFail(AttachmentSchema, attachmentId)

    attachment.link = payload.url
    attachment.title = payload.title

    await unit.flush()

    return attachment
  }

  export async function deleteAttachment(attachmentId: number) {
    const unit = unitOfWork()

    const attachment = await unit.findOneOrFail(AttachmentSchema, attachmentId)
    unit.remove(attachment)

    await unit.flush()
  }
}
