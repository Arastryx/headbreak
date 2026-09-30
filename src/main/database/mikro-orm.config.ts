import { Migrator } from '@mikro-orm/migrations'
import { app } from 'electron'
import { ChangeLogSchema } from './entities/ChangeLog'
import { ColumnSchema } from './entities/Column'
import { CommentSchema } from './entities/Comment'
import { TagSchema } from './entities/Tag'
import { TaskSchema } from './entities/Task'
import { TaskMoverSchema } from './entities/TaskMover'
import { defineConfig } from '@mikro-orm/sqlite'
import { Migration20260930175134 } from './migrations/Migration20260930175134'

const __GENERATING_MIGRATIONS = false

const path = __GENERATING_MIGRATIONS ? '.' : app.getPath('userData')

export default defineConfig({
  extensions: [Migrator],
  dbName: `${path}/${import.meta.env.DEV ? 'dev' : 'app'}Db.sqlite`,
  entities: [TaskSchema, ColumnSchema, CommentSchema, ChangeLogSchema, TaskMoverSchema, TagSchema],
  migrations: {
    pathTs: './src/main/database/migrations',
    migrationsList: [Migration20260930175134]
  },
  debug: import.meta.env.DEV
})
