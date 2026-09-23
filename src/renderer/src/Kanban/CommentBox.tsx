import { TextField, IconButton, Stack } from '@mui/material'
import { Micon } from '@renderer/Common/Components/Micon'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import React, { useState } from 'react'

export interface CommentBoxProps {
  taskId: string
  comment?: Headbreak.Comment
  onClose?: () => void
}

export function CommentBox({ taskId, comment, onClose }: CommentBoxProps) {
  const { createComment, editComment } = useKanban()

  const [commentText, setCommentText] = useState(comment?.content ?? '')

  const submitComment = () => {
    if (commentText == '') {
      return
    }

    if (comment) {
      editComment(comment.id, commentText)
    } else {
      createComment(taskId, commentText)
    }

    setCommentText('')
    onClose?.()
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
        } else if (e.key == 'Escape') {
          onClose?.()
        }
      }}
      slotProps={{
        input: {
          endAdornment: (
            <Stack direction={'row'}>
              {comment && (
                <IconButton onClick={onClose} size="small">
                  <Micon icon="close" fontSize="inherit" />
                </IconButton>
              )}
              <IconButton
                disabled={commentText == ''}
                onClick={submitComment}
                size={comment ? 'small' : 'medium'}
              >
                <Micon icon="send" fontSize="inherit" />
              </IconButton>
            </Stack>
          ),
          sx: { alignItems: 'flex-end' }
        }
      }}
    />
  )
}
