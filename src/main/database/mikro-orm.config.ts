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
import { AttachmentSchema } from './entities/Attachment'
import { ThumbnailSchema } from './entities/Thumbnail'
import { Migration20261122221229 } from './migrations/Migration20261122221229'
import { Migration20261126223902 } from './migrations/Migration20261126223902'

const __GENERATING_MIGRATIONS = false

const path = __GENERATING_MIGRATIONS
  ? './db.sqlite'
  : `${app.getPath('userData')}/${import.meta.env.DEV ? 'dev' : 'app'}/db.sqlite`

export default defineConfig({
  extensions: [Migrator],
  dbName: path,
  entities: [
    TaskSchema,
    ColumnSchema,
    CommentSchema,
    ChangeLogSchema,
    TaskMoverSchema,
    TagSchema,
    AttachmentSchema,
    ThumbnailSchema
  ],
  migrations: {
    pathTs: './src/main/database/migrations',
    migrationsList: [Migration20260930175134, Migration20261122221229, Migration20261126223902]
  },
  debug: import.meta.env.DEV
})
