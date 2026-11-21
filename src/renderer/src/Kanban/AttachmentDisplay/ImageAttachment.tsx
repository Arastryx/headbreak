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

  if (attachment.type === 'localFolder') {
    return 'folder'
  }

  const extensionRegex = /(?:\.([^.]+))?$/
  const extension = extensionRegex.exec(attachment.link)?.[1]

  switch (extension) {
    case 'png':
    case 'jpg':
    case 'gif':
      return 'image'
    default:
      return 'insert_drive_file'
  }
}

function getAttachmentLabel(attachment: Headbreak.Attachment) {
  if (attachment.type === 'link') {
    return attachment.title
  }

  return attachment.link.replace(/^.*[\\/]/, '')
}

export interface ImageAttachmentProps {
  attachment: Headbreak.Attachment
  maxHeight?: number
  onChange?: () => void
}

export function ImageAttachment({ attachment, onChange, maxHeight }: ImageAttachmentProps) {
  if (!attachment.thumbnail) {
    throw new Error('Tried to render an image attachment for an attachment which has no thumbnail')
  }

  const { callIpc: deleteAttachment } = useIpcCall(window.attachmentApi.delete, [])

  const attachmentContent = (
    <Box
      component={'img'}
      src={`thum:///${attachment.thumbnail.id}`}
      sx={{ maxWidth: '100%', maxHeight: maxHeight }}
    />
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
              window.attachmentApi.openFileLocation(attachment.id)
            },
            hide: attachment.type !== 'localFile'
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
        sx={{
          width: '100%',
          height: '100%'
        }}
        render={({ open }) => (
          <Box
            onContextMenu={(e) => open(e)}
            sx={{
              width: '100%',
              height: '100%'
            }}
          >
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
          </Box>
        )}
      ></ContextMenu>
    </>
  )
}
