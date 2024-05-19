import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export async function execMigrations(): Promise<void> {
  await execAsync('npx prisma migrate reset --force');
}
