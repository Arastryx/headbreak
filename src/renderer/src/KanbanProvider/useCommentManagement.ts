import { useCallback } from 'react'
import { KanbanModifier } from './useKanbanManagement'
import { v4 } from 'uuid'
import { getTask } from './useTaskManagement'

export function useCommentManagement(modify: KanbanModifier) {
  const createComment = useCallback(
    (taskId: string, text: string) => {
      const comment: Headbreak.Comment = {
        id: v4(),
        content: text,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      modify((copy) => {
        const task = getTask(copy, taskId)
        task.comments.push(comment)
      })

      return comment
    },
    [modify]
  )

  return { createComment }
}
