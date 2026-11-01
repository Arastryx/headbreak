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

export interface LinkAttachmentProps {
  attachment: Headbreak.Attachment
  onChange?: () => void
}

export function LinkAttachment({ attachment, onChange }: LinkAttachmentProps) {
  const [showEdit, setShowEdit] = useState(false)

  const { callIpc: deleteAttachment } = useIpcCall(window.attachmentApi.delete, [])

  return (
    <>
      <ContextMenu
        options={[
          {
            label: 'Edit',
            icon: 'edit',
            onClick: () => setShowEdit(true)
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
            <ButtonBase component="a" target="_blank" href={attachment.link}>
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
                <Micon icon="link" fontSize="small" color="action" />
                <Typography sx={{ textDecoration: 'none', color: 'unset' }}>
                  {attachment.title ?? attachment.link}
                </Typography>
              </Stack>
            </ButtonBase>
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
