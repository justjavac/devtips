export function initCopy() {
  document.addEventListener('click', async (event) => {
    const codeButton = event.target.closest('[data-copy]');
    if (codeButton) {
      const code = codeButton.closest('.code-block')?.querySelector('pre code');
      if (!code) return;
      await writeText(code.innerText);
      flash(codeButton);
      return;
    }

    const markdownButton = event.target.closest('[data-copy-markdown]');
    if (markdownButton) {
      try {
        const res = await fetch(markdownButton.getAttribute('data-copy-markdown'));
        if (!res.ok) throw new Error('fetch failed');
        await writeText(await res.text());
        flash(markdownButton);
      } catch {
        markdownButton.classList.add('is-failed');
        setTimeout(() => markdownButton.classList.remove('is-failed'), 1500);
      }
    }
  });
}

async function writeText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
}

function flash(button) {
  button.classList.add('is-copied');
  setTimeout(() => button.classList.remove('is-copied'), 1500);
}
