import { Migration } from '@mikro-orm/migrations'

export class Migration20261126223902 extends Migration {
  override name = 'Migration20261126223902'

  override up(): void | Promise<void> {
    this.addSql(`alter table \`task\` add column \`number\` integer not null default 0;`)
    this.addSql(`
      WITH numberedTask AS (SELECT ROW_NUMBER() OVER(ORDER BY created_at) as rowNumber, id FROM task)
      UPDATE task
      SET number = numberedTask.rowNumber
      FROM numberedTask
      WHERE task.id = numberedTask.id
    `)
    this.addSql(`create unique index \`task_number_unique\` on \`task\` (\`number\`);`)
  }

  override down(): void | Promise<void> {
    this.addSql(`drop index \`task_number_unique\`;`)
    this.addSql(`alter table \`task\` drop column \`number\`;`)
  }
}
