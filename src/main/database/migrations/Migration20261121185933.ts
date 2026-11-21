import { Migration } from '@mikro-orm/migrations';

export class Migration20261121185933 extends Migration {

  override name = 'Migration20261121185933';

  override up(): void | Promise<void> {
    this.addSql(`create table \`thumbnail\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`path\` text not null, \`width\` integer not null, \`height\` integer not null);`);

    this.addSql(`create table \`attachment\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`type\` text check (\`type\` in ('link', 'localFile', 'localFolder', 'pastedImage')) not null, \`title\` text null, \`link\` text not null, \`thumbnail_id\` integer null, \`task_id\` text null, \`comment_id\` text null, constraint \`attachment_thumbnail_id_foreign\` foreign key (\`thumbnail_id\`) references \`thumbnail\` (\`id\`) on delete set null, constraint \`attachment_task_id_foreign\` foreign key (\`task_id\`) references \`task\` (\`id\`) on delete cascade, constraint \`attachment_comment_id_foreign\` foreign key (\`comment_id\`) references \`comment\` (\`id\`) on delete cascade);`);
    this.addSql(`create unique index \`attachment_thumbnail_id_unique\` on \`attachment\` (\`thumbnail_id\`);`);
    this.addSql(`create index \`attachment_task_id_index\` on \`attachment\` (\`task_id\`);`);
    this.addSql(`create index \`attachment_comment_id_index\` on \`attachment\` (\`comment_id\`);`);
  }

  override down(): void | Promise<void> {

    this.addSql(`drop table if exists \`thumbnail\`;`);
    this.addSql(`drop table if exists \`attachment\`;`);
  }

}
