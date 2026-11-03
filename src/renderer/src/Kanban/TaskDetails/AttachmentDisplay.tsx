import {
  Box,
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from '@mui/material'
import { ContextMenu } from '@renderer/Common/Components/ContextMenu'
import { Micon } from '@renderer/Common/Components/Micon'
import React, { useState } from 'react'
import { LinkAttachmentEditor } from '../AttachmentCreator/LinkAttachmentEditor'
import { useIpcCall } from '@renderer/Common/Hooks/useIpcCall'
import { MaterialIcon } from 'material-icons'

function getAttachmentIcon(attachment: Headbreak.Attachment): MaterialIcon {
  if (attachment.type === 'link') {
    return 'link'
  }

  const pathParts = attachment.link.split(/[\\\/]/)
  const fileParts = pathParts[pathParts.length - 1].split('.')

  if (fileParts.length === 1) {
    return 'folder'
  }

  const extension = fileParts[fileParts.length - 1]

  switch (extension) {
    case 'png':
    case 'jpg':
    case 'gif':
      return 'image'
    default:
      return 'insert_drive_file'
  }
}

export interface AttachmentDisplayProps {
  attachment: Headbreak.Attachment
  onChange?: () => void
}

export function AttachmentDisplay({ attachment, onChange }: AttachmentDisplayProps) {
  const [showEdit, setShowEdit] = useState(false)

  const { callIpc: deleteAttachment } = useIpcCall(window.attachmentApi.delete, [])

  const attachmentContent = (
    <Stack
      direction="row"
      spacing={1}
      sx={(theme) => ({
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
      <Micon icon={getAttachmentIcon(attachment)} fontSize="small" color="action" />
      <Typography sx={{ textDecoration: 'none', color: 'unset' }}>
        {attachment.title ?? attachment.link}
      </Typography>
    </Stack>
  )

  return (
    <>
      <ContextMenu
        options={[
          {
            label: 'Open',
            icon: 'file_open',
            onClick: () => {
              if (attachment.type === 'link') {
                window.open(attachment.link, '_blank')
              } else {
                window.attachmentApi.openFile(attachment.id)
              }
            }
          },
          {
            label: 'Open File Location',
            icon: 'folder',
            onClick: () => {
              window.attachmentApi.openFile(attachment.id)
            },
            hide: attachment.type !== 'localFile'
          },
          {
            label: 'Edit',
            icon: 'edit',
            onClick: () => setShowEdit(true),
            hide: attachment.type !== 'link'
          },
          {
            label: 'Delete',
            icon: 'delete',
            danger: true,
            onClick: async () => {
              await deleteAttachment(attachment.id)
              onChange?.()
            }
          }
        ]}
        render={({ open }) => (
          <Box onContextMenu={(e) => open(e)}>
            {attachment.type === 'link' && (
              <ButtonBase component="a" target="_blank" href={attachment.link}>
                {attachmentContent}
              </ButtonBase>
            )}
            {attachment.type !== 'link' && (
              <ButtonBase onClick={() => window.attachmentApi.openFile(attachment.id)}>
                {attachmentContent}
              </ButtonBase>
            )}
          </Box>
        )}
      ></ContextMenu>
      <Dialog open={showEdit} onClose={() => setShowEdit(false)}>
        <DialogTitle>Edit Link</DialogTitle>
        <DialogContent>
          <LinkAttachmentEditor
            onClose={() => setShowEdit(false)}
            attachment={attachment}
            onSubmit={onChange}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
