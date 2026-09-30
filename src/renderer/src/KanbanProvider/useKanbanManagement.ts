import { produce } from 'immer'
import { useRef, useCallback } from 'react'
import { useDebounceEffect } from '../Common/Hooks/useDebounceEffect'
import { useIpcCall, useIpcData } from '../Common/Hooks/useIpcCall'
import { useTaskManagement } from './useTaskManagement'
import { useColumnManagement } from './useColumnManagement'
import { useCommentManagement } from './useCommentManagement'
import { useTagManagement } from './useTagManagement'

export type TaskMoverPayload = Pick<
  Headbreak.TaskMover,
  'sourceColumn' | 'destinationColumn' | 'policy' | 'policyType'
>

export interface TaskPayload {
  title: string
  description?: string
  columnId: string
  mover?: TaskMoverPayload
  tags: string[]
}

export type ColumnPayload = Omit<Headbreak.Column, 'id' | 'tasks' | 'markForDeletion'>
export type TagPayload = Omit<Headbreak.Tag, 'id' | 'markForDeletion'>

export type KanbanModifier = (modify: (kanban: Headbreak.Kanban) => void) => void

export function useKanbanManagement() {
  const {
    data,
    setData: setKanban,
    isLoading,
    reload
  } = useIpcData(() => window.kanbanApi.get(), [])

  const kanban = data?.columns
  const tags = data?.tags

  const dirtyRef = useRef(false)

  const modifyKanban = useCallback(
    (modify: (kanban: Headbreak.Kanban) => void) => {
      if (!data) {
        throw new Error('Attempted to modify kanban before it was loaded')
      }

      setKanban(produce(data, modify))

      dirtyRef.current = true
    },
    [data]
  )

  const taskManagement = useTaskManagement(modifyKanban)
  const columnManagement = useColumnManagement(modifyKanban)
  const commentManagement = useCommentManagement(modifyKanban)
  const tagManagement = useTagManagement(modifyKanban)

  const { callIpc: sync, isLoading: isSyncing } = useIpcCall(window.kanbanApi.sync, [])

  useDebounceEffect(
    () => {
      if (dirtyRef.current && !isSyncing && kanban && tags) {
        ;(async () => {
          await sync(kanban, tags)
          dirtyRef.current = false
          reload()
        })()
      }
    },
    1000,
    [kanban, tags, isSyncing, sync]
  )

  return {
    kanban,
    tags,
    isLoading,
    isSyncing,
    ...taskManagement,
    ...columnManagement,
    ...commentManagement,
    ...tagManagement
  }
}
