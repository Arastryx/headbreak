import { TextField, IconButton, Stack, Box } from '@mui/material'
import { Micon } from '@renderer/Common/Components/Micon'
import { useIpcCall } from '@renderer/Common/Hooks/useIpcCall'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import React, { useState } from 'react'
import { v4 } from 'uuid'
import { AttachmentDisplay } from '../AttachmentDisplay'

export interface CommentBoxProps {
  taskId: string
  comment?: Headbreak.Comment
  onClose?: () => void
}

export function CommentBox({ taskId, comment, onClose }: CommentBoxProps) {
  const { createComment, editComment } = useKanban()

  const [commentText, setCommentText] = useState(comment?.content ?? '')
  const [attachments, setAttachments] = useState<Headbreak.Payload.Attachment[]>([])

  const { callIpc: createFromClipboard } = useIpcCall(window.attachmentApi.createFromClipboard, [])

  const submitComment = () => {
    if (commentText == '') {
      return
    }

    if (comment) {
      editComment(comment.id, commentText, attachments)
    } else {
      createComment(taskId, commentText, attachments)
    }

    setCommentText('')
    setAttachments([])
    onClose?.()
  }

  return (
    <Box>
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
        onPaste={async (e) => {
          var items = e.clipboardData.items

          for (let j = 0; j < items.length; j++) {
            const file = items[j].getAsFile()
            if (file) {
              const paths = await createFromClipboard()

              if (paths) {
                setAttachments(
                  attachments.concat(
                    paths.map((p) => ({
                      id: v4(),
                      link: p.path,
                      type: p.type
                    }))
                  )
                )
              }

              return
            }
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
      <AttachmentDisplay
        attachments={attachments}
        compact
        onDelete={(deletedAttachment) => {
          setAttachments(attachments.filter((a) => a.id != deletedAttachment.id))
        }}
      />
    </Box>
  )
}
