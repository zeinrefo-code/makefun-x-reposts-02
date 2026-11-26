/**
 * main.ts — entry program for the make.fun bounty "makefun-x-reposts-02"
 * ("Get the most reposts and likes on make.fun's newest X posts").
 *
 * The real entry is a set of posts on X: each one quotes or directly
 * replies to a different recent post by @makefunai, all from the entrant's
 * one public account, and each post's text carries the entrant's play code.
 * This repository hands those posts in through POSTS.json at its root.
 *
 * This program's whole job is to check that hand-in and pass it on:
 *
 *   1. Read POSTS.json from the bot directory (MAKEFUN_BOT_DIR, default:
 *      the directory holding this file).
 *   2. Validate it: an object with a "posts" array of 1 to 15 X post
 *      addresses, every one of them a status URL on x.com or twitter.com,
 *      all from the same account, never @makefunai's own account, and no
 *      address named twice.
 *   3. Copy the file, byte for byte, to POSTS.json in the output
 *      directory (MAKEFUN_OUTPUT_DIR, default: /output).
 *
 * While the entrant has not posted yet there is no POSTS.json, and that
 * is not an error at build time: the program notes it on stderr and
 * exits 0 without writing anything. A POSTS.json that is present but
 * malformed is a hard failure (exit 1), because a broken hand-in would
 * sink the entry at grading.
 *
 * Node 22, standard library only, no network.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** The bounty counts at most 15 of the entrant's posts. */
const MAX_POSTS = 15;

/** The house account; the entrant's posts must never be its posts. */
const HOUSE_HANDLE = "makefunai";

/** An X post address: https://x.com/<handle>/status/<numeric id>. */
const STATUS_URL =
  /^https:\/\/(?:x\.com|twitter\.com)\/([A-Za-z0-9_]{1,15})\/status\/(\d+)\/?(?:[?#].*)?$/;

function fail(message: string): never {
  process.stderr.write(`main.ts: ${message}\n`);
  process.exit(1);
}

function botDir(): string {
  const fromEnv = process.env.MAKEFUN_BOT_DIR;
  if (fromEnv !== undefined && fromEnv.length > 0) return fromEnv;
  return dirname(fileURLToPath(import.meta.url));
}

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.length > 0) return fromEnv;
  return "/output";
}

/**
 * Check the parsed contents of POSTS.json against the bounty's hand-in
 * rules. Returns nothing; any problem is a hard failure via fail().
 */
function validatePostsFile(data: unknown): void {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    fail('POSTS.json must be a JSON object shaped like {"posts": [...]}');
  }
  const posts = (data as { posts?: unknown }).posts;
  if (!Array.isArray(posts)) {
    fail('POSTS.json: "posts" must be an array of post addresses');
  }
  if (posts.length === 0) {
    fail("POSTS.json names no posts; an entry with no posts scores nothing");
  }
  if (posts.length > MAX_POSTS) {
    fail(`POSTS.json names ${posts.length} posts; at most ${MAX_POSTS} count`);
  }

  let account: string | null = null;
  const seen = new Set<string>();
  for (const item of posts) {
    if (typeof item !== "string") {
      fail("POSTS.json: every entry in \"posts\" must be a URL string");
    }
    const match = STATUS_URL.exec(item.trim());
    if (match === null) {
      fail(`POSTS.json: not an X post address: ${item}`);
    }
    const handle = match[1].toLowerCase();
    if (handle === HOUSE_HANDLE) {
      fail("POSTS.json: the posts must be the entrant's own, not @makefunai's");
    }
    if (account === null) {
      account = handle;
    } else if (handle !== account) {
      fail("POSTS.json: all posts must come from one X account");
    }
    const key = `${handle}/${match[2]}`;
    if (seen.has(key)) {
      fail(`POSTS.json: this post is named twice: ${item}`);
    }
    seen.add(key);
  }
}

function main(): void {
  const source = join(botDir(), "POSTS.json");
  const targetDir = outputDir();
  mkdirSync(targetDir, { recursive: true });

  if (!existsSync(source)) {
    // Build stage: the entrant has not posted yet, so there is nothing
    // to hand in. That is expected until the posts exist; do not fail.
    process.stderr.write(
      "main.ts: POSTS.json is not present yet; nothing to hand in.\n",
    );
    return;
  }

  const raw = readFileSync(source);
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.toString("utf8"));
  } catch {
    fail("POSTS.json is not valid JSON");
  }
  validatePostsFile(parsed);

  // Hand the file on exactly as written; the house reads the addresses
  // from it, and any reformatting could only hurt.
  writeFileSync(join(targetDir, "POSTS.json"), raw);
}

main();
