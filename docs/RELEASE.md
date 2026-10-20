# 发布与回滚记录

版本/tag/commit：... 变更的功能 ID：... 用户授权范围：...
源码检查：... 包检查/大小/hash：... 实机证据：...
README/许可证/素材来源/运行依赖/更新说明：...
演示数据清单已清理或明确示例环境：...
数据库迁移与旧包兼容：... 可用备份：...
市场分发来源：npm / Release tarball / 默认分支源码 / 不投稿（选一并说明依据）：...

若任务要求本机更新：最终已安装版本/Profile/打开确认本次修改：...。若仅推送Git：明确此范围，不声称本机已更新。仅安装后仍旧版或异常时附源码→构建物→包→Profile→运行界面的诊断证据，不每次重复整链排查。

| 动作 | 目标 | 真实结果/URL/证据 | 状态 |
| --- | --- | --- | --- |
| 本地安装 | Desktop/profile | | 未执行 |
| Git push | 远端/分支/commit | | 未执行 |
| Release/npm | tag/产物/hash | | 未执行 |
| 市场 PR | 官方目录仓库 | | 未执行 |
| 上架 | 公开 catalog | | 未执行 |

市场状态说明：GitHub Release 不会自动成为市场安装来源。核对已有目录条目/开放PR；若未声明 tarball，市场按目录协议使用默认分支源码（或适用的npm来源）。普通代码版本升级不重复创建目录PR；切换安装来源或修改目录元数据时，在原条目PR中更新。市场PR提交、合并、目录可见、Desktop可安装分别记录，不混称“已上架”。

回滚步骤/数据兼容检查/已知限制：...

工作台市场发布另按 docs/10-MARKET-PUBLISHING.md 执行，附 templates/MARKET-ACCEPTANCE.md 的指定版本手工确认。官方指南复核日期/来源：... 最终安装来源：... 用户确认的项目与执行者：... PR URL/最新提交检查实际执行结果：... 市场目录可见与可安装证据：...。未授权投稿时标不适用，不把 Git push 当市场发布。

## 装机目标：必须是 desktop profile（2026-10-20）

> 上一轮打过一次 tar，装错到了 `~/.dsh/profiles/web`，Desktop 里看不到工作台。下面把"打哪个包、装到哪、怎么验"写死。

两个概念别混：

| 概念 | 取值 | 谁规定 |
| --- | --- | --- |
| `dsh.client.platform` | `"web"` | 官方检查器强制；指**客户端运行环境**（渲染进程），不是装机目录 |
| 装到哪个 profile | `desktop` | 本节 + `scripts/check-install.mjs`；Desktop 只读 `~/.dsh/profiles/desktop` |

打包：

```bash
npm run check
mkdir -p release && npm pack --pack-destination release
# release/xyb-community-colorectal-workbench-0.1.0.tgz
```

装机（唯一正确命令）：

```bash
NODE_OPTIONS= npx --yes pnpm@10.15.0 --dir ~/.dsh/profiles/desktop add -w <绝对路径>/release/xyb-community-colorectal-workbench-0.1.0.tgz
```

- `--dir` 必须是 `~/.dsh/profiles/desktop`，不要 web；`NODE_OPTIONS=` 必须置空（宿主 shim 会拦临时目录删除，制造假失败）。
- 装完把包名加进该 profile `package.json` 的 `dsh.profile.bundles`，Desktop 才加载。

验证：`node scripts/check-install.mjs` 必须 exit 0；再重启 Desktop 确认工作台出现、业务区渲染 `public/index.html`、`/api/colorectal/health` 返回 `{ok:true}`。**只跑脚本没重启，不能写"装机通过"**。

回滚：

```bash
NODE_OPTIONS= npx --yes pnpm@10.15.0 --dir ~/.dsh/profiles/desktop remove @xyb-community/colorectal-workbench
```

边界：标准分栏下宿主不按页面内拖动改分栏宽度（页面里的 25%–45% 拖动只作用于页面自绘面板）；要 Desktop 内也可拖，需改 `customFrame=true` 接管原生会话节点（M5 决策，未做）。
