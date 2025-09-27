document.addEventListener('click', e => {
  const btn = e.target.closest('.copy-button');
  if (!btn) return;

  // ищем код рядом
  const code = btn.closest('.bbCodeBlock, pre')?.querySelector('code, pre code');
  if (!code) {
    console.error('Код для копирования не найден');
    return;
  }

  const text = code.textContent.trim();
  copyText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = XF.phrases.text_copied_to_clipboard;
    setTimeout(() => btn.textContent = orig, 2000);
  }).catch(err => {
    console.error('Ошибка копирования в буфер:', err);
  });
});

// функция копирования с fallback
function copyText(text) {
  if (navigator.clipboard && location.protocol === 'https:') {
    return navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      console.error(err);
    }
    document.body.removeChild(ta);
    return success ? Promise.resolve() : Promise.reject('execCommand failed');
  }
}
