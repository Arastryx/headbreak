import { Box, Card, IconButton, Stack, Typography } from '@mui/material'
import { Micon } from '@renderer/Common/Components/Micon'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { CommentBox } from './CommentBox'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'

export interface CommentCardProps {
  comment: Headbreak.Comment
}

export function CommentCard({ comment }: CommentCardProps) {
  const [editMode, setEditMode] = useState(false)

  const { deleteComment } = useKanban()

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        my: 1,
        minHeight: 50,
        '&:hover .comment-controls': {
          opacity: 0.7
        }
      }}
    >
      {!editMode && (
        <>
          <Stack
            className="comment-controls"
            direction="row"
            sx={{ float: 'right', opacity: 0, transition: '0.15s', pr: 0.5 }}
          >
            <IconButton size="small" onClick={() => setEditMode(true)}>
              <Micon fontSize="inherit" icon="edit" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => deleteComment(comment.id)}>
              <Micon fontSize="inherit" icon="delete" />
            </IconButton>
          </Stack>
          <Typography sx={{ p: 1, pb: 1.5, whiteSpace: 'pre-wrap' }}>
            {comment.content.trim()}
          </Typography>
          <Typography variant="caption" sx={{ position: 'absolute', bottom: 0, right: 2 }}>
            {dayjs.duration(dayjs(comment.createdAt).diff(dayjs()), 'milliseconds').humanize(true)}
          </Typography>
        </>
      )}
      {editMode && (
        <Box sx={{ p: 1 }}>
          <CommentBox taskId={comment.task} comment={comment} onClose={() => setEditMode(false)} />
        </Box>
      )}
    </Card>
  )
}
