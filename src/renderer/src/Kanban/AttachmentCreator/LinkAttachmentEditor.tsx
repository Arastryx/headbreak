import { Button, Stack, TextField } from '@mui/material'
import { useIpcCall } from '@renderer/Common/Hooks/useIpcCall'
import React, { useState } from 'react'

export interface LinkAttachmentEditorProps {
  onClose?: () => void
  onSubmit?: (attachment: unknown) => void
}

export function LinkAttachmentEditor({ onClose, onSubmit }: LinkAttachmentEditorProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')

  const { callIpc: createLink, isLoading } = useIpcCall(window.attachmentApi.createLink, [])

  const submit = async () => {
    if (!url) {
      throw new Error('Attempted to submit incomplete link attachment')
    }

    const result = await createLink(url, title)

    onSubmit?.(result)
    onClose?.()
  }

  return (
    <Stack spacing={2} sx={{ minWidth: 300 }}>
      <TextField required label="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={url == ''} loading={isLoading} onClick={submit}>
          Add
        </Button>
      </Stack>
    </Stack>
  )
}
