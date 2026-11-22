import { Grid, Stack } from '@mui/material'
import React from 'react'
import { ImageAttachment } from './ImageAttachment'
import { TextAttachment } from './TextAttachment'

function canHaveThumbnail(path: string) {
  return path.endsWith('png') || path.endsWith('jpg') || path.endsWith('jpeg')
}

export interface AttachmentDisplayProps {
  attachments?: Headbreak.Attachment[]
}

export function AttachmentDisplay({ attachments }: AttachmentDisplayProps) {
  const imageAttachments = attachments?.filter(
    (a) => !a.markForDeletion && canHaveThumbnail(a.link)
  )
  const textAttachments = attachments?.filter(
    (a) => !a.markForDeletion && !canHaveThumbnail(a.link)
  )

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
            <ImageAttachment attachment={a} maxHeight={imageGridSizing.maxHeight} />
          </Grid>
        ))}
      </Grid>
      {textAttachments?.length != 0 && (
        <Stack>
          {textAttachments?.map((a) => (
            <TextAttachment key={a.id} attachment={a} />
          ))}
        </Stack>
      )}
    </>
  )
}
