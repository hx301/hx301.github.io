/* Password gate for the textbook download entry. */
(function () {
  'use strict';
  const lock = {"salt":"+bj5qUyYplJdpR8wIHS/wA==","iv":"VeY/LvPrjTM3UfZJ","ciphertext":"SfwKGAx0HJHJGTTSBuZ/Qkku1OoPNO+5QL617WQxp6R2jEXQBLrA0qYbcJzLHs8QGy9y4rmgR+oInvCR6SZNlNC7B6e4rlw=","iterations":210000};
  const dialog = document.getElementById('textbook-access-dialog');
  const openButton = document.querySelector('[data-textbook-open]');
  if (!dialog || !openButton) return;
  const form = document.getElementById('textbook-access-form');
  const input = document.getElementById('textbook-access-password');
  const submit = document.getElementById('textbook-access-submit');
  const status = document.getElementById('textbook-access-status');
  const english = document.documentElement.lang.toLowerCase().startsWith('en');
  const messages = english ? {
    checking: 'Checking password…',
    wrong: 'Incorrect password. Please try again.',
    ready: 'Verified. Opening ZJU Cloud Drive…',
    unavailable: 'Password verification is unavailable. Please use an up-to-date browser over HTTPS.'
  } : {
    checking: '正在验证密码……',
    wrong: '密码不正确，请重试。',
    ready: '验证通过，正在前往浙大云盘……',
    unavailable: '当前浏览器无法验证密码，请使用新版浏览器通过 HTTPS 打开本站。'
  };
  let version = 0;
  let busy = false;
  const decode = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));
  function reset() {
    version += 1;
    busy = false;
    form.reset();
    input.removeAttribute('aria-invalid');
    submit.disabled = false;
    status.textContent = '';
  }
  openButton.addEventListener('click', () => {
    reset();
    dialog.showModal();
    input.focus();
  });
  document.getElementById('textbook-access-cancel').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', reset);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || !input.value) return;
    if (!window.crypto || !window.crypto.subtle) {
      status.textContent = messages.unavailable;
      return;
    }
    busy = true;
    const attempt = ++version;
    submit.disabled = true;
    input.removeAttribute('aria-invalid');
    status.textContent = messages.checking;
    try {
      const material = await window.crypto.subtle.importKey(
        'raw', new TextEncoder().encode(input.value), 'PBKDF2', false, ['deriveKey']
      );
      const key = await window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: decode(lock.salt), iterations: lock.iterations, hash: 'SHA-256' },
        material, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
      );
      const plaintext = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: decode(lock.iv) }, key, decode(lock.ciphertext)
      );
      const target = new URL(new TextDecoder().decode(plaintext));
      if (target.protocol !== 'https:' || target.hostname !== 'pan.zju.edu.cn') throw new Error('Invalid destination');
      if (attempt !== version || !dialog.open) return;
      input.value = '';
      status.textContent = messages.ready;
      window.location.assign(target.href);
    } catch (error) {
      if (attempt !== version || !dialog.open) return;
      status.textContent = messages.wrong;
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      input.select();
    } finally {
      if (attempt === version) {
        busy = false;
        submit.disabled = false;
      }
    }
  });
})();
