import { rel } from '@mikro-orm/core'
import { unitOfWork } from './database/database'
import { AttachmentSchema } from './database/entities/Attachment'
import { normalizeEntities } from './normalize'
import { Task, TaskSchema } from './database/entities/Task'
import { TaskComment } from './database/entities/Comment'

interface AttachmentPayload {
  url: string
  title?: string
  taskId?: string
  commentId?: string
}

export namespace AttachmentManager {
  export async function createLink(payload: AttachmentPayload) {
    const unit = unitOfWork()

    if (payload.taskId && payload.commentId) {
      throw new Error('Cannot attach an attachment to both a task and a comment')
    }

    const result = unit.create(AttachmentSchema, {
      type: 'link',
      link: payload.url,
      title: payload.title,
      task: payload.taskId ? rel(Task, payload.taskId) : undefined,
      comment: payload.commentId ? rel(TaskComment, payload.commentId) : undefined
    })

    await unit.flush()

    return normalizeEntities(result)
  }

  export async function getForTask(taskId: string) {
    const unit = unitOfWork()

    const task = await unit.findOneOrFail(TaskSchema, taskId, { populate: ['attachments'] })

    return normalizeEntities(task.attachments.map((a) => a))
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
