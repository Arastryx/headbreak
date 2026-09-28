import { arrayMoveMutable } from 'array-move'
import { useCallback } from 'react'
import { v4 } from 'uuid'
import { KanbanModifier, ColumnPayload } from './useKanbanManagement'
import dayjs from 'dayjs'

function findColumnIndex(copy: Headbreak.Column[], id: string) {
  const targetIndex = copy?.findIndex((c) => c.id === id)

  if (targetIndex == -1) {
    throw new Error(`Tried to edit non-existent column ${id}`)
  }

  return targetIndex
}

function findColumn(copy: Headbreak.Column[], id: string) {
  return copy[findColumnIndex(copy, id)]
}

export function useColumnManagement(modify: KanbanModifier) {
  const createColumn = useCallback(() => {
    const column: Headbreak.Column = {
      id: v4(),
      tasks: [],
      createdAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString()
    }

    modify((copy) => {
      copy.columns.push(column)
    })

    return column
  }, [modify])

  const editColumn = useCallback(
    (id: string, payload: Partial<ColumnPayload>) => {
      modify((copy) => {
        const targetIndex = findColumnIndex(copy.columns, id)
        copy.columns[targetIndex] = { ...copy.columns[targetIndex], ...payload }
      })
    },
    [modify]
  )

  const reorderColumn = useCallback(
    (movedId: string, targetId: string) => {
      modify((copy) => {
        const movedIndex = findColumnIndex(copy.columns, movedId)
        const targetIndex = findColumnIndex(copy.columns, targetId)

        arrayMoveMutable(copy.columns, movedIndex, targetIndex)
      })
    },
    [modify]
  )

  const deleteColumn = useCallback(
    (id: string, moveTasksToColumn?: string) => {
      modify((copy) => {
        const targetColumn = findColumn(copy.columns, id)

        if (moveTasksToColumn) {
          const taskTarget = findColumn(copy.columns, moveTasksToColumn)
          taskTarget.tasks = taskTarget.tasks.concat(targetColumn.tasks)
          targetColumn.tasks = []
        }

        targetColumn.markForDeletion = true
      })
    },
    [modify]
  )

  return { createColumn, editColumn, deleteColumn, reorderColumn }
}
