import { TextField, Collapse, Stack, Tooltip } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { Emphasize } from '@renderer/Common/Components/Emphasize'
import { Micon } from '@renderer/Common/Components/Micon'
import { TagMultiSelect } from '@renderer/Common/Components/TagMultiSelect'
import { title } from 'process'
import React from 'react'
import { TaskMoverFields } from './TaskMoverFields'
import { DeepPartial } from '@renderer/Common/Types/deepPartial'
import { BasicTaskPayload } from '@renderer/KanbanProvider/useTaskManagement'
import { Updater } from 'use-immer'
import { Dayjs } from 'dayjs'

export interface TaskFieldsProps {
  task: DeepPartial<BasicTaskPayload>
  lastMovedOverride: Dayjs | null
  columnId: string
  highlightErrors?: boolean
  onLastMovedOverrideChange: (v: Dayjs | null) => void
  setTask: Updater<DeepPartial<BasicTaskPayload>>
}

export function TaskFields({
  task,
  highlightErrors,
  columnId,
  setTask,
  lastMovedOverride,
  onLastMovedOverrideChange
}: TaskFieldsProps) {
  const { title, description, mover, tags: tagIds } = task
  return (
    <Stack spacing={4}>
      <Emphasize color="error" show={highlightErrors && !title}>
        <TextField
          placeholder="Title"
          fullWidth
          value={title}
          error={highlightErrors && !title}
          onChange={(e) =>
            setTask((copy) => {
              copy.title = e.target.value
            })
          }
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
        onChange={(e) =>
          setTask((copy) => {
            copy.description = e.target.value
          })
        }
      />
      <TagMultiSelect
        value={tagIds ?? []}
        onChange={(t) =>
          setTask((copy) => {
            copy.tags = t
          })
        }
      />
      <TaskMoverFields
        mover={mover}
        onChange={(m) =>
          setTask((copy) => {
            copy.mover = m
          })
        }
        currentColumnId={columnId}
        highlightErrors={highlightErrors}
      />
      <Collapse in={columnId === mover?.sourceColumn && mover.policyType === 'interval'}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <DatePicker
            label="Last Moved Override"
            value={lastMovedOverride}
            onChange={onLastMovedOverrideChange}
            slotProps={{
              field: { clearable: true },
              textField: { fullWidth: true, size: 'small' }
            }}
          />
          <Tooltip
            title="Allows you to specify a custom date for when this task was previously performed (defaults to now)."
            placement="right"
          >
            <Micon icon="info" color="action" />
          </Tooltip>
        </Stack>
      </Collapse>
    </Stack>
  )
}
