import { logger } from '@umijs/utils';
import getGitRepoInfo from 'git-repo-info';
import 'zx/globals';

export function assert(v: unknown, message: string) {
  if (!v) {
    logger.error(message);
    process.exit(1);
  }
}

(async () => {
  const { branch } = getGitRepoInfo();
  logger.info(`branch: ${branch}`);

  // check git status
  logger.event('check git status');
  const isGitClean = (await $`git status --porcelain`).stdout.trim().length;
  assert(!isGitClean, 'git status is not clean');

  // check git remote update
  logger.event('check git remote update');
  await $`git fetch`;
  const gitStatus = (await $`git status --short --branch`).stdout.trim();
  assert(!gitStatus.includes('behind'), `git status is behind remote`);

  // check npm registry
  logger.event('check npm registry');
  const registry = (await $`npm config get registry`).stdout.trim();
  assert(
    registry === 'https://registry.npmjs.org/',
    'npm registry is not https://registry.npmjs.org/',
  );

  // check npm ownership
  logger.event('check npm ownership');
  const whoami = (await $`npm whoami`).stdout.trim();
  const owners = (await $`npm owner ls @umijs/did-you-know`).stdout
    .trim()
    .split('\n')
    .map((line) => {
      return line.split(' ')[0];
    });
  assert(
    owners.includes(whoami),
    `@umijs/did-you-know is not owned by ${whoami}`,
  );

  // build packages
  logger.event('build packages');
  await $`npm run check`;
  await $`npm run build`;

  logger.event('check client code change');
  const isGitCleanAfterClientBuild = (
    await $`git status --porcelain`
  ).stdout.trim().length;
  assert(!isGitCleanAfterClientBuild, 'client code is updated');

  const version = require('../package.json').version;
  let tag = 'latest';
  if (
    version.includes('-alpha.') ||
    version.includes('-beta.') ||
    version.includes('-rc.')
  ) {
    tag = 'next';
  }
  if (version.includes('-canary.')) tag = 'canary';

  // update pnpm lockfile
  logger.event('update pnpm lockfile');
  $.verbose = false;
  await $`pnpm i`;
  $.verbose = true;

  const isGitClean2 = (await $`git status --porcelain`).stdout.trim().length;

  if (isGitClean2) {
    // commit
    logger.event('commit');

    await $`git commit --all --message "release: ${version}"`;
  }

  try {
    // git tag
    logger.event('git tag');
    await $`git tag v${version}`;

    // git push
    logger.event('git push');
    await $`git push origin ${branch} --tags`;
  } catch (error) {
    logger.event('skip git push');
  }

  // npm publish
  logger.event('pnpm publish');
  $.verbose = false;

  // check 2fa config
  let otpArg: string[] = [];
  if (
    (await $`npm profile get "two-factor auth"`).toString().includes('writes')
  ) {
    let code = '';
    do {
      // get otp from user
      code = await question('This operation requires a one-time password: ');
      // generate arg for zx command
      // why use array? https://github.com/google/zx/blob/main/docs/quotes.md
      otpArg = ['--otp', code];
    } while (code.length !== 6);
  }

  await $`npm publish --tag ${tag} ${otpArg}`;
  logger.info(`+ alita`);

  $.verbose = true;
})();
