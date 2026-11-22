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

  export function canGenerateThumbnail(path: string) {
    return ['.png', '.jpg', '.jpeg'].includes(extname(path))
  }

  export async function getThumbnail(path: string) {
    if (!canGenerateThumbnail(path)) {
      throw new Error('Tried to generate a thumbnail for a file which does not support thumbnails')
    }

    const unit = unitOfWork()

    let thumbnail: any = await unit.findOne(ThumbnailSchema, path)

    if (!thumbnail) {
      thumbnail = await buildThumbnail(path, unit)
    }

    await unit.flush()

    return thumbnail.thumb
  }

  async function buildThumbnail(originalPath: string, unit: Fork) {
    let image = await nativeImage.createFromPath(originalPath)
    const originalSize = image.getSize()

    if (originalSize.width > 600) {
      image = image.resize({ width: 600 })
    }

    const isPng = originalPath.endsWith('png')
    const thumb = `${THUMBNAIL_PATH}/${v4()}.${isPng ? 'png' : 'jpg'}`

    await writeFile(thumb, isPng ? image.toPNG() : image.toJPEG(100))

    const size = image.getSize()

    return unit.create(ThumbnailSchema, {
      path: originalPath,
      thumb,
      width: size.width,
      height: size.height
    })
  }
}
