# PromptZip

PromptZip is a Chrome extension that compresses large pasted text into an archive that can be uploaded to ChatGPT for analysis.

The idea came from a simple observation:

ChatGPT can often analyze large files when they are uploaded as archives, even when the same content is too large to paste directly into a prompt.

PromptZip automates this process.

Instead of manually compressing files, the extension allows you to paste large text and convert it into a compressed archive instantly.

## Example Use Cases

• Large documentation dumps  
• Long code snippets  
• Dataset analysis  
• Research notes  
• Large prompts that exceed typical paste limits  

## Example Test

Initial testing used a **225 KB dataset** consisting of repeated paragraphs.

Results:

Raw text: ~225 KB  
Compressed archive: dramatically smaller  
ChatGPT was able to analyze the contents successfully.

Further testing is planned with:

• code repositories  
• API documentation  
• larger datasets

## Roadmap

Future improvements may include:

- automatic prompt compression
- prompt chunking for very large datasets
- auto-decompression for shared compressed prompts

## Status

Early prototype.

More testing and improvements coming soon.
