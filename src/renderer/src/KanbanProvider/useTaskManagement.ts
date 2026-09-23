import { arrayMoveMutable } from 'array-move'
import { useCallback } from 'react'
import { v4 } from 'uuid'
import { KanbanModifier, TaskPayload } from './useKanbanManagement'

export function getTaskIndex(columns: Headbreak.Column[], taskId: string) {
  for (let c = 0; c < columns.length; c++) {
    for (let t = 0; t < columns[c].tasks.length; t++) {
      if (columns[c].tasks[t].id === taskId) {
        return { columnIndex: c, taskIndex: t }
      }
    }
  }

  throw new Error(`Could not find task with id ${taskId}`)
}

export function getTask(columns: Headbreak.Column[], taskId: string) {
  const { columnIndex, taskIndex } = getTaskIndex(columns, taskId)
  return columns[columnIndex].tasks[taskIndex]
}

export function useTaskManagement(modify: KanbanModifier) {
  const createTask = useCallback(
    (payload: TaskPayload) => {
      const task: Headbreak.Task = {
        id: v4(),
        title: payload.title,
        description: payload.description,
        column: payload.columnId,
        updatedAt: new Date(),
        createdAt: new Date(),
        comments: []
      }

      modify((copy) => {
        const targetColumn = copy?.find((c) => c.id === payload.columnId)

        if (!targetColumn) {
          throw new Error(`Tried to add a task to non-existent column ${payload.columnId}`)
        }

        targetColumn.tasks.push(task)
      })

      return task
    },
    [modify]
  )

  const editTask = useCallback(
    (id: string, payload: Omit<TaskPayload, 'columnId'>) => {
      modify((copy) => {
        const task = getTask(copy, id)

        task.title = payload.title
        task.description = payload.description
      })
    },
    [modify]
  )

  const moveTaskToColumn = useCallback(
    (taskId: string, columnId: string) => {
      modify((copy) => {
        const targetColumn = copy?.find((c) => c.id === columnId)

        if (!targetColumn) {
          throw new Error(`Tried to add a task to non-existent column ${columnId}`)
        }

        const { columnIndex, taskIndex } = getTaskIndex(copy, taskId)

        if (copy[columnIndex].id === columnId) {
          //Same column
          return
        }

        const [movedTask] = copy[columnIndex].tasks.splice(taskIndex, 1)

        targetColumn.tasks.push(movedTask)
      })
    },
    [modify]
  )

  const reorderTasks = useCallback(
    (movedId: string, targetId: string) => {
      modify((copy) => {
        const { columnIndex: sourceColumnIndex, taskIndex: sourceTaskIndex } = getTaskIndex(
          copy,
          movedId
        )
        const { columnIndex: targetColumnIndex, taskIndex: targetTaskIndex } = getTaskIndex(
          copy,
          targetId
        )

        if (sourceColumnIndex === targetColumnIndex) {
          arrayMoveMutable(copy[sourceColumnIndex].tasks, sourceTaskIndex, targetTaskIndex)
        } else {
          const [movedTask] = copy[sourceColumnIndex].tasks.splice(sourceTaskIndex, 1)
          copy[targetColumnIndex].tasks.splice(targetTaskIndex, 0, movedTask)
        }
      })
    },
    [modify]
  )

  const deleteTask = useCallback(
    (id: string) => {
      modify((copy) => {
        getTask(copy, id).markForDeletion = true
      })
    },
    [modify]
  )

  return { createTask, editTask, deleteTask, moveTaskToColumn, reorderTasks }
}
