import { FormControl, Grid, InputLabel, MenuItem, Select, Stack, SxProps } from '@mui/material'

import React, { useId } from 'react'
import { TagChip } from './TagChip'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'

export interface TagMultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  sx?: SxProps
}

export function TagMultiSelect({ value, onChange, sx }: TagMultiSelectProps) {
  const { tags } = useKanban()

  const labelId = useId()
  const nameId = useId()

  return (
    <FormControl variant="standard" size="small" fullWidth sx={sx}>
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
            <Grid container spacing={1}>
              {values.map((t) => (
                <TagChip size="small" key={t} tag={t} />
              ))}
            </Grid>
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
