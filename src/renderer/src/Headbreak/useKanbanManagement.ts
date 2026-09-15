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

type DirtyRef = React.RefObject<boolean>

export function useKanbanManagement() {
  const {
    data: kanban,
    setData: setKanban,
    isLoading,
    reload
  } = useIpcData(() => window.kanbanApi.get(), [])

  const dirtyRef = useRef(false)

  const taskManagement = useTaskManagement(kanban, setKanban, dirtyRef)
  const columnManagement = useColumnManagement(kanban, setKanban, dirtyRef)

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

function useTaskManagement(
  kanban: Headbreak.Column[] | undefined,
  setKanban: (data?: Headbreak.Column[]) => void,
  dirtyRef: DirtyRef
) {
  const createTask = useCallback(
    (payload: TaskPayload) => {
      const task: Headbreak.Task = {
        id: v4(),
        title: payload.title,
        description: payload.description,
        column: payload.columnId
      }

      setKanban(
        produce(kanban, (copy) => {
          const targetColumn = copy?.find((c) => c.id === payload.columnId)

          if (!targetColumn) {
            throw new Error(`Tried to add a task to non-existent column ${payload.columnId}`)
          }

          targetColumn.tasks.push(task)
        })
      )

      dirtyRef.current = true

      return task
    },
    [kanban]
  )

  return { createTask }
}

function useColumnManagement(
  kanban: Headbreak.Column[] | undefined,
  setKanban: (data?: Headbreak.Column[]) => void,
  dirtyRef: DirtyRef
) {
  const createColumn = useCallback(() => {
    const column: Headbreak.Column = {
      id: v4(),
      tasks: []
    }

    setKanban(
      produce(kanban, (copy) => {
        if (copy == null) {
          throw new Error(`Tried to create a column before the app initialized`)
        }

        copy.push(column)
      })
    )

    dirtyRef.current = true

    return column
  }, [kanban])

  return { createColumn }
}
