import { unitOfWork } from './database/database'
import { Thumbnail } from './database/entities/Thumbnail'
import { ThumbnailManager } from './ThumbnailManager'

export async function clearOrphanedThumbnails() {
  const unit = unitOfWork()

  //Because thumbnails and attachments only have a superficial relation to each other (the thumbnail path and
  // attachment link sometimes lining up, sometimes not), we have to use a custom query in order to join the
  // two together
  const results = await unit.execute<Thumbnail[]>(`
    SELECT thumbnail.*
    FROM thumbnail
    LEFT JOIN attachment ON thumbnail.path = attachment.link
    WHERE attachment.id IS NULL
  `)

  await Promise.all(
    results.map((r) => ThumbnailManager.removeThumbnail(unit.map(Thumbnail, r), unit))
  )

  await unit.flush()
}
