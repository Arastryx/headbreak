import {
  Box,
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from '@mui/material'
import { Micon } from '@renderer/Common/Components/Micon'
import { useState } from 'react'
import { LinkAttachmentEditor } from '../AttachmentCreator/LinkAttachmentEditor'
import { AttachmentContextMenu } from './AttachmentContextMenu'
import { getAttachmentLabel, getAttachmentIcon } from './attachmentHelpers'

export interface TextAttachmentProps {
  attachment: Headbreak.Attachment | Headbreak.Payload.Attachment
  onDelete: (attachment: Headbreak.Attachment | Headbreak.Payload.Attachment) => void
  compact?: boolean
}

export function TextAttachment({ attachment, onDelete, compact }: TextAttachmentProps) {
  const [showEdit, setShowEdit] = useState(false)

  const attachmentContent = (
    <Stack
      direction="row"
      spacing={1}
      sx={(theme) => ({
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: theme.palette.action.selected,
        p: 1,
        borderRadius: 1,
        '&:hover': {
          bgcolor: 'action.hover'
        }
      })}
    >
      <Micon
        icon={getAttachmentIcon(attachment)}
        sx={{ fontSize: compact ? 16 : 22 }}
        color="action"
      />
      <Typography
        variant={compact ? 'body2' : undefined}
        sx={{ textDecoration: 'none', color: 'unset' }}
      >
        {getAttachmentLabel(attachment)}
      </Typography>
    </Stack>
  )

  return (
    <>
      <AttachmentContextMenu
        attachment={attachment}
        onDelete={() => onDelete(attachment)}
        onEdit={() => setShowEdit(true)}
        render={({ open }) => (
          <Box onContextMenu={(e) => open(e)}>
            {attachment.type === 'link' && (
              <ButtonBase
                component="a"
                target="_blank"
                href={attachment.link}
                sx={{ width: '100%' }}
              >
                {attachmentContent}
              </ButtonBase>
            )}
            {attachment.type !== 'link' && (
              <ButtonBase
                onClick={() => window.attachmentApi.openFile(attachment.id)}
                sx={{ width: '100%' }}
              >
                {attachmentContent}
              </ButtonBase>
            )}
          </Box>
        )}
      />
      <Dialog open={showEdit} onClose={() => setShowEdit(false)}>
        <DialogTitle>Edit Link</DialogTitle>
        <DialogContent>
          <LinkAttachmentEditor onClose={() => setShowEdit(false)} attachment={attachment} />
        </DialogContent>
      </Dialog>
    </>
  )
}
