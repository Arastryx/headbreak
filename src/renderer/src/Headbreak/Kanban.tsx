import React from 'react'
import { Column } from './Column'
import { Box, Stack } from '@mui/material'

export interface KanbanProps {}

export function Kanban({}: KanbanProps) {
  return (
    <Stack direction={'row'} spacing={2} sx={{ height: '100vh', p: 2 }}>
      <Column name="first" />
      <Column name="second" />
      <Column name="third" />
    </Stack>
  )
}
