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

## 装机目标：Desktop 实际加载的 Harness profile（2026-10-21 更正）

> **更正**：2026-10-20 版把「Desktop 只读 `~/.dsh/profiles/desktop`」写死了，那是把 **CLI 侧的 desktop profile** 当成了 Desktop 的。
> DSH Desktop 0.12.0 实测：app 用**自己**的 Harness，活动 profile 名恰好叫 `web`，即
> `~/Library/Application Support/dsh-desktop/harness/profiles/web`。
> 判据有两条：所有已装工作台都在这份 `package.json` 里；app 自己写的 `desktop-workbenches/market-installs.json` 也只在这个 Harness 下。
> `~/.dsh/profiles/*` 是 CLI 侧另一份 Harness，**Desktop 不读**——装上去只是"配置层有了"。

两个概念别混：

| 概念 | 取值 | 谁规定 |
| --- | --- | --- |
| `dsh.client.platform` | `"web"` | 官方检查器强制；指**客户端运行环境**（渲染进程），与装机目录无关 |
| 装到哪个 profile | Desktop Harness 的 `web` profile | 本节 + `scripts/check-install.mjs`（自动探测基准目录，不按目录名猜） |

打包：

```bash
npm run check
mkdir -p release && npm pack --pack-destination release
# release/xyb-community-colorectal-workbench-0.1.0.tgz
```

装机（macOS / Desktop 0.12.0；先跑一次 `node scripts/check-install.mjs`，它会打印本机判定的基准目录）：

```bash
export DSH_HOME="$HOME/Library/Application Support/dsh-desktop/harness"
export PATH="$DSH_HOME/.desktop-bin:$PATH"          # 用 app 自带的 pnpm / node
NODE_OPTIONS= npx --yes pnpm@10.15.0 --dir "$DSH_HOME/profiles/web" add -w <绝对路径>/release/xyb-community-colorectal-workbench-0.1.0.tgz
```

- `--dir` 指向**上一步脚本打印的 profile 目录**；换机器、换 Desktop 版本、或用户改过 Harness 位置时不要照抄这条命令。
- `NODE_OPTIONS=` 必须置空（宿主 shim 会拦临时目录删除，制造假失败）。
- 装完把包名加进**那个 profile** `package.json` 的 `dsh.profile.bundles`，否则依赖装了也不加载。

验证：`node scripts/check-install.mjs` 必须 exit 0（它会同时核对 `market-installs.json`：有记录=市场安装，无记录=手工/native 安装）；再重启 Harness（提示里的「立即重启」或菜单 **Harness → 重启 Harness**），在**工作台市场 → 已安装**看到条目、左侧入口能打开、`/api/colorectal/health` 返回 `{ok:true}`。**只跑脚本没重启，不能写"装机通过"**；`dump-config` 里出现插件层也不算 UI 加载。

回滚：

```bash
export DSH_HOME="$HOME/Library/Application Support/dsh-desktop/harness"
NODE_OPTIONS= npx --yes pnpm@10.15.0 --dir "$DSH_HOME/profiles/web" remove @xyb-community/colorectal-workbench
```

边界：标准分栏下宿主不按页面内拖动改分栏宽度（页面里的 25%–45% 拖动只作用于页面自绘面板）；要 Desktop 内也可拖，需改 `customFrame=true` 接管原生会话节点（M5 决策，未做）。
