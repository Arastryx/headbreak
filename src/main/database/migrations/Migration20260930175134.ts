import { Migration } from '@mikro-orm/migrations';

export class Migration20260930175134 extends Migration {

  override name = 'Migration20260930175134';

  override up(): void | Promise<void> {
    this.addSql(`create table \`column\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`label\` text null, \`icon\` text null, \`color\` text null, \`order\` integer not null, \`hide_delay\` integer null);`);

    this.addSql(`create table \`tag\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`label\` text null, \`icon\` text null, \`color\` text null);`);

    this.addSql(`create table \`task\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`title\` text not null, \`description\` text null, \`order\` integer not null, \`last_moved\` date not null, \`column_id\` text not null, constraint \`task_column_id_foreign\` foreign key (\`column_id\`) references \`column\` (\`id\`) on delete cascade);`);
    this.addSql(`create index \`task_column_id_index\` on \`task\` (\`column_id\`);`);

    this.addSql(`create table \`comment\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`content\` text not null, \`task_id\` text not null, constraint \`comment_task_id_foreign\` foreign key (\`task_id\`) references \`task\` (\`id\`) on delete cascade);`);
    this.addSql(`create index \`comment_task_id_index\` on \`comment\` (\`task_id\`);`);

    this.addSql(`create table \`change_log\` (\`id\` integer not null primary key autoincrement, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`content\` json not null, \`task_id\` text not null, constraint \`change_log_task_id_foreign\` foreign key (\`task_id\`) references \`task\` (\`id\`) on delete cascade);`);
    this.addSql(`create index \`change_log_task_id_index\` on \`change_log\` (\`task_id\`);`);

    this.addSql(`create table \`task_tags\` (\`task_id\` text not null, \`tag_id\` text not null, primary key (\`task_id\`, \`tag_id\`), constraint \`task_tags_task_id_foreign\` foreign key (\`task_id\`) references \`task\` (\`id\`) on update cascade on delete cascade, constraint \`task_tags_tag_id_foreign\` foreign key (\`tag_id\`) references \`tag\` (\`id\`) on update cascade on delete cascade);`);
    this.addSql(`create index \`task_tags_task_id_index\` on \`task_tags\` (\`task_id\`);`);
    this.addSql(`create index \`task_tags_tag_id_index\` on \`task_tags\` (\`tag_id\`);`);

    this.addSql(`create table \`task_mover\` (\`id\` text not null primary key, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`policy\` text not null, \`policy_type\` text check (\`policy_type\` in ('cron', 'interval')) not null, \`source_column_id\` text not null, \`destination_column_id\` text not null, \`task_id\` text not null, constraint \`task_mover_source_column_id_foreign\` foreign key (\`source_column_id\`) references \`column\` (\`id\`), constraint \`task_mover_destination_column_id_foreign\` foreign key (\`destination_column_id\`) references \`column\` (\`id\`), constraint \`task_mover_task_id_foreign\` foreign key (\`task_id\`) references \`task\` (\`id\`) on delete cascade);`);
    this.addSql(`create index \`task_mover_source_column_id_index\` on \`task_mover\` (\`source_column_id\`);`);
    this.addSql(`create index \`task_mover_destination_column_id_index\` on \`task_mover\` (\`destination_column_id\`);`);
    this.addSql(`create unique index \`task_mover_task_id_unique\` on \`task_mover\` (\`task_id\`);`);
  }

}
