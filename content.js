const LIMIT = 20000;

console.log("ChatGPT Paste Zip loaded");

waitForTextarea();

function waitForTextarea() {

    const observer = new MutationObserver(() => {

        const textarea = document.querySelector("textarea");

        if (textarea && !textarea.dataset.zipListenerAttached) {

            textarea.dataset.zipListenerAttached = "true";

            console.log("Attaching paste handler");

            textarea.addEventListener("paste", handlePaste);

        }

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

async function handlePaste(event) {

    const pastedText = event.clipboardData.getData("text");

    if (!pastedText) return;

    if (pastedText.length < LIMIT) return;

    event.preventDefault();

    console.log("Large paste detected. Compressing...");

    const zip = new JSZip();

    zip.file("pasted_text.txt", pastedText);

    const blob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE"
    });

    const file = new File(
        [blob],
        "chatgpt_paste.zip",
        { type: "application/zip" }
    );

    uploadFile(file);

    replacePrompt();

}

function uploadFile(file) {

    const input = document.querySelector('input[type="file"]');

    if (!input) {
        console.log("Upload input not found yet.");
        return;
    }

    const dt = new DataTransfer();
    dt.items.add(file);

    input.files = dt.files;

    input.dispatchEvent(new Event("change", { bubbles: true }));

}

function replacePrompt() {

    const textarea = document.querySelector("textarea");

    if (!textarea) return;

    textarea.value =
        "I uploaded a compressed archive containing the pasted data. Please analyze it.";

}
