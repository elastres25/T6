# The Bible Hunt

A gated, self-checking Scripture scavenger hunt for student phones (Prayer · Unit 2).
Single file, no build step, no backend, works fully offline once loaded.

Students work through **5 Bible stations in a fixed order**. Each station must be
completed correctly before the next unlocks:

1. **Find the verse** (reference + one-line context)
2. **Showbie reminder** — post a photo of the open Bible + justification (text only, not enforced)
3. **Gate word** — type a specific word from the verse (case-insensitive, punctuation ignored, unlimited retries)
4. **ACTS choice** — tap the type of prayer

Progress is saved in the browser (`localStorage`), so a refresh keeps the current station.

---

## ⚠ Before class — verify the gate words

The 5 gate words must match your **class RSV-2CE Bible**. Open `index.html` and check
the `STATIONS` array at the top (clearly commented):

| Station | Reference | Gate word | ACTS answer |
|---|---|---|---|
| 1 · Abraham | Genesis 22:1–2 | `Isaac` | Adoration |
| 2 · Moses | Exodus 32:11–14 | `Egypt` | Supplication |
| 3 · David | Psalm 51:1–4 | `mercy` | Contrition |
| 4 · Jonah (keystone) | Jonah 2:1–2, 9 | `Lord` | Thanksgiving + Supplication |
| 5 · The Shema | Deuteronomy 6:4–5 | `one` | Adoration **or** "It doesn't fit neatly" |

To edit a station, change only the values in that array — no logic below needs touching.

---

## Reset control

A **hidden long-press** target sits in the bottom-left corner of the screen.
Press and hold it for ~1 second and a **"Reset the hunt & start over"** button appears.
Use it to restart a student's device or reset a demo phone.

---

## Deploy

### Option A — open the local file
Just open `index.html` in a phone/desktop browser (or AirDrop/email the file). It runs offline.

### Option B — GitHub Pages (copy-paste)
1. Put `index.html` in the repository (root, or a folder) and push.
2. On GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick your branch (e.g. `main`) and folder **/ (root)**, then **Save**.
5. Wait ~1 minute. Your link is:
   `https://<your-username>.github.io/<repo-name>/`
   (if `index.html` is in a subfolder, add `/<folder>/`).
6. Open the link on a phone, then **load it once on wifi** — after that it works offline.

---

## Nice-to-haves included
- Elapsed **timer** on the completion screen (feeds the "first done" prize)
- Optional **student name** field, shown on the finish screen for a quick check
- Gold **confetti burst** on final completion

Division of labor: **the app gates + tags; Showbie holds photos + justifications.**
