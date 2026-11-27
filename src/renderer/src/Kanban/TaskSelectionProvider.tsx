import { Dialog, DialogContent } from '@mui/material'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import { createContext, useCallback, useContext, useState } from 'react'
import { TaskDetails } from './TaskDetails'

export interface TaskSelectionData {
  setTask: (t: Headbreak.Task | number) => void
}

const TaskSelectionContext = createContext<TaskSelectionData | null>(null)

export interface TaskSelectionProviderProps {
  children?: React.ReactNode
}

export function TaskSelectionProvider({ children }: TaskSelectionProviderProps) {
  const { findTaskByNumber } = useKanban()
  const [task, setTask] = useState<Headbreak.Task | null>(null)
  const [show, setShow] = useState(false)

  const setOrFindTask = useCallback((t: Headbreak.Task | number) => {
    if (typeof t == 'number') {
      const locatedTask = findTaskByNumber(t)

      if (locatedTask) {
        setTask(locatedTask)
        setShow(true)
      }

      return
    }

    setShow(true)
    setTask(t)
  }, [])

  return (
    <TaskSelectionContext.Provider value={{ setTask: setOrFindTask }}>
      {children}
      <Dialog open={show} onClose={() => setShow(false)} maxWidth="sm" fullWidth>
        <DialogContent>{task && <TaskDetails task={task} />}</DialogContent>
      </Dialog>
    </TaskSelectionContext.Provider>
  )
}

export function useTaskSelection() {
  const result = useContext(TaskSelectionContext)

  if (!result) {
    throw new Error(
      'useTaskSelection() cannot be used without being wrapped by a TaskSelectionProvider'
    )
  }

  return result
}
