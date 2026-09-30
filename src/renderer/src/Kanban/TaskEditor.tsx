import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material'
import { useState } from 'react'
import { useKanban } from '../KanbanProvider/KanbanProvider'
import { Micon } from '../Common/Components/Micon'
import { TaskMoverFields } from './TaskMoverFields'
import { Emphasize } from '@renderer/Common/Components/Emphasize'
import { TaskMoverPayload } from '@renderer/KanbanProvider/useKanbanManagement'
import { TagChip } from '@renderer/Common/Components/TagChip'

function isPopulated(payload: Partial<TaskMoverPayload>): payload is TaskMoverPayload {
  const populated = (s?: string) => s != null && s != ''

  return (
    populated(payload.destinationColumn) &&
    populated(payload.sourceColumn) &&
    populated(payload.policy) &&
    populated(payload.policyType)
  )
}

export interface TaskEditorProps {
  columnId: string
  task?: Headbreak.Task
  onSubmit?: () => void
  onClose?: () => void
}

export function TaskEditor({ columnId, onSubmit, onClose, task }: TaskEditorProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [mover, setMover] = useState<Partial<TaskMoverPayload | undefined>>(task?.mover)
  const [tagIds, setTagIds] = useState<string[]>(task?.tags ?? [])

  const { tags, createTask, editTask } = useKanban()

  const [showErrorHighlighting, setShowErrorHighlighting] = useState(false)

  const shouldDisableSubmit = () => {
    return (
      title == '' ||
      (mover &&
        (!mover.sourceColumn || !mover.destinationColumn || !mover.policy || !mover.policyType))
    )
  }

  const submit = () => {
    if (mover && !isPopulated(mover)) {
      throw new Error('Tried to submit a task with only a partially filled out Task Mover')
    }

    if (task) {
      editTask(task.id, {
        title,
        description,
        mover,
        tags: tagIds
      })
    } else {
      createTask({
        description,
        title,
        mover,
        columnId,
        tags: tagIds
      })
    }

    onSubmit?.()
    onClose?.()
  }

  return (
    <Box sx={{ minWidth: 400 }}>
      <Stack spacing={4}>
        <Emphasize color="error" show={showErrorHighlighting && !title}>
          <TextField
            placeholder="Title"
            fullWidth
            value={title}
            error={showErrorHighlighting && !title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            slotProps={{
              input: { sx: { fontSize: 19, fontFamily: 'Open Sans Variable', fontWeight: '400' } },
              htmlInput: { maxLength: 127 }
            }}
          />
        </Emphasize>
        <TextField
          placeholder="Description"
          multiline
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
        />
        <FormControl variant="standard" size="small" fullWidth>
          <InputLabel id="demo-multiple-name-label">Tags</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            variant="standard"
            size="small"
            label="Tags"
            value={tagIds}
            renderValue={(values) =>
              values.length > 0 ? (
                <Stack direction="row" spacing={1}>
                  {values.map((t) => (
                    <TagChip size="small" key={t} tag={t} />
                  ))}
                </Stack>
              ) : undefined
            }
            onChange={(e) =>
              setTagIds(Array.isArray(e.target.value) ? e.target.value : [e.target.value])
            }
          >
            {tags?.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                <TagChip tag={t} size="small" />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TaskMoverFields
          mover={mover}
          onChange={setMover}
          highlightErrors={showErrorHighlighting}
        />
      </Stack>
      <Stack direction="row" spacing={2} sx={{ pt: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Box
          onMouseEnter={() => setShowErrorHighlighting(true)}
          onMouseLeave={() => setShowErrorHighlighting(false)}
        >
          <Button
            variant="contained"
            disabled={shouldDisableSubmit()}
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
