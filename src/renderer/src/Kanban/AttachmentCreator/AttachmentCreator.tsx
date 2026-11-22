import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from '@mui/material'
import { Micon } from '@renderer/Common/Components/Micon'
import React, { useRef, useState } from 'react'
import { LinkAttachmentEditor } from './LinkAttachmentEditor'
import { useKanban } from '@renderer/KanbanProvider/KanbanProvider'
import { useIpcCall } from '@renderer/Common/Hooks/useIpcCall'

export interface AttachmentCreatorProps {
  taskId?: string
}

export function AttachmentCreator({ taskId }: AttachmentCreatorProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [showLinkEditor, setShowLinkEditor] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const { createAttachment } = useKanban()

  const { callIpc: fetchPaths } = useIpcCall(window.attachmentApi.createFiles, [])

  const createFiles = async (type: 'file' | 'folder') => {
    if (!taskId) {
      return
    }

    setShowMenu(false)

    const paths = await fetchPaths(type)

    paths?.forEach((p) => {
      createAttachment({ link: p, type: type === 'file' ? 'localFile' : 'localFolder' }, taskId)
    })
  }

  return (
    <>
      <Tooltip title="Add Attachment" placement="left">
        <IconButton onClick={() => setShowMenu(true)} ref={buttonRef} size="small">
          <Micon icon="add_link" />
        </IconButton>
      </Tooltip>
      <Menu
        open={showMenu}
        onClose={() => setShowMenu(false)}
        anchorEl={buttonRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <MenuItem
          onClick={() => {
            setShowLinkEditor(true)
            setShowMenu(false)
          }}
        >
          <ListItemIcon>
            <Micon icon="link" />
          </ListItemIcon>
          <ListItemText primary="Link" secondary="Attach a URL" />
        </MenuItem>
        {taskId && (
          <>
            <Tooltip
              title={
                'File attachments point to the original file. No files are "uploaded" to headbreak'
              }
              placement="right"
            >
              <MenuItem onClick={() => createFiles('file')}>
                <ListItemIcon>
                  <Micon icon="insert_drive_file" />
                </ListItemIcon>
                <ListItemText primary="Files" secondary="Attach local files" />
              </MenuItem>
            </Tooltip>
            <Tooltip
              title={
                'Folder attachments point to the original folder. No folders are "uploaded" to headbreak'
              }
              placement="right"
            >
              <MenuItem onClick={() => createFiles('folder')}>
                <ListItemIcon>
                  <Micon icon="folder" />
                </ListItemIcon>
                <ListItemText primary="Folders" secondary="Attach local folders" />
              </MenuItem>
            </Tooltip>
          </>
        )}
      </Menu>
      <Dialog open={showLinkEditor} onClose={() => setShowLinkEditor(false)}>
        <DialogTitle>Add Link</DialogTitle>
        <DialogContent>
          <LinkAttachmentEditor onClose={() => setShowLinkEditor(false)} taskId={taskId} />
        </DialogContent>
      </Dialog>
    </>
  )
}
