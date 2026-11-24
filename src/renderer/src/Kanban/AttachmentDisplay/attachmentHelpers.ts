import { MaterialIcon } from 'material-icons'

export function getAttachmentIcon(attachment: Headbreak.Payload.Attachment): MaterialIcon {
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

export function getAttachmentLabel(attachment: Headbreak.Payload.Attachment) {
  if (attachment.type === 'link') {
    return attachment.title
  }

  return attachment.link.replace(/^.*[\\/]/, '')
}
