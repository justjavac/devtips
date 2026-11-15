export function initSearch() {
  const dialog = document.getElementById('search-dialog');
  const input = document.getElementById('search-input');
  const list = document.getElementById('search-results');
  if (!dialog || !input || !list) return;

  let indexPromise = null;
  let index = [];
  let matches = [];
  let active = -1;

  const loadIndex = () => {
    indexPromise ||= fetch('/search-index.json').then((res) => {
      if (!res.ok) throw new Error('search index unavailable');
      return res.json();
    });
    return indexPromise;
  };

  const escapeHtml = (text) =>
    text.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

  const highlight = (text, query) => {
    const escaped = escapeHtml(text);
    if (!query) return escaped;
    const q = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escaped.replace(new RegExp(`(${q})`, 'gi'), '<mark>$1</mark>');
  };

  function score(item, query) {
    let total = 0;
    if (item.title.toLowerCase().includes(query)) total += 3;
    if (item.tools.some((tool) => tool.toLowerCase().includes(query))) total += 2;
    if (item.tags.some((tag) => tag.toLowerCase().includes(query))) total += 2;
    if (item.categoryName.toLowerCase().includes(query)) total += 2;
    if (item.summary.toLowerCase().includes(query)) total += 1;
    return total;
  }

  function render() {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      matches = [];
      active = -1;
      list.innerHTML = '<li class="search-empty">输入关键词开始搜索</li>';
      return;
    }
    matches = index
      .map((item) => ({ item, score: score(item, query) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || b.item.publishedAt.localeCompare(a.item.publishedAt))
      .slice(0, 10)
      .map((entry) => entry.item);
    active = matches.length > 0 ? 0 : -1;
    if (matches.length === 0) {
      list.innerHTML = '<li class="search-empty">没有找到相关技巧</li>';
      return;
    }
    list.innerHTML = matches
      .map(
        (item, i) => `<li>
          <a href="/tips/${item.slug}/" class="search-item${i === active ? ' is-active' : ''}" data-index="${i}">
            <span class="search-item-title">${highlight(item.title, query)}</span>
            <span class="search-item-meta">${escapeHtml(item.categoryName)} · ${escapeHtml(item.tools.join(' / '))} · 实测于 ${item.verifiedAt}</span>
          </a>
        </li>`,
      )
      .join('');
  }

  function move(delta) {
    if (matches.length === 0) return;
    active = (active + delta + matches.length) % matches.length;
    list.querySelectorAll('.search-item').forEach((el, i) => {
      el.classList.toggle('is-active', i === active);
    });
    list.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }

  function open() {
    if (dialog.open) return;
    dialog.showModal();
    input.value = '';
    render();
    loadIndex()
      .then((data) => {
        index = data;
        render();
      })
      .catch(() => {
        list.innerHTML = '<li class="search-empty">搜索索引加载失败</li>';
      });
    requestAnimationFrame(() => input.focus());
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-search-open]')) {
      event.preventDefault();
      open();
    }
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && key === 'k') {
      event.preventDefault();
      if (dialog.open) dialog.close();
      else open();
      return;
    }
    const typing = /^(input|textarea|select)$/i.test(document.activeElement?.tagName ?? '');
    if (!typing && event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      open();
    }
  });

  input.addEventListener('input', render);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'Enter' && active >= 0 && matches[active]) {
      event.preventDefault();
      window.location.href = `/tips/${matches[active].slug}/`;
    }
  });
}
