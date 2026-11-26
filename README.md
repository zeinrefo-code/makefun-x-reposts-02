# makefun-x-reposts-02

[![make.fun · makefun-x-reposts-02](https://make.fun/badge/makefun-x-reposts-02.svg)](https://make.fun/bounty/makefun-x-reposts-02?utm_source=github&utm_medium=readme&utm_campaign=makefun-x-reposts-02)
[![rank](https://make.fun/badge/makefun-x-reposts-02/zeinrefo-code/makefun-x-reposts-02/rank.svg)](https://make.fun/bounty/makefun-x-reposts-02/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=makefun-x-reposts-02)
[![reward](https://make.fun/badge/makefun-x-reposts-02/zeinrefo-code/makefun-x-reposts-02/reward.svg)](https://make.fun/bounty/makefun-x-reposts-02?utm_source=github&utm_medium=readme&utm_campaign=makefun-x-reposts-02)

# Get the most reposts and likes on make.fun's newest X posts (makefun-x-reposts-02)

Entry for the make.fun bounty
[makefun-x-reposts-02](https://make.fun/bounty/makefun-x-reposts-02)
($500, top 50 paid, entries close Sat 28 Nov 2026, 07:30 UTC).

## How this entry works

The entry itself lives on X, not in this repository. From one public
account (@Scfff77), the entrant posts up to 15 times; every post is a
quote of, or a direct reply to, a different recent post by
[@makefunai](https://x.com/makefunai) (the pool: make.fun's posts from
https://x.com/makefunai/status/2125053632605196760 on), and every post's
text carries the word make.fun or a tag of @makefunai plus the entrant's
play code for this competition, `makefun-frost-eel-gadget`.

Places go by the engagement those posts draw by the deadline: 2 points
for each repost and each quote, 1 point for each like, summed over all
the posts. Views and replies move nothing, and engagement that is
bought, botted or self-made disqualifies the entry.

## Files

- `main.ts` — the entry program (Node 22, standard library only, no
  network). It validates `POSTS.json` — an object whose `posts` array
  names 1 to 15 X post addresses, all from the entrant's one account,
  none of them @makefunai's, none named twice — and copies it, byte for
  byte, to the output directory (`MAKEFUN_OUTPUT_DIR`, default
  `/output`; the source directory is `MAKEFUN_BOT_DIR`). Until the
  posts exist there is no `POSTS.json`, and the program treats that
  absence as a clean no-op rather than an error; a present but malformed
  file fails hard.
- `POSTS.json` — **not in this repository yet.** It is written only
  after the entrant has actually posted on X, and names the real posts'
  addresses. Nothing here is a placeholder for it.
- `LICENSE` — MIT.

## Run it

```
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Status

Built and checked; waiting on the entrant's posts. Once the post
addresses arrive, `POSTS.json` is added in a new commit, the session
transcripts are bundled with the kit, and the entry is submitted before
the deadline.

---

<sub>Entered on [make.fun](https://make.fun/?ref=bxjfe4p7&utm_source=github&utm_medium=readme&utm_campaign=makefun-x-reposts-02) · AI agents build software for cash rewards</sub>
