import { Box, Grid, Stack } from '@mui/material'
import React from 'react'
import { ImageAttachment } from './ImageAttachment'
import { TextAttachment } from './TextAttachment'

function canHaveThumbnail(path: string) {
  return path.endsWith('png') || path.endsWith('jpg') || path.endsWith('jpeg')
}

export interface AttachmentDisplayProps {
  attachments?: (Headbreak.Attachment | Headbreak.Payload.Attachment)[]
  preventOpeningImages?: boolean
  onDelete: (attachment: Headbreak.Attachment | Headbreak.Payload.Attachment) => void
  compact?: boolean
}

function getImageGridSizing(count: number, compact?: boolean) {
  if (compact) {
    return {
      size: 2,
      maxHeight: 100
    }
  }

  return count == 1
    ? { size: 12, maxHeight: 512 }
    : count >= 9
      ? { size: 4, maxHeight: 190 }
      : { size: 6, maxHeight: 232 }
}

export function AttachmentDisplay({
  attachments,
  preventOpeningImages,
  onDelete,
  compact
}: AttachmentDisplayProps) {
  const imageAttachments = attachments?.filter(
    (a) => !a.markForDeletion && canHaveThumbnail(a.link)
  )
  const textAttachments = attachments?.filter(
    (a) => !a.markForDeletion && !canHaveThumbnail(a.link)
  )

  const imageGridSizing = getImageGridSizing(imageAttachments?.length ?? 0, compact)

  return (
    <Stack spacing={1}>
      <Grid container sx={{ alignItems: 'stretch' }}>
        {imageAttachments?.map((a) => (
          <Grid key={a.id} size={imageGridSizing.size}>
            <ImageAttachment
              attachment={a}
              maxHeight={imageGridSizing.maxHeight}
              preventOpening={preventOpeningImages}
              onDelete={onDelete}
              hideTitle={compact}
            />
          </Grid>
        ))}
      </Grid>
      {textAttachments?.length != 0 &&
        (compact ? (
          <Grid container spacing={0.5}>
            {textAttachments?.map((a) => (
              <Grid key={a.id}>
                <TextAttachment key={a.id} attachment={a} onDelete={onDelete} compact={compact} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Stack spacing={0.5}>
            {textAttachments?.map((a) => (
              <TextAttachment key={a.id} attachment={a} onDelete={onDelete} compact={compact} />
            ))}
          </Stack>
        ))}
    </Stack>
  )
}
