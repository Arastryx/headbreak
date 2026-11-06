import { nativeImage, app } from 'electron'
import { extname } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { Thumbnail, ThumbnailSchema } from './database/entities/Thumbnail'
import { Fork, unitOfWork } from './database/database'
import { Attachment, AttachmentSchema } from './database/entities/Attachment'
import { v4 } from 'uuid'
import { APP_DIR, DEV_DIR } from './appDir'
import { existsSync } from 'fs'

export namespace ThumbnailManager {
  const THUMBNAIL_PATH = `${app.getPath('userData')}/${app.isPackaged ? APP_DIR : DEV_DIR}/thumbnails`

  export async function prepThumbnails() {
    if (!existsSync(THUMBNAIL_PATH)) {
      await mkdir(THUMBNAIL_PATH)
    }
  }

  export function canGenerateThumbnail(attachment: Attachment) {
    return (
      (attachment.type == 'localFile' || attachment.type == 'pastedImage') &&
      ['.png', '.jpg', '.jpeg'].includes(extname(attachment.link))
    )
  }

  export async function createThumbnail(attachment: Attachment, unit: Fork) {
    if (!canGenerateThumbnail(attachment)) {
      throw new Error(
        'Tried to generate a thumbnail for an attachment which does not support thumbnails'
      )
    }

    if (attachment.thumbnail) {
      throw new Error('This attachment already has a thumbnail')
    }

    if (!attachment.thumbnail) {
      attachment.thumbnail = await buildThumbnail(attachment, unit)
    }

    if (!attachment.thumbnail) {
      throw new Error('Failed to generate thumbnail')
    }
  }

  async function buildThumbnail(attachment: Attachment, unit: Fork) {
    const thumb =
      process.platform === 'linux'
        ? await nativeImage.createFromPath(attachment.link).resize({ width: 400 })
        : await nativeImage.createThumbnailFromPath(
            attachment.link.replaceAll('/', '\\').replaceAll('%20', ' '),
            {
              width: 400,
              height: 400
            }
          )

    const isPng = attachment.link.endsWith('png')
    const path = `${THUMBNAIL_PATH}/${v4()}.${isPng ? 'png' : 'jpg'}`

    await writeFile(path, isPng ? thumb.toPNG() : thumb.toJPEG(100))

    const size = thumb.getSize()

    return unit.create(ThumbnailSchema, {
      path,
      width: size.width,
      height: size.height,
      attachment: attachment
    })
  }
}
