import { Box, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { useKanban } from '../KanbanProvider/KanbanProvider'
import { Micon } from '../Common/Components/Micon'
import { Dayjs } from 'dayjs'
import { useImmer } from 'use-immer'
import { DeepPartial } from '@renderer/Common/Types/deepPartial'
import { BasicTaskPayload } from '@renderer/KanbanProvider/useTaskManagement'
import { TaskFields } from './TaskFields'

function isPopulated(payload: DeepPartial<BasicTaskPayload>): payload is BasicTaskPayload {
  const populated = (s?: string) => s != null && s != ''

  if (
    payload.mover &&
    !(
      populated(payload.mover.destinationColumn) &&
      populated(payload.mover.sourceColumn) &&
      populated(payload.mover.policy) &&
      populated(payload.mover.policyType)
    )
  ) {
    return false
  }

  return populated(payload.title)
}

export interface TaskEditorProps {
  columnId: string
  task?: Headbreak.Task
  onSubmit?: () => void
  onClose?: () => void
}

export function TaskEditor({ columnId, onSubmit, onClose, task: editableTask }: TaskEditorProps) {
  const [task, setTask] = useImmer<DeepPartial<BasicTaskPayload>>(editableTask ?? {})

  //Last moved override is stored separately because I have learned my lesson about storing date picker
  // values as strings (it gets messy)
  const [lastMovedOverride, setLastMovedOverride] = useState<Dayjs | null>(null)

  const { createTask, editTask } = useKanban()

  const [showErrorHighlighting, setShowErrorHighlighting] = useState(false)

  const submit = () => {
    if (!isPopulated(task)) {
      throw new Error('Tried to submit a partially filled task')
    }

    const payload = { ...task, lastMoved: lastMovedOverride?.set('hour', 12).toISOString() }

    if (editableTask) {
      editTask(editableTask.id, payload)
    } else {
      createTask(columnId, payload)
    }

    onSubmit?.()
    onClose?.()
  }

  return (
    <Box sx={{ minWidth: 400 }}>
      <TaskFields
        task={task}
        lastMovedOverride={lastMovedOverride}
        columnId={columnId}
        highlightErrors={showErrorHighlighting}
        onLastMovedOverrideChange={setLastMovedOverride}
        setTask={setTask}
      />
      <Stack direction="row" spacing={2} sx={{ pt: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Box
          onMouseEnter={() => setShowErrorHighlighting(true)}
          onMouseLeave={() => setShowErrorHighlighting(false)}
        >
          <Button
            variant="contained"
            disabled={!isPopulated(task)}
            startIcon={<Micon icon={task ? 'save' : 'add'} />}
            onClick={submit}
          >
            {task ? 'Save' : 'Create'}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}
