import { arrayMoveMutable } from 'array-move'
import { useCallback } from 'react'
import { v4 } from 'uuid'
import { KanbanModifier, TagPayload } from './useKanbanManagement'
import dayjs from 'dayjs'
import { getTask } from './useTaskManagement'

export function getAttachmentIndex(columns: Headbreak.Column[], attachmentId: string) {
  for (let c = 0; c < columns.length; c++) {
    for (let t = 0; t < columns[c].tasks.length; t++) {
      for (let a = 0; a < columns[c].tasks[t].attachments.length; a++) {
        if (columns[c].tasks[t].attachments[a].id === attachmentId) {
          return { columnIndex: c, taskIndex: t, attachmentIndex: a }
        }
      }
    }
  }

  throw new Error(`Could not find attachment with id ${attachmentId}`)
}

export function findAttachment(columns: Headbreak.Column[], attachmentId: string) {
  const { columnIndex, taskIndex, attachmentIndex } = getAttachmentIndex(columns, attachmentId)
  return columns[columnIndex].tasks[taskIndex].attachments[attachmentIndex]
}

export type BasicAttachmentPayload = Omit<Headbreak.Payload.Attachment, 'id'>

export function useAttachmentManagement(modify: KanbanModifier) {
  const createAttachment = useCallback(
    (payload: BasicAttachmentPayload, taskId: string) => {
      const attachment: Headbreak.Attachment = {
        id: v4(),
        ...payload,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString()
      }

      modify((copy) => {
        const task = getTask(copy.columns, taskId)
        task.attachments.push(attachment)
      })

      return attachment
    },
    [modify]
  )

  const editAttachment = useCallback(
    (id: string, payload: BasicAttachmentPayload) => {
      modify((copy) => {
        const attachment = findAttachment(copy.columns, id)
        Object.assign(payload, attachment)
      })
    },
    [modify]
  )

  const deleteAttachment = useCallback(
    (id: string) => {
      modify((copy) => {
        const attachment = findAttachment(copy.columns, id)
        attachment.markForDeletion = true
      })
    },
    [modify]
  )

  return { createAttachment, editAttachment, deleteAttachment }
}
