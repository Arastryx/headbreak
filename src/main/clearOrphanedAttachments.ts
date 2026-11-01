import { unitOfWork } from './database/database'
import { AttachmentSchema } from './database/entities/Attachment'

export async function clearOrphanedAttachments() {
  const unit = unitOfWork()

  const orphanedAttachments = await unit.findAll(AttachmentSchema, {
    where: {
      task: { $eq: null },
      comment: { $eq: null }
    }
  })

  orphanedAttachments.forEach((a) => unit.remove(a))

  await unit.flush()
}
