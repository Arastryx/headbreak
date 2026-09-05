import { defineConfig, MikroORM } from '@mikro-orm/sqlite'
import { TaskSchema } from './entities/Task'
import { app } from 'electron'
import { ColumnSchema } from './entities/Column'

const path = app.getPath('userData')

const config = defineConfig({
  dbName: `${path}/${import.meta.env.DEV ? 'dev' : 'app'}Db.sqlite`,
  entities: [TaskSchema, ColumnSchema],
  debug: import.meta.env.DEV
})

async function initialize() {
  return await MikroORM.init(config)
}

let orm: Awaited<ReturnType<typeof initialize>> | undefined

export async function initDatabase() {
  orm = await initialize()
  await orm.schema.update()
}

export function unitOfWork() {
  if (!orm) {
    throw new Error('Attempting to fork database before it was initialized')
  }

  return orm.em.fork()
}
