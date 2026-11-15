export function initLoadMore() {
  const sentinel = document.getElementById('load-more');
  const list = document.getElementById('tip-list');
  if (!sentinel || !list) return;

  let loading = false;

  const observer = new IntersectionObserver(
    async (entries) => {
      if (!entries[0].isIntersecting || loading) return;
      loading = true;
      const next = Number(sentinel.dataset.next);
      try {
        const res = await fetch(`/page/${next}.json`);
        if (!res.ok) throw new Error('page unavailable');
        const data = await res.json();
        list.insertAdjacentHTML('beforeend', data.html);
        if (data.next) {
          sentinel.dataset.next = String(data.next);
        } else {
          observer.disconnect();
          sentinel.remove();
        }
      } catch {
        observer.disconnect();
        sentinel.textContent = '加载失败，请刷新重试';
      } finally {
        loading = false;
      }
    },
    { rootMargin: '240px' },
  );

  observer.observe(sentinel);
}
