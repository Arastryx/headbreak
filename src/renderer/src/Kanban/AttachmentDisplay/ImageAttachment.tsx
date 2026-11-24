import { alpha, Box, ButtonBase, Stack, Typography } from '@mui/material'
import { AttachmentContextMenu } from './AttachmentContextMenu'
import { getAttachmentLabel } from './attachmentHelpers'

export interface ImageAttachmentProps {
  attachment: Headbreak.Attachment | Headbreak.Payload.Attachment
  maxHeight?: number
  preventOpening?: boolean
  onDelete: (attachment: Headbreak.Attachment | Headbreak.Payload.Attachment) => void
  hideTitle?: boolean
}

export function ImageAttachment({
  attachment,
  maxHeight,
  preventOpening,
  hideTitle,
  onDelete
}: ImageAttachmentProps) {
  const attachmentContent = (
    <Box sx={{ position: 'relative' }}>
      {attachment.type != 'pastedImage' && !hideTitle && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            color: 'black',
            top: 0,
            left: 1,
            bgcolor: alpha('#fff', 0.5),
            lineHeight: 1,
            p: 0.5,
            borderBottomRightRadius: 3,
            pointerEvents: 'none'
          }}
        >
          {getAttachmentLabel(attachment)}
        </Typography>
      )}

      <Box
        component={'img'}
        src={`thum:///${attachment.link}`}
        sx={{ maxWidth: '100%', maxHeight: maxHeight }}
      />
    </Box>
  )

  return (
    <AttachmentContextMenu
      preventOpening={preventOpening}
      onDelete={() => onDelete(attachment)}
      attachment={attachment}
      render={({ open }) => (
        <Box
          onContextMenu={(e) => open(e)}
          sx={{
            width: '100%',
            height: '100%'
          }}
        >
          {preventOpening && (
            <Stack
              sx={(theme) => ({
                width: '100%',
                height: '100%',
                p: 1,
                minHeight: 40,
                '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.02) },
                alignItems: 'center',
                justifyContent: 'center'
              })}
            >
              {attachmentContent}
            </Stack>
          )}
          {!preventOpening && (
            <ButtonBase
              onClick={() => window.attachmentApi.openFile(attachment.id)}
              sx={{
                width: '100%',
                height: '100%',
                p: 1,
                minHeight: 40,
                '&:hover': { bgcolor: 'action.hover', opacity: 0.9 }
              }}
            >
              {attachmentContent}
            </ButtonBase>
          )}
        </Box>
      )}
    />
  )
}
