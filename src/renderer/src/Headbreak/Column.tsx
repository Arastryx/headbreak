import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Stack
} from '@mui/material'
import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { TaskEditor } from './TaskEditor'
import { HeadbreakTask } from './task'

export interface ColumnProps {}

export function Column({}: ColumnProps) {
  const [tasks, setTasks] = useState<HeadbreakTask[]>([])

  const [showCreate, setShowCreate] = useState(false)

  return (
    <Box>
      <Stack
        spacing={1}
        sx={{
          height: '100%',
          bgcolor: '#f2f1f3',
          width: 300,
          p: 1,
          borderRadius: 2,
          overflow: 'auto'
        }}
      >
        {tasks.map((t, index) => (
          <Card elevation={1} key={index} sx={{ flexShrink: 0 }}>
            <CardHeader title={t.title} sx={{ pb: 1 }} />
            {t.description && (
              <CardContent sx={{ pt: 0, '&:last-child': { pb: 2 } }}>{t.description}</CardContent>
            )}
          </Card>
        ))}
        <Button sx={{ width: '100%' }} onClick={() => setShowCreate(true)}>
          <AddIcon />
        </Button>
      </Stack>
      <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
        <DialogContent>
          <TaskEditor
            onSubmit={(t) => {
              setTasks([...tasks, t])
              setShowCreate(false)
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
