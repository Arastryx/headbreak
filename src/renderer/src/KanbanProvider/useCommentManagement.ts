import { useCallback } from 'react'
import { KanbanModifier } from './useKanbanManagement'
import { v4 } from 'uuid'
import { getTask } from './useTaskManagement'

function getComment(kanban: Headbreak.Column[], commentId: string) {
  for (const column of kanban) {
    for (const task of column.tasks) {
      for (const comment of task.comments) {
        if (comment.id == commentId) {
          return comment
        }
      }
    }
  }

  throw new Error(`Could not find comment with id ${commentId}`)
}

export function useCommentManagement(modify: KanbanModifier) {
  const createComment = useCallback(
    (taskId: string, text: string) => {
      const comment: Headbreak.Comment = {
        id: v4(),
        content: text,
        createdAt: new Date(),
        updatedAt: new Date(),
        task: taskId
      }

      modify((copy) => {
        const task = getTask(copy, taskId)
        task.comments.push(comment)
      })

      return comment
    },
    [modify]
  )

  const editComment = useCallback(
    (commentId: string, text: string) => {
      modify((copy) => {
        getComment(copy, commentId).content = text
      })
    },
    [modify]
  )

  const deleteComment = useCallback(
    (commentId: string) => {
      modify((copy) => {
        getComment(copy, commentId).markForDeletion = true
      })
    },
    [modify]
  )

  return { createComment, editComment, deleteComment }
}
