import { unitOfWork } from './database/database'
import { AttachmentSchema } from './database/entities/Attachment'
import { normalizeEntities } from './normalize'

export namespace AttachmentManager {
  export async function createLink(url: string, title?: string) {
    const unit = unitOfWork()

    const result = unit.create(AttachmentSchema, {
      type: 'link',
      link: url,
      title
    })

    await unit.flush()

    return normalizeEntities(result)
  }
}
