import { produce } from 'immer'
import { useRef, useCallback } from 'react'
import { v4 } from 'uuid'
import { useDebounceEffect } from './Common/useDebounceEffect'
import { useIpcCall, useIpcData } from './Common/useIpcCall'

export interface TaskPayload {
  title: string
  description?: string
  columnId: string
}

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

function useTaskManagement(modify: KanbanModifier) {
  const createTask = useCallback(
    (payload: TaskPayload) => {
      const task: Headbreak.Task = {
        id: v4(),
        title: payload.title,
        description: payload.description,
        column: payload.columnId
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

  const deleteTask = useCallback(
    (id: string) => {
      modify((copy) => {
        for (const column of copy) {
          for (const task of column.tasks) {
            if (task.id === id) {
              task.markForDeletion = true
              return
            }
          }
        }

        throw new Error(`Could not find task with id ${id}`)
      })
    },
    [modify]
  )

  return { createTask, deleteTask }
}

function useColumnManagement(modify: KanbanModifier) {
  const createColumn = useCallback(() => {
    const column: Headbreak.Column = {
      id: v4(),
      tasks: []
    }

    modify((copy) => {
      copy.push(column)
    })

    return column
  }, [modify])

  const editColumn = useCallback(
    (id: string, label?: string) => {
      modify((copy) => {
        const targetColumn = copy?.find((c) => c.id === id)

        if (!targetColumn) {
          throw new Error(`Tried to add a task to non-existent column ${id}`)
        }

        targetColumn.label = label
      })
    },
    [modify]
  )

  return { createColumn, editColumn }
}
