# Chrome Web Store — submission prep

## Before you upload

- [ ] **Developer account** — [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) ($5 one-time if not already enrolled).
- [ ] **ZIP package** — see [Packaging](#packaging) below (no `.git`, no junk).
- [ ] **Screenshots** — at least **1** (1280×800 or 640×400 recommended). Capture: popup open + short caption, or ChatGPT with extension enabled.
- [ ] **Privacy policy URL** — must be **publicly reachable**. Options:
  - GitHub: push `PRIVACY.md` and use *Raw* URL, or GitHub Pages.
  - Any static host with the same text as `PRIVACY.md`.
- [ ] **Icon** — `icons/icon128.png` is used on the store; already in repo.

## Manifest checks

| Field        | PromptZip |
|-------------|-----------|
| `manifest_version` | 3 |
| `name`      | PromptZip (under 75 chars) |
| `version`   | Bump per release |
| `description` | Under **132** chars (required) |
| `icons`     | 48 + 128 present |

## Permission justifications (paste into store form)

**`storage`**  
Used only to save your settings (paste threshold, compression mode, optional message after upload). No data is sent to our servers.

**Host permission — `https://chatgpt.com/*`, `https://www.chatgpt.com/*`, `https://chat.openai.com/*`**  
The extension runs only on these sites. It intercepts large pastes in the chat input, builds a ZIP in the browser, and attaches it via the page’s file input so you can send big text without hitting paste limits.

## Single purpose

PromptZip has one purpose: **when you paste oversized text into ChatGPT, it compresses it to a ZIP and attaches it automatically** (with optional replacement message). It does not modify other sites or collect browsing data.

## Store listing copy (edit as you like)

**Short description (max 132 chars)**  
```
Automatically zip large pastes on ChatGPT and attach them so you can analyze big text without paste limits.
```
*(~95 chars — room to tweak.)*

**Detailed description (excerpt)**  
```
PromptZip watches for pastes over a size you set on ChatGPT (chatgpt.com / chat.openai.com). When you paste a large block of text, it:

• Builds a ZIP in your browser (no upload to us)
• Attaches it through ChatGPT’s file picker
• Optionally inserts a short message you can customize—or leaves the box empty

Settings: threshold (characters), DEFLATE vs STORE, enable/disable, and custom post-upload message.

No accounts. No analytics. Settings sync with Chrome if you use sync.
```

**Category**  
Productivity or Developer Tools.

## Packaging

From the **project root** (folder that contains `manifest.json`):

```bash
# Creates promptzip-store.zip excluding common junk
zip -r promptzip-store.zip . \
  -x "*.git*" \
  -x "*node_modules*" \
  -x "*.DS_Store" \
  -x "*STORE.md" \
  -x "*terminals*"
```

Upload **promptzip.zip** (or rename) in the Developer Dashboard → *New item* → upload ZIP.

## After submission

- Review can take a few days.
- If rejected, read the reason; often it’s missing privacy URL or unclear permission use—reuse the justifications above.

## Third-party / attribution

See **THIRD_PARTY_NOTICES.md**. If your icon is from Flaticon’s free tier, add attribution in the detailed description or store “Additional fields” as their license requires.
