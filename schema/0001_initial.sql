-- 0001_initial.sql · 小畅宝 Colopal 结直肠癌工作台（slice 1）
--
-- 来源：`demo/build-demo-data.mjs` 里那份 CREATE TABLE 清单。列顺序与类型逐条照抄，
-- 保证生成器里的 INSERT（含按位置写的那几条）与本文件一一对应；改一处就要改两处。
--
-- 两点与生成器不同，是刻意的，改前先看：
-- 1. `subjects` 在生成器原有 10 列之后多了 7 列（activity / family_talk / lynch_title /
--    resect_title / stoma_json / pathology_title / pathology_status）。原表装不下这些
--    「档案级标量 + 分节标题」，而 `/api/bootstrap` 要求 profiles 与 demo-data.js
--    逐字段一致（见 test/store.test.mjs 的 parity 断言），所以补在这里，放在原有列之后，
--    生成器的 INSERT 也同步改成显式列名。
-- 2. `schema_migrations` 是迁移台账，生成器不管它，只有 dsh/store.js 的 migrate() 写。
--
-- 排序：`events` 与 `lars` 没有 ord 列（生成器原本就没写），读取时按 rowid 升序，
-- 与插入顺序一致；其余「一组多行」的表都按 ord 升序。

CREATE TABLE subjects (
  profile_key      TEXT PRIMARY KEY,
  name             TEXT,
  sex              TEXT,
  age              INTEGER,
  meta             TEXT,
  headline         TEXT,
  stage            TEXT,
  mindset          TEXT,
  dash_keys        TEXT,
  path             TEXT,
  activity         TEXT,
  family_talk      TEXT,
  lynch_title      TEXT,
  resect_title     TEXT,
  stoma_json       TEXT,
  pathology_title  TEXT,
  pathology_status TEXT
);

CREATE TABLE metrics (
  profile_key TEXT,
  key         TEXT,
  name        TEXT,
  unit        TEXT,
  cat         TEXT,
  color       TEXT,
  dec         INTEGER,
  kind        TEXT,
  band_low    REAL,
  band_high   REAL,
  note        TEXT,
  PRIMARY KEY (profile_key, key)
);

CREATE TABLE metric_points (
  profile_key TEXT,
  metric_key  TEXT,
  d           TEXT,
  v_num       REAL,
  v_text      TEXT,
  src         TEXT,
  ord         INTEGER,
  PRIMARY KEY (profile_key, metric_key, d, ord)
);

CREATE TABLE molecular (
  profile_key TEXT,
  k           TEXT,
  v           TEXT,
  src         TEXT,
  state       TEXT,
  note        TEXT,
  ord         INTEGER
);

CREATE TABLE events (
  profile_key TEXT,
  d           TEXT,
  label       TEXT
);

CREATE TABLE rhythm (
  profile_key TEXT,
  item        TEXT,
  freq        TEXT,
  guideline   TEXT,
  next        TEXT,
  ord         INTEGER
);

CREATE TABLE cycles (
  profile_key TEXT,
  name        TEXT,
  date        TEXT,
  drugs       TEXT,
  status      TEXT,
  done        INTEGER,
  ord         INTEGER
);

CREATE TABLE treatment_lines (
  profile_key TEXT,
  name        TEXT,
  detail      TEXT,
  done        INTEGER,
  ord         INTEGER
);

CREATE TABLE stoma_diary (
  profile_key TEXT,
  d           TEXT,
  kind        TEXT,
  finding     TEXT,
  detail      TEXT,
  ord         INTEGER
);

CREATE TABLE lars (
  profile_key TEXT,
  d           TEXT,
  score       INTEGER,
  band        TEXT,
  note        TEXT,
  self        INTEGER
);

CREATE TABLE resect_rows (
  profile_key TEXT,
  d           TEXT,
  imaging     TEXT,
  surgical    TEXT,
  ord         INTEGER
);

CREATE TABLE lynch_rows (
  profile_key TEXT,
  d           TEXT,
  item        TEXT,
  note        TEXT,
  ord         INTEGER
);

CREATE TABLE viewpoints (
  profile_key TEXT,
  d           TEXT,
  mood        TEXT,
  text        TEXT,
  ord         INTEGER
);

CREATE TABLE nutrition_notes (
  profile_key TEXT,
  d           TEXT,
  text        TEXT,
  ord         INTEGER
);

CREATE TABLE trials (
  nct_id   TEXT PRIMARY KEY,
  title    TEXT,
  phase    TEXT,
  status   TEXT,
  sponsor  TEXT,
  url      TEXT
);

CREATE TABLE demo_meta (
  k TEXT PRIMARY KEY,
  v TEXT
);

CREATE TABLE documents (
  profile_key TEXT,
  id          TEXT,
  name        TEXT,
  date        TEXT,
  type        TEXT,
  status      TEXT,
  ord         INTEGER,
  PRIMARY KEY (profile_key, id)
);

CREATE TABLE candidate_fields (
  profile_key TEXT,
  id          TEXT,
  name        TEXT,
  value       TEXT,
  source      TEXT,
  status      TEXT,
  ord         INTEGER,
  PRIMARY KEY (profile_key, id)
);

CREATE TABLE pathology_rows (
  profile_key TEXT,
  kind        TEXT,
  a           TEXT,
  b           TEXT,
  ord         INTEGER
);

-- 迁移台账 schema_migrations 不在这里建：它由 dsh/store.js 的 migrate() 在跑任何迁移之前
-- 用 CREATE TABLE IF NOT EXISTS 建好（台账必须先于迁移存在，写在迁移里会"自己建自己"）。
-- 本文件只负责业务表。

CREATE INDEX idx_points ON metric_points (profile_key, metric_key);
