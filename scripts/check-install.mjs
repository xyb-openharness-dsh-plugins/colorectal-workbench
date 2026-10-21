#!/usr/bin/env node
/**
 * 装机目标检查：**这个包必须登记到 DSH Desktop 实际加载的那个 Harness profile。**
 *
 * 2026-10-21 更正（DSH Desktop 0.12.0 实测）：Desktop 用的是 app 自己的 Harness——
 *   macOS: ~/Library/Application Support/dsh-desktop/harness，活动 profile 名恰好叫 `web`
 *          （harness/profiles/web 里能看到所有工作台，app 写的 desktop-workbenches/ 也在这里）
 *   Windows: %APPDATA%/dsh-desktop/harness（Electron userData 约定，本机未实测）
 * 而 `~/.dsh/profiles/*` 是 CLI 侧的另一份 Harness，Desktop **不读**。
 *
 * 旧结论「装到 ~/.dsh/profiles/desktop」是把 CLI 的 desktop profile 当成了 Desktop 的；
 * `dsh.client.platform = "web"` 也只是**客户端运行环境**，与装机目录无关。
 *
 * 用法：
 *   node scripts/check-install.mjs                  # 自动探测 Desktop Harness
 *   node scripts/check-install.mjs --home <dir> --profile <name>
 * 退出码：0 = 已在 Desktop 实际加载的 profile 中登记；1 = 未登记或只登记在别处。
 */
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
function argValue(flag) {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? resolve(args[i + 1]) : null;
}

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const NAME = pkg.name;

function appSupportRoot() {
  if (process.platform === 'darwin') return join(homedir(), 'Library', 'Application Support');
  if (process.platform === 'win32') return process.env.APPDATA || join(homedir(), 'AppData', 'Roaming');
  return process.env.XDG_CONFIG_HOME || join(homedir(), '.config');
}

/** 候选 Harness：先 Desktop app 自己的，再 CLI 侧，最后旧的 desktop profile 结论。 */
function candidates() {
  const list = [];
  const explicitHome = argValue('--home');
  const explicitProfile = args.includes('--profile') ? args[args.indexOf('--profile') + 1] : null;

  if (explicitHome) {
    list.push({ label: '手动指定（--home）', home: explicitHome, profile: explicitProfile || 'web', live: true });
    return list;
  }

  const appHome = join(appSupportRoot(), 'dsh-desktop', 'harness');
  list.push({
    label: 'DSH Desktop Harness（app 自带）',
    home: appHome,
    profile: explicitProfile || 'web',
    live: existsSync(join(appHome, 'desktop-workbenches', 'state.json')) || existsSync(join(appHome, 'desktop-workbenches', 'market-installs.json')),
  });

  if (process.env.DSH_HOME) {
    list.push({ label: 'DSH_HOME 环境变量', home: resolve(process.env.DSH_HOME), profile: explicitProfile || 'web' });
  }

  const cliHome = join(homedir(), '.dsh');
  list.push({ label: 'CLI Harness（Desktop 不读）', home: cliHome, profile: 'web' });
  list.push({ label: '旧结论 desktop profile（Desktop 不读）', home: cliHome, profile: 'desktop' });
  return list;
}

function readProfile(home, profile) {
  const file = join(home, 'profiles', profile, 'package.json');
  if (!existsSync(file)) return null;
  try {
    const json = JSON.parse(readFileSync(file, 'utf8'));
    return {
      file,
      dep: json.dependencies?.[NAME] ?? null,
      bundled: (json.dsh?.profile?.bundles ?? []).includes(NAME),
    };
  } catch (error) {
    return { file, error: error.message };
  }
}

function marketRecord(home) {
  const file = join(home, 'desktop-workbenches', 'market-installs.json');
  if (!existsSync(file)) return null;
  try {
    const data = JSON.parse(readFileSync(file, 'utf8'));
    const repo = (pkg.repository?.url || pkg.repository || '').replace(/^git\+/, '').replace(/\.git$/, '');
    const hit = Object.values(data.installs || {}).find(
      (item) => item.pluginName === NAME || (repo && item.catalogId && repo.toLowerCase().endsWith(item.catalogId.toLowerCase())),
    );
    return hit || null;
  } catch {
    return null;
  }
}

const all = candidates().map((c) => ({ ...c, entry: readProfile(c.home, c.profile) }));
const live =
  all.find((c) => c.live === true) ||
  all.find((c) => c.label.startsWith('DSH Desktop') && c.entry) ||
  all.find((c) => c.label.startsWith('DSH_HOME') && c.entry) ||
  null;

const lines = [];
let ok = false;

if (!live) {
  lines.push('✗ 找不到 DSH Desktop 的 Harness（没看到 desktop-workbenches/state.json）。');
  lines.push('  Desktop 是否已安装并至少启动过一次？路径可用 --home 指定。');
} else {
  lines.push(`判定基准：${live.label} → ${join(live.home, 'profiles', live.profile)}`);
  const entry = live.entry;
  if (!entry) {
    lines.push(`✗ 这个 profile 下没有 package.json：${join(live.home, 'profiles', live.profile, 'package.json')}`);
  } else if (entry.error) {
    lines.push(`✗ package.json 读不了：${entry.error}`);
  } else if (!entry.dep) {
    lines.push(`✗ dependencies 里没有 ${NAME}——Desktop 不会加载这个工作台。`);
  } else if (!entry.bundled) {
    lines.push(`✗ 依赖装了（${entry.dep}）但 dsh.profile.bundles 里没有 ${NAME}——不会加载。`);
  } else {
    ok = true;
    lines.push(`✓ ${NAME} 已登记到 Desktop 实际加载的 profile（${entry.dep}）`);
    const rec = marketRecord(live.home);
    lines.push(
      rec
        ? `✓ 市场安装记录存在：${rec.catalogId} · ${rec.version} · ${rec.source}`
        : '! 没有市场安装记录（market-installs.json 无本包）：属手工/native 安装，市场里可能不显示「已安装」，也未必支持 app 内卸载。',
    );
  }
}

for (const c of all) {
  if (c === live || !c.entry?.dep) continue;
  lines.push(`! 另在「${c.label}」也装了（${c.entry.dep}）——那是另一份 Harness，不能替 Desktop 验收。`);
}

if (!ok) {
  lines.push('');
  lines.push('正确做法（在仓库根目录执行，tar 放在 release/）：');
  if (live) {
    lines.push(`  export DSH_HOME="${live.home}"`);
    lines.push(`  export PATH="$DSH_HOME/.desktop-bin:$PATH"   # 用 app 自带的 pnpm/node`);
    lines.push(`  NODE_OPTIONS= npx --yes pnpm@10.15.0 --dir "$DSH_HOME/profiles/${live.profile}" add -w ./release/<包名>-<版本>.tgz`);
    lines.push(`  再把 ${NAME} 加进 "$DSH_HOME/profiles/${live.profile}/package.json" 的 dsh.profile.bundles，重启 Harness。`);
  }
  lines.push('不要装到 ~/.dsh/profiles/*——Desktop 不读那里；装上也只是「配置层有了」。');
}

console.log(lines.join('\n'));
process.exit(ok ? 0 : 1);
