import { Grid, Stack } from '@mui/material'
import React from 'react'
import { ImageAttachment } from './ImageAttachment'
import { TextAttachment } from './TextAttachment'

export interface AttachmentDisplayProps {
  attachments?: Headbreak.Attachment[]
  onChange?: () => void
}

export function AttachmentDisplay({ attachments, onChange }: AttachmentDisplayProps) {
  const imageAttachments = attachments?.filter((a) => a.thumbnail != null)
  const textAttachments = attachments?.filter((a) => a.thumbnail == null)

  const imageGridSizing: { size: number; maxHeight: number } =
    imageAttachments?.length == 1
      ? { size: 12, maxHeight: 512 }
      : (imageAttachments?.length ?? 0) >= 9
        ? { size: 4, maxHeight: 190 }
        : { size: 6, maxHeight: 232 }

  return (
    <>
      <Grid container sx={{ alignItems: 'stretch' }}>
        {imageAttachments?.map((a) => (
          <Grid key={a.id} size={imageGridSizing.size}>
            <ImageAttachment
              attachment={a}
              onChange={onChange}
              maxHeight={imageGridSizing.maxHeight}
            />
          </Grid>
        ))}
      </Grid>
      {textAttachments?.length != 0 && (
        <Stack>
          {textAttachments?.map((a) => (
            <TextAttachment key={a.id} attachment={a} onChange={onChange} />
          ))}
        </Stack>
      )}
    </>
  )
}
