import { MenuItem, Stack, TextField, TextFieldProps, Typography } from '@mui/material'
import React from 'react'
import { Micon } from './Micon'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'

export interface ColumnSelectProps extends Omit<
  TextFieldProps,
  'onChange' | 'select' | 'slotProps'
> {
  onChange?: (columnId: string) => void
  omit?: (column: Headbreak.Column) => boolean
}

export function ColumnSelect({ onChange, omit, ...textFieldProps }: ColumnSelectProps) {
  const { kanban } = useKanban()

  const validOptions = (omit ? kanban?.filter((c) => !omit(c)) : kanban) ?? []

  const renderOption = (c: Headbreak.Column) => (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: c.color }}>
      <Micon icon={c.icon ?? 'loop'} />
      <Typography> {c.label}</Typography>
    </Stack>
  )

  return (
    <TextField
      select
      onChange={(e) => onChange?.(e.target.value)}
      slotProps={{
        select: {
          displayEmpty: true,
          renderValue: (value: unknown) => {
            const target = validOptions?.find((c) => c.id === value)
            return target ? renderOption(target) : null
          }
        }
      }}
      {...textFieldProps}
    >
      {validOptions.map((c) => (
        <MenuItem key={c.id} value={c.id}>
          {renderOption(c)}
        </MenuItem>
      ))}
    </TextField>
  )
}
