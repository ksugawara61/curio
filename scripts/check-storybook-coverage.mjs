#!/usr/bin/env node

/**
 * Storybook カバレッジチェックスクリプト
 *
 * src/features 配下のコンポーネントディレクトリに stories.tsx が存在するかをチェックする。
 *
 * Usage:
 *   node scripts/check-storybook-coverage.mjs <target-dir>
 *
 * Example:
 *   node scripts/check-storybook-coverage.mjs apps/mobile/src/features
 */

import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const targetDir = process.argv[2];

if (!targetDir) {
  console.error(
    "Usage: node scripts/check-storybook-coverage.mjs <target-dir>",
  );
  process.exit(1);
}

const resolvedTarget = join(process.cwd(), targetDir);

if (!existsSync(resolvedTarget) || !statSync(resolvedTarget).isDirectory()) {
  console.error(`Error: Directory not found: ${targetDir}`);
  process.exit(1);
}

/**
 * features ディレクトリ配下のコンポーネントディレクトリを再帰的に探索し、
 * index.tsx を持つディレクトリをコンポーネントとして扱う。
 */
const findComponentDirs = (dir) => {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  const hasIndexTsx = entries.some((e) => e.isFile() && e.name === "index.tsx");

  if (hasIndexTsx) {
    results.push(dir);
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      results.push(...findComponentDirs(join(dir, entry.name)));
    }
  }

  return results;
};

const componentDirs = findComponentDirs(resolvedTarget);

if (componentDirs.length === 0) {
  console.log("No component directories found.");
  process.exit(0);
}

const covered = [];
const missing = [];

for (const dir of componentDirs) {
  const storiesPath = join(dir, "stories.tsx");
  const relPath = relative(process.cwd(), dir);

  if (existsSync(storiesPath)) {
    covered.push(relPath);
  } else {
    missing.push(relPath);
  }
}

const total = componentDirs.length;
const coveragePercent = ((covered.length / total) * 100).toFixed(1);

console.log("\n📖 Storybook Coverage Report");
console.log("=".repeat(50));
console.log(`Target: ${targetDir}`);
console.log(`Total components: ${total}`);
console.log(`With stories:     ${covered.length}`);
console.log(`Missing stories:  ${missing.length}`);
console.log(`Coverage:         ${coveragePercent}%`);

if (missing.length > 0) {
  console.log("\n❌ Components missing stories:");
  for (const path of missing) {
    console.log(`  - ${path}`);
  }
  console.log("");
  process.exit(1);
}

console.log("\n✅ All components have Storybook stories!\n");
process.exit(0);
