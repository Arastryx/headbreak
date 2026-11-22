import {
  alpha,
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
import { useKanbanManagement } from '@renderer/KanbanProvider/useKanbanManagement'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'

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

function getAttachmentLabel(attachment: Headbreak.Payload.Attachment) {
  if (attachment.type === 'link') {
    return attachment.title
  }

  return attachment.link.replace(/^.*[\\/]/, '')
}

export interface ImageAttachmentProps {
  attachment: Headbreak.Attachment | Headbreak.Payload.Attachment
  maxHeight?: number
  preventOpening?: boolean
  onDelete: (attachment: Headbreak.Attachment | Headbreak.Payload.Attachment) => void
}

export function ImageAttachment({
  attachment,
  maxHeight,
  preventOpening,
  onDelete
}: ImageAttachmentProps) {
  const attachmentContent = (
    <Box sx={{ position: 'relative' }}>
      {attachment.type != 'pastedImage' && (
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
            },
            hide: preventOpening
          },
          {
            label: 'Open File Location',
            icon: 'folder',
            onClick: () => {
              window.attachmentApi.openFileLocation(attachment.id)
            },
            hide: attachment.type !== 'localFile' || preventOpening
          },
          {
            label: 'Delete',
            icon: 'delete',
            danger: true,
            onClick: () => {
              onDelete(attachment)
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
      ></ContextMenu>
    </>
  )
}
