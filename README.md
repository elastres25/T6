# The Bible Hunt

A gated, self-checking Scripture scavenger hunt for student phones (Prayer · Unit 2).
Single file, no build step, no dependencies. **Many students can use it at the same time** —
each phone tracks its own progress, so there's no conflict no matter how many run it at once.

At the start each student picks their **teacher** (Lastres, Mackle, Vazquez), their **block**
(1–8), and types their **name**. Then they work through **5 Bible stations in a fixed order**;
each must be completed correctly before the next unlocks:

1. **Find the verse** (reference + one-line context)
2. **Post a photo** of the open Bible to Showbie (reminder text, not enforced)
3. **Type a justification** (saved and sent to your Google Sheet)
4. **Gate word** — type a specific word from the verse (case-insensitive, punctuation ignored, unlimited retries)
5. **ACTS choice** — tap the type of prayer

When a student finishes all 5, their results are sent **once** to your Google Sheet.
Progress is saved on the phone (`localStorage`), so a refresh keeps their place.

---

## ⚠ Before class — verify the gate words

The 5 gate words must match your **class RSV-2CE Bible**. Open `index.html` and check
the `STATIONS` array near the top (clearly commented):

| Station | Reference | Gate word | ACTS answer |
|---|---|---|---|
| 1 · Abraham | Genesis 22:1–2 | `Isaac` | Adoration |
| 2 · Moses | Exodus 32:11–14 | `Egypt` | Supplication |
| 3 · David | Psalm 51:1–4 | `mercy` | Contrition |
| 4 · Jonah (keystone) | Jonah 2:1–2, 9 | `Lord` | Thanksgiving + Supplication |
| 5 · The Shema | Deuteronomy 6:4–5 | `one` | Adoration **or** "It doesn't fit neatly" |

To edit a station, teacher, or block list, change only the values in the settings block at
the top of `index.html` — no logic below needs touching.

---

## Setting up the Google Sheet backend

This connects the app to a Google Sheet you own, using a free Google Apps Script — **no server,
no account for students, no cost.** Do this once.

**1. Create the Sheet**
   - Go to [sheets.new](https://sheets.new) (signed in with your school Google account).
   - Name it something like *Bible Hunt Responses*. Leave it empty — the script fills it in.

**2. Add the script**
   - In that Sheet: **Extensions ▸ Apps Script**.
   - Delete whatever code is there, then paste the entire contents of
     **`google-apps-script.gs`** (in this repo) and click the **Save** (💾) icon.

**3. Deploy it as a Web App**
   - Click **Deploy ▸ New deployment**.
   - Click the gear ⚙ next to "Select type" and choose **Web app**.
   - Set:
     - **Execute as:** *Me*
     - **Who has access:** *Anyone*  ← required so student phones can send data
   - Click **Deploy**. Approve/authorize when Google asks (choose your account →
     *Advanced* → *Go to (project) →* *Allow*). This is normal for your own script.
   - Copy the **Web app URL** it gives you (ends in `/exec`).

**4. Paste the URL into the app**
   - Open `index.html`, find this line near the top:
     ```js
     const SHEET_ENDPOINT = "";
     ```
   - Put your URL between the quotes:
     ```js
     const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfy.../exec";
     ```
   - Save and re-deploy the app (re-push / re-upload the file).

**5. Test it**
   - Open the app on one phone, complete all 5 stations, and watch a row appear in the
     **Responses** tab of your Sheet. Each student = one row, with their teacher, block,
     name, total time, and — for every station — their justification, ACTS answer, and how
     many attempts they took.

**Notes**
   - Sending the data needs a connection at the finish. Finding/gating still works offline;
     if a student has no signal at the end, the app shows a **"Try again"** button.
   - "Who has access: Anyone" means anyone with the `/exec` URL can post to the Sheet. That's
     fine for a classroom; just don't publish the URL publicly. To rotate it, create a new
     deployment and paste the new URL.
   - Want live filtering by teacher/block? In the Sheet use **Data ▸ Create a filter**, or
     make per-teacher views with a formula like `=FILTER(Responses!A:Z, Responses!B:B="Mackle")`.

---

## Reset control

A **hidden long-press** target sits in the bottom-left corner. Press and hold ~1 second and a
**"Reset the hunt & start over"** button appears — use it to restart a student's device or a
demo phone.

---

## Deploy the app

### Option A — open the local file
Open `index.html` in any phone/desktop browser. (The Sheet submission still needs a connection.)

### Option B — GitHub Pages (copy-paste)
1. Keep `index.html` in the repository and push.
2. On GitHub: **Settings ▸ Pages**.
3. Under **Source**, choose **Deploy from a branch**, pick your branch and folder **/ (root)**, **Save**.
4. After ~1 minute your link is `https://<username>.github.io/<repo>/`.
5. Open it on a phone, load once on wifi, then it runs offline (except the final save).

---

## Included extras
- Elapsed **timer** on the finish screen (feeds the "first done" prize)
- **Attempt counts** per station logged to the Sheet (a quick read on who struggled where)
- Gold **confetti burst** on completion

Division of labor: **the app gates, tags, and logs justifications + stats to your Sheet;
Showbie holds the photos.**
