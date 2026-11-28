import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useKanban } from './KanbanProvider/KanbanProvider'

export const SETTINGS = 'settings'

const EMPTY = {
  show: null,
  task: null
}

export function useRouteBasedModal(): {
  show: 'settings' | 'task' | null
  task: Headbreak.Task | null
} {
  const { modal } = useParams<{ modal: string }>()
  const { findTaskByNumber } = useKanban()
  const navigate = useNavigate()

  const [task, setTask] = useState<Headbreak.Task | null>(null)

  useEffect(() => {
    const taskNumber = Number(modal)

    if (!isNaN(taskNumber)) {
      const task = findTaskByNumber(taskNumber)

      if (!task) {
        navigate('/')
        return
      }

      setTask(task)
    }
  })

  const modalToShow = useMemo((): 'settings' | 'task' | null => {
    if (modal == null) {
      return null
    }

    if (modal === SETTINGS) {
      return 'settings'
    }

    const taskNumber = Number(modal)

    if (!isNaN(taskNumber)) {
      const task = findTaskByNumber(taskNumber)

      if (!task) {
        return null
      }

      return 'task'
    }

    return null
  }, [modal])

  return {
    show: modalToShow,
    task
  }
}
