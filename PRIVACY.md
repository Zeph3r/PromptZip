# Privacy Policy

## PromptZip

**Last updated:** March 2026

PromptZip is a browser extension that compresses large pasted text into ZIP files so it can be uploaded to AI tools that support file uploads.

PromptZip is designed with a **local‑first architecture**. The extension does **not collect, store, or transmit personal data**.

---

# Data Collection

PromptZip **does not collect personal information**.

The extension:

* Does not track users
* Does not collect analytics
* Does not collect browsing history
* Does not collect prompts or pasted text
* Does not transmit data to external servers

All processing occurs **locally in the user's browser**.

---

# Text Processing

When using PromptZip:

* Text that you paste is processed **locally in your browser**
* The extension compresses the text into a `.zip` file
* The ZIP file is generated entirely on your device

PromptZip **never uploads or stores this content**.

---

# Permissions

PromptZip may request limited browser permissions required to function.

### Site access (ChatGPT domains)

PromptZip requests access to ChatGPT domains listed in the extension manifest (such as `https://chatgpt.com/*` and `https://chat.openai.com/*`). This is used **only** to:

* detect when you paste large text into the ChatGPT prompt box
* build a ZIP in your browser
* attach that ZIP via ChatGPT's file input

### Storage

Used to save local extension settings such as:

* paste size limit
* compression mode
* whether the extension is enabled
* optional message inserted after upload

These settings are stored **locally within the browser** using `chrome.storage` and are not sent to PromptZip servers.

---

# Third‑Party Services

PromptZip **does not use third‑party services**, analytics platforms, tracking scripts, or external APIs.

---

# Open Source

PromptZip is open source, allowing anyone to inspect the code and verify how the extension works.

Repository:

[https://github.com/Zeph3r/PromptZip](https://github.com/Zeph3r/PromptZip)

---

# Security

Because PromptZip processes data locally:

* No user data leaves the device
* No external servers are contacted
* No accounts are required

---

# Changes to This Policy

If future versions of PromptZip introduce features that affect data handling, this privacy policy will be updated accordingly.

---

# Contact

For questions regarding this privacy policy or the PromptZip extension, please open an issue in the GitHub repository:

[https://github.com/Zeph3r/PromptZip/issues](https://github.com/Zeph3r/PromptZip/issues)
