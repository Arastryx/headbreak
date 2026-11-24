import { ContextMenu, ContextMenuProps } from '@renderer/Common/Components/ContextMenu/ContextMenu'
import React from 'react'

export interface AttachmentContextMenuProps {
  attachment: Headbreak.Attachment | Headbreak.Payload.Attachment
  preventOpening?: boolean
  render: ContextMenuProps['render']
  onDelete?: () => void
  onEdit?: () => void
}

export function AttachmentContextMenu({
  attachment,
  render,
  preventOpening,
  onDelete,
  onEdit
}: AttachmentContextMenuProps) {
  return (
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
          label: 'Edit',
          icon: 'edit',
          onClick: () => onEdit?.(),
          hide: attachment.type !== 'link'
        },
        {
          label: 'Delete',
          icon: 'delete',
          danger: true,
          onClick: () => {
            onDelete?.()
          }
        }
      ]}
      sx={{
        width: '100%',
        height: '100%'
      }}
      render={render}
    />
  )
}
