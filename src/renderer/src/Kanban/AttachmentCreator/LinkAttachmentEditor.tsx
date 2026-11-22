import { Button, Stack, TextField } from '@mui/material'
import { useIpcCall } from '@renderer/Common/Hooks/useIpcCall'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import { useKanbanManagement } from '@renderer/KanbanProvider/useKanbanManagement'
import React, { useState } from 'react'

export interface LinkAttachmentEditorProps {
  onClose?: () => void
  attachment?: Headbreak.Attachment | Headbreak.Payload.Attachment
  taskId?: string
}

export function LinkAttachmentEditor({ onClose, taskId, attachment }: LinkAttachmentEditorProps) {
  const [url, setUrl] = useState(attachment?.link ?? '')
  const [title, setTitle] = useState(attachment?.title ?? '')

  const { createAttachment, editAttachment } = useKanban()

  const submit = async () => {
    if (!url) {
      throw new Error('Attempted to submit incomplete link attachment')
    }

    if (attachment) {
      await editAttachment(attachment.id, { link: url, title, type: 'link' })
    } else {
      if (!taskId) {
        throw new Error('Attempted to create an attachment attached to nothing')
      }

      await createAttachment({ link: url, title, type: 'link' }, taskId)
    }

    onClose?.()
  }

  return (
    <Stack spacing={2} sx={{ minWidth: 300 }}>
      <TextField required label="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={url == ''} onClick={submit}>
          Add
        </Button>
      </Stack>
    </Stack>
  )
}
