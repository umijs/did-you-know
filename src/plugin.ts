// @ts-ignore
import data from '../package.json';

export default (api: any) => {
  api.onStart(() => {
    const isUmi3 = !!api.utils;
    let logger = console;
    let framework = 'umi';
    let frameworkName = 'Umi';
    let majorVersion = '3';

    if (isUmi3) {
      logger = api.logger;
    } else {
      try {
        logger = require('umi/plugin-utils').logger;
      } catch (error) {
        console.error('error');
      }
      frameworkName = api.appData.umi.name;
      framework = api.appData.umi.importSource;
      majorVersion = api.appData.umi.version.split('.')[0];
    }

    if (process.env.BIGFISH_INFO) {
      frameworkName = 'Bigfish';
      framework = '@alipay/bigfish';
    }

    const item = getDidYouKnow(data.didYouKnow, framework, majorVersion);
    if (!item) return;
    const { text, url } = item;
    const info = [
      `[DidYouKnow]`,
      text.replace(/%%framework%%/g, frameworkName),
      url && `, More on ${url}`,
    ].filter(Boolean);
    logger.info(info.join(' ') + '。');
  });

  function getDidYouKnow(
    items: ITip[] = [],
    framework: string,
    majorVersion: string,
  ) {
    // 1、get matched
    const matched = items.filter((item: any) => {
      return (
        (!item.framwork || item.framwork.includes(framework)) &&
        (!item.majorVersion || majorVersion === `${item.majorVersion}`)
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
  text: string;
  url?: string;
  majorVersion?: number;
  framework?: string[];
}
