import { createContext, useContext } from 'react'
import { TaskPayload, useKanbanManagement } from './useKanbanManagement'

export type KanbanData = ReturnType<typeof useKanbanManagement>

const KanbanContext = createContext<KanbanData | null>(null)

export interface KanbanProviderProps {
  children?: React.ReactNode
}

export function KanbanProvider({ children }: KanbanProviderProps) {
  const kanbanManagement = useKanbanManagement()

  return <KanbanContext.Provider value={kanbanManagement}>{children}</KanbanContext.Provider>
}

export function useKanban() {
  const result = useContext(KanbanContext)

  if (!result) {
    throw new Error('useKanban() cannot be used without being wrapped by a KanbanProvider')
  }

  return result
}
