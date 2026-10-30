/**
 * Builds the app and publishes dist/ to the `gh-pages` branch, which GitHub Pages serves at
 * https://pwintsan4238.github.io/Plusefit/
 *
 * Usage: bun run deploy
 */
import { execFileSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

const root = process.cwd(); // `bun run deploy` runs from the repo root
const dist = join(root, 'dist');
const run = (cmd: string, args: string[], cwd = root) =>
  execFileSync(cmd, args, { cwd, stdio: 'inherit' });
const read = (cmd: string, args: string[]) =>
  execFileSync(cmd, args, { cwd: root, encoding: 'utf8' }).trim();

const remote = read('git', ['remote', 'get-url', 'origin']);
const sourceCommit = read('git', ['rev-parse', '--short', 'HEAD']);
const author = ['-c', `user.name=${read('git', ['config', 'user.name'])}`, '-c', `user.email=${read('git', ['config', 'user.email'])}`];

run('bun', ['run', 'lint']);
run('bun', ['run', 'build']);

// Stop GitHub Pages from running Jekyll over the build output
writeFileSync(join(dist, '.nojekyll'), '');

// Publish dist/ as a fresh single-commit gh-pages branch
run('git', ['init', '-q', '-b', 'gh-pages'], dist);
run('git', ['add', '-A'], dist);
run('git', [...author, '-c', 'core.autocrlf=false', 'commit', '-q', '-m', `Deploy ${sourceCommit}`], dist);
run('git', ['push', '-q', '--force', remote, 'gh-pages'], dist);

console.log(`\nDeployed ${sourceCommit} → https://pwintsan4238.github.io/Plusefit/`);
