document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  const listEl = document.getElementById('starred-list');

  async function load() {
    try {
      const res = await fetch('events.json', {cache: 'no-store'});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      render(data);
    } catch (err) {
      status.textContent = 'Failed to load starred repositories.';
      console.error(err);
    }
  }

  function render(events){
    if (!Array.isArray(events) || events.length === 0){
      status.textContent = '';
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'No starred repositories found.';
      listEl.parentElement.appendChild(empty);
      return;
    }

    status.textContent = '';
    listEl.innerHTML = '';

    events.forEach(ev => {
      const repo = ev.repo || {};
      const li = document.createElement('li');
      li.className = 'repo-card';

      const info = document.createElement('div');
      info.className = 'repo-info';

      const a = document.createElement('a');
      a.className = 'repo-title';
      a.href = repo.html_url || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = repo.name || 'unknown';

      const desc = document.createElement('div');
      desc.className = 'repo-desc';
      desc.textContent = repo.description || '';

      const meta = document.createElement('div');
      meta.className = 'repo-meta';
      const lang = document.createElement('span');
      lang.className = 'small';
      lang.textContent = repo.language ? `Language: ${repo.language}` : '';

      const stars = document.createElement('span');
      stars.className = 'small';
      stars.textContent = (typeof repo.stars === 'number') ? `★ ${repo.stars}` : '';

      const when = document.createElement('span');
      when.className = 'small';
      if (ev.starred_at) {
        const d = new Date(ev.starred_at);
        when.textContent = `Starred: ${d.toLocaleString()}`;
      }

      meta.appendChild(lang);
      if (stars.textContent) meta.appendChild(stars);
      if (when.textContent) meta.appendChild(when);

      info.appendChild(a);
      if (desc.textContent) info.appendChild(desc);
      info.appendChild(meta);

      li.appendChild(info);
      listEl.appendChild(li);
    });
  }

  load();
});
