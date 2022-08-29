# did-you-know

Umi 做了很多功能，很多开发者并不知道，需要找机会曝光下。比如 `/__umi` 路由，比如本地调试 umi.js 产物的方法，比如 clientLoader 功能，比如 Low Import，比如微生成器，等等。

## 方案

* 提供 @umijs/did-you-know 包，放 umijs org 下，单独维护和发包，属于保存在 package.json 的 didYouKnow 字段里，格式为 `{ text: string, url?: string, majorVersion?: number, framework?: string[] }[]`

```
"didYouKnow": [
  { "text": "", url: "", majorVersion: 4, framework: ['umi', '@umijs/max'] },
  { "text": "" },
]
```

* @umijs/did-you-know 包提供两个脚本，1）校验 package.json 和字段的合法性，PR 和发布时执行，2）发布脚本，自动 bump bugfix version
* @umijs/did-you-know 还需提供 umi 插件，在插件注册阶段打印 「did you know」日志，兼容 umi 3 和 4

目录结构，

```
+ src
  - plugin.ts
+ scripts
  - release.ts
  - check.ts
- package.json
```

效果见，

```
[DidYouKnow] dev 模式下访问 /__umi 路由，可以发现很多有用的内部信息。
```

* umi 3 和 4 分别内置这个插件。

### 第一批「Did You Know」

* dev 模式下访问 /\_\_umi 路由，可以发现很多有用的内部信息
	* majorVersion: 4
* father 4 正式发布了
	* url: https://zhuanlan.zhihu.com/p/558192063
* @umijs/max 是蚂蚁内网框架 Bigfish 的对外版本
* Umi 3 的 MFSU 可能会遇到奇怪的问题，升级到 Umi 4 后就没了
	* majorVersion: 3
* 如果要支持低版本浏览器，可尝试新出的 legacy 配置项
	* url: https://umijs.org/docs/api/config#legacy
	* majorVersion: 4
* 如果想点击组件跳转至编辑器源码位置，可尝试新出的 clickToComponent 配置项
	* url: https://umijs.org/docs/api/config#clicktocomponent
	* majorVersion: 4
* 如果想检测未使用的文件和导出，可尝试新出的 deadCode 配置项
	* url: https://umijs.org/docs/api/config#deadcode
	* majorVersion: 4
* 默认使用 esbuild 作为 JavaScript 压缩工具，也可通过 jsMinifier 配置项切换到 terser 或 uglifyJs 等
	* url: https://umijs.org/docs/api/config#jsminifier-webpack
	* majorVersion: 4
* %%framework%% g tsconfig 可一键完成项目的 TypeScript 配置
	* majorVersion: 4
* 如果你有 MPA（多页应用）需求，可尝试新出的 mpa 配置项
	* url: https://umijs.org/docs/guides/mpa
	* majorVersion: 4
