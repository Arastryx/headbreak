import { wrap } from '@mikro-orm/core'

export function normalizeEntities<T extends object>(item: T | T[]) {
  if (Array.isArray(item)) {
    return item.map((i) => wrap(i).toObject())
  }

  return wrap(item).toObject()
}
