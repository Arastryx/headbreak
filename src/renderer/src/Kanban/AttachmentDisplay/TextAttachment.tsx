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
import { useState } from 'react'
import { LinkAttachmentEditor } from '../AttachmentCreator/LinkAttachmentEditor'
import { MaterialIcon } from 'material-icons'
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

function getAttachmentLabel(attachment: Headbreak.Attachment) {
  if (attachment.type === 'link') {
    return attachment.title
  }

  return attachment.link.replace(/^.*[\\/]/, '')
}

export interface TextAttachmentProps {
  attachment: Headbreak.Attachment
}

export function TextAttachment({ attachment }: TextAttachmentProps) {
  const [showEdit, setShowEdit] = useState(false)

  const { deleteAttachment } = useKanban()

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
      <Micon icon={getAttachmentIcon(attachment)} fontSize="small" color="action" />
      <Typography sx={{ textDecoration: 'none', color: 'unset' }}>
        {getAttachmentLabel(attachment)}
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
              window.attachmentApi.openFileLocation(attachment.id)
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
            }
          }
        ]}
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
      ></ContextMenu>
      <Dialog open={showEdit} onClose={() => setShowEdit(false)}>
        <DialogTitle>Edit Link</DialogTitle>
        <DialogContent>
          <LinkAttachmentEditor onClose={() => setShowEdit(false)} attachment={attachment} />
        </DialogContent>
      </Dialog>
    </>
  )
}
