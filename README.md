# The Bible Hunt

A gated, self-checking Scripture scavenger hunt for student phones (Prayer · Unit 2).
Single file, no build step, no dependencies. **Many students can use it at the same time** —
each phone tracks its own progress, so there's no conflict no matter how many run it at once.

At the start each student picks their **teacher** (Lastres, Mackle, Vazquez), their **block**
(1–8), and types their **name**. Then they work through **6 Bible stations in a fixed order**;
each must be completed correctly before the next unlocks:

1. **Find the verse** (reference + one-line context) in the Bible
2. **Gate word** — copy a word *straight from the verse* (the prompt quotes the line with one word blanked out, so they can't answer from memory). Case-insensitive, punctuation ignored, unlimited retries.
3. **ACTS choice** — tap the type of prayer
4. **Justification** — after they get ACTS right, they type a one-sentence justification; submitting it **unlocks the next clue**

Justifications and stats are saved on the phone and sent **once** to your Google Sheet when the
student finishes all 6. Progress is saved (`localStorage`), so a refresh keeps their place.

---

## ⚠ Before class — verify the gate words

The 6 gate words must match your **class RSV-2CE Bible**. Open `index.html` and check
the `STATIONS` array near the top (clearly commented):

Each gate word is now a word the student **copies straight from the verse** (the prompt quotes
the line with one word blanked out):

| Station | Reference | Gate word (copied from verse) | ACTS answer |
|---|---|---|---|
| 1 · Abraham | Genesis 22:2 | `Moriah` — "…go to the land of ____" | Adoration |
| 2 · Moses | Exodus 32:11 | `Egypt` — "…out of the land of ____" | Supplication |
| 3 · David | Psalm 51:1 | `mercy` — "Have ____ on me, O God…" | Contrition |
| 4 · Jonah (keystone) | Jonah 2:9 | `Lord` — "Deliverance belongs to the ____" | Thanksgiving + Supplication |
| 5 · Elijah | 1 Kings 19:12 | `voice` — "…a still small ____" | Adoration **or** "It doesn't fit neatly" |
| 6 · The Shema | Deuteronomy 6:4 | `one` — "…the Lord is ____" | Adoration **or** "It doesn't fit neatly" |

**Because the answer is copied from the exact wording, verify each against your RSV-2CE Bible** —
if a word or phrasing differs, update the `gatePrompt` and `gateWord` in the settings block at
the top of `index.html`. To edit a station, teacher, or block list, change only the values in
that block — no logic below needs touching.

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
   - Open the app on one phone, complete all 6 stations, and watch a row appear in the
     **Responses** tab of your Sheet. Each student = one row, with their teacher, block,
     name, total time, and — for every station — their justification, ACTS answer, and how
     many attempts they took.

### Troubleshooting — "the Sheet isn't updating"

Because browsers only allow the app to send data in "no-cors" mode, **the app cannot see whether
Google accepted the data** — so it always shows "✓ Saved" even if the write was refused. That
means an empty Sheet is almost always a *deployment* problem, not an app problem. Work through
these in order:

1. **Open the `/exec` URL in a browser** (paste it into a new tab). You should see:
   `OK — receiver is running and connected to: "…".`
   - If you see a **Google sign-in page** or **"You need permission"** → the deployment access is
     wrong. Fix: **Deploy ▸ Manage deployments ▸** (edit ✏) **▸ Who has access: Anyone ▸ Deploy.**
   - If you see **"cannot reach a Sheet"** → the script isn't bound to your Sheet. Open the SHEET
     from Drive, use **Extensions ▸ Apps Script**, OR paste your Sheet ID into the `SHEET_ID`
     line at the top of `google-apps-script.gs`.
2. **Re-deploy after any code change.** Editing the script does NOT update the live URL by itself.
   Do **Deploy ▸ Manage deployments ▸** (edit ✏) **▸ Version: New version ▸ Deploy.** The `/exec`
   URL stays the same.
3. **Execute as: Me**, **Who has access: Anyone** — both must be set on the deployment.
4. **Re-test cleanly.** The app remembers it already sent for a given student, so after fixing the
   deployment, **reset before re-testing**: long-press the bottom-left corner ▸ *Reset the hunt*,
   then complete the hunt again. (Or clear the site's data in your browser.)
5. **Confirm you're testing the deployed app that has the URL in it** — the copy on GitHub Pages,
   not an older local file where `SHEET_ENDPOINT` is still `""`.

**Notes**
   - Sending the data needs a connection at the finish. Finding/gating still works offline;
     if a student has no signal at the end, the app shows a **"Try again"** button.
   - "Who has access: Anyone" means anyone with the `/exec` URL can post to the Sheet. That's
     fine for a classroom; just don't publish the URL publicly. To rotate it, create a new
     deployment and paste the new URL.
   - Want live filtering by teacher/block? In the Sheet use **Data ▸ Create a filter**, or
     make per-teacher views with a formula like `=FILTER(Responses!A:Z, Responses!B:B="Mackle")`.

---

## Adding an illustration to each station

Each station can show a picture (artwork of Abraham, Moses, etc.) on its card. It's optional —
leave it blank and the card just shows text. If an image path is wrong or won't load, the app
hides it automatically, so a mistake never breaks the station.

**Easiest way (recommended): an `images/` folder in the repo**

1. Find or make 6 images (JPG or PNG). Landscape works best; ~800–1200px wide keeps them sharp
   without being huge. Good free sources: [Wikimedia Commons](https://commons.wikimedia.org)
   (classic paintings of these scenes are public domain), [Unsplash](https://unsplash.com), or
   [Pexels](https://pexels.com). Keep each file under ~1 MB so phones load fast.
2. In this repo, create a folder called **`images`** and put the files in it. Name them simply,
   e.g. `abraham.jpg`, `moses.jpg`, `david.jpg`, `jonah.jpg`, `elijah.jpg`, `shema.jpg`.
   (On GitHub you can do this in the browser: **Add file ▸ Upload files**, then type
   `images/` in front of the filename to create the folder.)
3. In `index.html`, find each station's `image:""` line in the settings block and fill in the
   path:
   ```js
   figure:"Abraham",
   image:"images/abraham.jpg",
   ```
4. Save/push. Done — the picture shows at the top of that station's card.

**Alternatives**
- **Paste a web link:** set `image:"https://…/picture.jpg"` to a directly-hosted image URL.
  (Note: ordinary Google Drive/Photos "share" links usually *don't* work as direct image URLs.)
- **Embed it in the file (no folder needed):** convert an image to a "data URI" at a site like
  [base64-image.de](https://www.base64-image.de/), then paste the whole `data:image/...` string
  as the `image` value. This keeps everything in the single `index.html`, but makes the file
  large — fine for one or two small images.

Sizing/shape is handled for you (each image is shown in a rounded 170px-tall banner, cropped to
fit), so images of different dimensions still look consistent.

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

The app gates each station, tags the prayer type, and logs justifications + stats to your Sheet.
