import {
  Tooltip,
  ButtonBase,
  Typography,
  alpha,
  Box,
  Stack,
  TextField,
  IconButton,
  Popover
} from '@mui/material'
import { ColumnSelect } from '@renderer/Common/Components/ColumnSelect'
import { Micon } from '@renderer/Common/Components/Micon'
import React, { useRef, useState } from 'react'
import { IntervalPolicySelector } from './IntervalPolicySelector'

export interface TaskAutomationProps {
  mover?: Headbreak.TaskMover
}

export function TaskAutomation({ mover }: TaskAutomationProps) {
  const [showEditor, setShowEditor] = useState(false)

  if (!showEditor && !mover) {
    return (
      <Tooltip title="Add Automation" placement="right">
        <ButtonBase onClick={() => setShowEditor(true)}>
          <Typography
            variant="body2"
            sx={(theme) => ({
              p: 1,
              transition: '0.15s',
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
            })}
          >
            Automation: None
          </Typography>
        </ButtonBase>
      </Tooltip>
    )
  }

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={(theme) => ({
        bgcolor: alpha(theme.palette.primary.main, 0.05),
        alignItems: 'center',
        mx: -1,
        p: 1
      })}
    >
      <Stack spacing={1.5} sx={{ flex: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography sx={{ pt: 1 }}>Move</Typography>
          <ColumnSelect label="Start Column" sx={{ minWidth: 130, flex: 1 }} size="small" />
          <Typography sx={{ pt: 1 }}>To</Typography>
          <ColumnSelect label="Destination" sx={{ minWidth: 130, flex: 1 }} size="small" />
        </Stack>
        <IntervalPolicySelector />
      </Stack>
      <Stack>
        <IconButton>
          <Micon icon="check" />
        </IconButton>
        <IconButton>
          <Micon icon="close" />
        </IconButton>
      </Stack>
    </Stack>
  )
}
