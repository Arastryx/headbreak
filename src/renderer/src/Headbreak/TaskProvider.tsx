import { createContext, useContext } from 'react'
import { useIpcData } from './Common/useIpcCall'

export interface TaskData extends ReturnType<typeof useIpcData<Headbreak.Column[]>> {}

const TaskContext = createContext<TaskData | null>(null)

export interface TaskProviderProps {
  children?: React.ReactNode
}

export function TaskProvider({ children }: TaskProviderProps) {
  const result = useIpcData(() => window.kanbanApi.get(), [])

  return <TaskContext.Provider value={result}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const result = useContext(TaskContext)

  if (!result) {
    throw new Error('useTask() cannot be used without being wrapped by a TaskProvider')
  }

  return result
}
