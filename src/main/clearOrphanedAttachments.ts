import { unitOfWork } from './database/database'
import { AttachmentSchema } from './database/entities/Attachment'
import { unlink } from 'fs/promises'

export async function clearOrphanedAttachments() {
  const unit = unitOfWork()

  const orphanedAttachments = await unit.findAll(AttachmentSchema, {
    where: {
      task: { $eq: null },
      comment: { $eq: null }
    },
    populate: ['thumbnail']
  })

  await Promise.all(
    orphanedAttachments.map(async (a) => {
      unit.remove(a)

      if (a.thumbnail) {
        await unlink(a.thumbnail.path)
        unit.remove(a.thumbnail)
      }
    })
  )

  await unit.flush()
}
