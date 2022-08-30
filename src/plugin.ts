import semver from 'semver';
// @ts-ignore
import data from '../package.json';

export default (api: any) => {
  api.onStart(() => {
    const isUmi3 = !!api.utils;
    let logger = console;
    let framework = 'umi';
    let majorVersion = '3.0.0';

    if (isUmi3) {
      logger = api.logger;
    } else {
      try {
        logger = require('umi/plugin-utils').logger;
      } catch (error) {
        console.error('error');
      }
      framework = api.appData.umi.importSource;
      majorVersion = api.appData.umi.version;
    }

    const item = getDidYouKnow(data.didYouKnow, framework, majorVersion);
    if (!item) return;
    const { text, url } = item;
    const info = [`[DidYouKnow]`, text, url && `, More on ${url}`].filter(
      Boolean,
    );
    logger.info(info.join(' ') + '。');
  });

  function getDidYouKnow(items: ITip[] = [], framwork: string, majorVersion: string) {
    // 1、get matched
    const matched = items.filter((item: any) => {
      return (
        (!item.framwork || item.framwork.includes(framwork)) &&
        (!item.majorVersion ||
          `${semver.major(majorVersion)}` === `${item.majorVersion}`)
      );
    });
    // 2、matched.length ? random : null
    if (matched.length) {
      const luck = Math.floor(Math.random() * matched.length);
      return matched[luck];
    }
    return null;
  }
};

interface ITip {
  text: string
  url?: string
  majorVersion?: number
  framework?: string[]
}
