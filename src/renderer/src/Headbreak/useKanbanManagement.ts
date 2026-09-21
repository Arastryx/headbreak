import { produce } from 'immer'
import { useRef, useCallback } from 'react'
import { v4 } from 'uuid'
import { useDebounceEffect } from './Common/useDebounceEffect'
import { useIpcCall, useIpcData } from './Common/useIpcCall'
import { arrayMoveMutable } from 'array-move'

export interface TaskPayload {
  title: string
  description?: string
  columnId: string
}

export type ColumnPayload = Omit<Headbreak.Column, 'id' | 'tasks' | 'markForDeletion'>

type KanbanModifier = (modify: (kanban: Headbreak.Column[]) => void) => void

export function useKanbanManagement() {
  const {
    data: kanban,
    setData: setKanban,
    isLoading,
    reload
  } = useIpcData(() => window.kanbanApi.get(), [])

  const dirtyRef = useRef(false)

  const modifyKanban = useCallback(
    (modify: (kanban: Headbreak.Column[]) => void) => {
      if (!kanban) {
        throw new Error('Attempted to modify kanban before it was loaded')
      }

      setKanban(produce(kanban, modify))

      dirtyRef.current = true
    },
    [kanban]
  )

  const taskManagement = useTaskManagement(modifyKanban)
  const columnManagement = useColumnManagement(modifyKanban)

  const { callIpc: sync, isLoading: isSyncing } = useIpcCall(window.kanbanApi.sync, [])

  useDebounceEffect(
    () => {
      if (dirtyRef.current && !isSyncing && kanban) {
        ;(async () => {
          await sync(kanban)
          dirtyRef.current = false
          reload()
        })()
      }
    },
    1000,
    [kanban, isSyncing, sync]
  )

  return {
    kanban,
    isLoading,
    isSyncing,
    ...taskManagement,
    ...columnManagement
  }
}

function getTaskIndex(columns: Headbreak.Column[], taskId: string) {
  for (let c = 0; c < columns.length; c++) {
    for (let t = 0; t < columns[c].tasks.length; t++) {
      if (columns[c].tasks[t].id === taskId) {
        return { columnIndex: c, taskIndex: t }
      }
    }
  }

  throw new Error(`Could not find task with id ${taskId}`)
}

function getTask(columns: Headbreak.Column[], taskId: string) {
  const { columnIndex, taskIndex } = getTaskIndex(columns, taskId)
  return columns[columnIndex].tasks[taskIndex]
}

function useTaskManagement(modify: KanbanModifier) {
  const createTask = useCallback(
    (payload: TaskPayload) => {
      const task: Headbreak.Task = {
        id: v4(),
        title: payload.title,
        description: payload.description,
        column: payload.columnId,
        updatedAt: new Date(),
        createdAt: new Date()
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

function useColumnManagement(modify: KanbanModifier) {
  const createColumn = useCallback(() => {
    const column: Headbreak.Column = {
      id: v4(),
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    modify((copy) => {
      copy.push(column)
    })

    return column
  }, [modify])

  const editColumn = useCallback(
    (id: string, payload: Partial<ColumnPayload>) => {
      modify((copy) => {
        const targetIndex = copy?.findIndex((c) => c.id === id)

        if (targetIndex == -1) {
          throw new Error(`Tried to edit non-existent column ${id}`)
        }

        copy[targetIndex] = { ...copy[targetIndex], ...payload }
      })
    },
    [modify]
  )

  const reorderColumn = useCallback(
    (movedId: string, targetId: string) => {
      modify((copy) => {
        const movedIndex = copy?.findIndex((c) => c.id === movedId)
        const targetIndex = copy?.findIndex((c) => c.id === targetId)

        if (targetIndex == -1 || movedIndex == -1) {
          throw new Error(`Either the moved column or target column does not exist`)
        }

        arrayMoveMutable(copy, movedIndex, targetIndex)
      })
    },
    [modify]
  )

  const deleteColumn = useCallback(
    (id: string) => {
      modify((copy) => {
        const targetColumn = copy?.find((c) => c.id === id)

        if (!targetColumn) {
          throw new Error(`Tried to delete non-existent column ${id}`)
        }

        targetColumn.markForDeletion = true
      })
    },
    [modify]
  )

  return { createColumn, editColumn, deleteColumn, reorderColumn }
}
