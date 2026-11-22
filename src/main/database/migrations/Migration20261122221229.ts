import { Migration } from '@mikro-orm/migrations';

export class Migration20261122221229 extends Migration {

  override name = 'Migration20261122221229';

  override up(): void | Promise<void> {
    this.addSql(`create table \`attachment\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`type\` text check (\`type\` in ('link', 'localFile', 'localFolder', 'pastedImage')) not null, \`title\` text null, \`link\` text not null, \`task_id\` text null, \`comment_id\` text null, constraint \`attachment_task_id_foreign\` foreign key (\`task_id\`) references \`task\` (\`id\`) on delete cascade, constraint \`attachment_comment_id_foreign\` foreign key (\`comment_id\`) references \`comment\` (\`id\`) on delete cascade);`);
    this.addSql(`create index \`attachment_link_index\` on \`attachment\` (\`link\`);`);
    this.addSql(`create index \`attachment_task_id_index\` on \`attachment\` (\`task_id\`);`);
    this.addSql(`create index \`attachment_comment_id_index\` on \`attachment\` (\`comment_id\`);`);

    this.addSql(`create table \`thumbnail\` (\`path\` text not null primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`thumb\` text not null, \`width\` integer not null, \`height\` integer not null);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`attachment\`;`);
    this.addSql(`drop table if exists \`thumbnail\`;`);
  }

}
