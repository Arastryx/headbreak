import { MikroORM } from '@mikro-orm/sqlite'
import config from './mikro-orm.config'

async function initialize() {
  return await MikroORM.init(config)
}

let orm: Awaited<ReturnType<typeof initialize>> | undefined

export async function initDatabase() {
  orm = await initialize()
  await orm.migrator.up()
}

export function unitOfWork() {
  if (!orm) {
    throw new Error('Attempting to fork database before it was initialized')
  }

  return orm.em.fork()
}

export type Fork = ReturnType<typeof unitOfWork>
