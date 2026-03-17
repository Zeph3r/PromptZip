# PromptZip

PromptZip is a Chrome extension that compresses large pasted text into an archive that can be uploaded to ChatGPT for analysis.

The idea came from a simple observation:

ChatGPT can often analyze large files when they are uploaded as archives, even when the same content is too large to paste directly into a prompt.

PromptZip automates this process.

Instead of manually compressing files, the extension allows you to paste large text and convert it into a compressed archive instantly.

## Load unpacked

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select this folder

## Store submission

See **[STORE.md](./STORE.md)** for packaging, permission justifications, listing copy, and checklist.

- **Privacy:** [PRIVACY.md](./PRIVACY.md) — host the same text at a public URL for the store.
- **Third-party:** [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)

## Package for upload

```bash
./package-extension.sh
```

Produces `promptzip-store.zip` in the project root.
