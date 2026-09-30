import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material'

import React, { useId } from 'react'
import { TagChip } from './TagChip'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'

export interface TagMultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function TagMultiSelect({ value, onChange }: TagMultiSelectProps) {
  const { tags } = useKanban()

  const labelId = useId()
  const nameId = useId()

  return (
    <FormControl variant="standard" size="small" fullWidth>
      <InputLabel id={labelId}>Tags</InputLabel>
      <Select
        labelId={labelId}
        id={nameId}
        multiple
        variant="standard"
        size="small"
        label="Tags"
        value={value}
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
          onChange(Array.isArray(e.target.value) ? e.target.value : [e.target.value])
        }
      >
        {tags?.map((t) => (
          <MenuItem key={t.id} value={t.id}>
            <TagChip tag={t} size="small" />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
