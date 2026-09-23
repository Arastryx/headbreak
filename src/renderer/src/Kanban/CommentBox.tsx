import { TextField, IconButton } from '@mui/material'
import { Micon } from '@renderer/Common/Components/Micon'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import React, { useState } from 'react'

export interface CommentBoxProps {
  taskId: string
}

export function CommentBox({ taskId }: CommentBoxProps) {
  const { createComment } = useKanban()

  const [commentText, setCommentText] = useState('')

  const submitComment = () => {
    if (commentText == '') {
      return
    }

    createComment(taskId, commentText)
    setCommentText('')
  }

  return (
    <TextField
      placeholder="Leave a note"
      fullWidth
      multiline
      helperText="Shift + Enter to submit"
      value={commentText}
      onChange={(e) => setCommentText(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key == 'Enter' && e.shiftKey) {
          submitComment()
        }
      }}
      slotProps={{
        input: {
          endAdornment: (
            <IconButton disabled={commentText == ''} onClick={submitComment}>
              <Micon icon="send" />
            </IconButton>
          ),
          sx: { alignItems: 'flex-end' }
        }
      }}
      sx={{ mt: 2 }}
    />
  )
}
