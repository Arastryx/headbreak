import { produce } from 'immer'
import { useRef, useCallback } from 'react'
import { v4 } from 'uuid'
import { useDebounceEffect } from '../Common/Hooks/useDebounceEffect'
import { useIpcCall, useIpcData } from '../Common/Hooks/useIpcCall'
import { arrayMoveMutable } from 'array-move'
import { useTaskManagement } from './useTaskManagement'
import { useColumnManagement } from './useColumnManagement'

export interface TaskPayload {
  title: string
  description?: string
  columnId: string
}

export type ColumnPayload = Omit<Headbreak.Column, 'id' | 'tasks' | 'markForDeletion'>

export type KanbanModifier = (modify: (kanban: Headbreak.Column[]) => void) => void

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
