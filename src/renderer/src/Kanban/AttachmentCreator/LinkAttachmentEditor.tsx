import { Button, Stack, TextField } from '@mui/material'
import { useIpcCall } from '@renderer/Common/Hooks/useIpcCall'
import React, { useState } from 'react'

export interface LinkAttachmentEditorProps {
  onClose?: () => void
  onSubmit?: () => void
  attachment?: Headbreak.Attachment
  taskId?: string
}

export function LinkAttachmentEditor({
  onClose,
  onSubmit,
  taskId,
  attachment
}: LinkAttachmentEditorProps) {
  const [url, setUrl] = useState(attachment?.link ?? '')
  const [title, setTitle] = useState(attachment?.title ?? '')

  const { callIpc: createLink, isLoading: isCreating } = useIpcCall(
    window.attachmentApi.createLink,
    []
  )
  const { callIpc: editLink, isLoading: isEditing } = useIpcCall(window.attachmentApi.edit, [])

  const submit = async () => {
    if (!url) {
      throw new Error('Attempted to submit incomplete link attachment')
    }

    if (attachment) {
      await editLink(attachment.id, { url, title, taskId })
    } else {
      await createLink({ url, title, taskId })
    }

    onSubmit?.()
    onClose?.()
  }

  return (
    <Stack spacing={2} sx={{ minWidth: 300 }}>
      <TextField required label="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={url == ''}
          loading={isCreating || isEditing}
          onClick={submit}
        >
          Add
        </Button>
      </Stack>
    </Stack>
  )
}
