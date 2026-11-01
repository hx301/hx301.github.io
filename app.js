(() => {
  'use strict';
  const L = window.L;
  const kinds = {
    all: { title: L('课程内容'), description: L('让每一次学习，都有迹可循。') },
    assignments: { title: L('作业'), description: L('在推导与练习中，把知识变成自己的理解。'), empty: L('第一份作业，准备中'), hint: L('课程练习、推导过程与报告将在这里整理与分享。') },
    research: { title: L('研究主题'), description: L('从一个值得追问的问题，开始更深入的探索。'), empty: L('下一个问题，值得探索'), hint: L('研究选题、文献阅读与阶段性思考将在这里汇集。') },
    tickets: { title: L('出门票'), description: L('每次课后，记下一点收获，带走一个问题。'), empty: L('第一张出门票，待记录'), hint: L('课后的学习收获、尚存的疑问与下一步计划将在这里记录。') }
  };
  const $ = id => document.getElementById(id);
  const lessonPages = { 'phytoplankton-blooms': './index.html#story', 'eof-method': './eof.html', 'geostrophic-current': './geostrophic.html', 'ocean-dynamics-five': './ocean-dynamics-homework.html', 'geostrophic-calculations': './geostrophic-calculations.html', 'mixed-layer-homework': window.COURSE_LANG === 'en' ? './homework-mixed-layer-en.html' : './homework-mixed-layer.html', 'heat-budget-homework': window.COURSE_LANG === 'en' ? './homework-heat-budget-en.html' : './homework-heat-budget.html' };
  const text = (tag, value, className) => { const node = document.createElement(tag); node.textContent = value; if (className) node.className = className; return node; };
  function linkArrow() { const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('class','inline-arrow'); svg.setAttribute('aria-hidden','true'); const p=document.createElementNS('http://www.w3.org/2000/svg','path'); p.setAttribute('d','m7 17 10-10M7 7h10v10'); svg.append(p); return svg; }
  const data = window.COURSE_DATA;
  const dataValid = !!data && Array.isArray(data.entries);
  const entries = dataValid ? data.entries.filter(e => e && typeof e.id === 'string' && e.id && ['assignments','research','tickets'].includes(e.category) && typeof e.title === 'string' && e.published !== false) : [];
  let category = 'all';
  let lastListRoute = '#all';
  const counts = Object.fromEntries(Object.keys(kinds).map(k => [k, k === 'all' ? entries.length : entries.filter(e => e.category === k).length]));
  document.querySelectorAll('[data-count]').forEach(el => { el.textContent = counts[el.dataset.count]; });

  // Authored mathematical line field, decorative rather than observational data.
  const ns = 'http://www.w3.org/2000/svg';
  const field = $('line-field'); const flow = $('flow-field');
  for (let i = 0; i < 37; i++) {
    const offset = i * 14 - 70;
    const d = `M -80 ${offset + 250} C 130 ${offset + 205}, 188 ${offset - 10}, 372 ${offset + 60} S 607 ${offset + 308}, 940 ${offset + 110}`;
    const line = document.createElementNS(ns, 'path'); line.setAttribute('d', d); line.setAttribute('stroke', i % 5 === 0 ? '#84d4df' : '#b1e5e9'); line.setAttribute('opacity', i % 5 === 0 ? '.48' : '.20'); field.append(line);
    if (i % 7 === 0) { const moving = document.createElementNS(ns, 'path'); moving.setAttribute('d', d); moving.setAttribute('stroke', '#e4ffff'); moving.setAttribute('opacity', '.5'); moving.setAttribute('class', 'flow-line'); moving.style.animationDelay = `${-i * 1.4}s`; flow.append(moving); }
  }

  function validDate(value) { return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) ? value : ''; }
  function sortEntries(list) { return [...list].sort((a,b) => ($('sort').value === 'oldest' ? 1 : -1) * validDate(a.date).localeCompare(validDate(b.date))); }
  function updateNav(route) {
    document.querySelectorAll('[data-nav]').forEach(a => { if (a.dataset.nav === route) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    document.querySelectorAll('.category-entry').forEach(a => { if (a.hash === `#${category}`) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    document.querySelectorAll('[data-filter]').forEach(a => { if(a.dataset.filter === category) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current'); });
  }
  function renderList() {
    const term = $('search').value.trim().toLocaleLowerCase('zh-CN');
    const selected = sortEntries(entries.filter(e => (category === 'all' || e.category === category) && [e.title,e.summary,e.body,e.searchOriginal,...(Array.isArray(e.tags) ? e.tags : [])].join(' ').toLocaleLowerCase('zh-CN').includes(term)));
    $('content-list').replaceChildren();
    for (const entry of selected) {
      const row = text('article', '', 'content-row');
      const date = text('time', validDate(entry.date) || L('未标注日期'),'content-date'); if(validDate(entry.date)) date.dateTime = entry.date; row.append(date);
      const main = text('div',''); const title = text('h3',''); const link = text('a',entry.title); link.href = lessonPages[entry.id] || `#entry/${encodeURIComponent(entry.id)}`; title.append(link); main.append(title);
      if (entry.summary) main.append(text('p',entry.summary,'content-summary'));
      if (Array.isArray(entry.tags) && entry.tags.length) { const tags = text('div','','content-tags'); entry.tags.forEach(t => tags.append(text('span',`# ${t}`))); main.append(tags); }
      row.append(main,text('span',kinds[entry.category].title,'content-kind')); $('content-list').append(row);
    }
    $('collection-title').textContent = kinds[category].title;
    $('collection-description').textContent = kinds[category].description;
    $('empty-state').hidden = selected.length > 0;
    $('empty-title').textContent = !dataValid ? L('课程内容暂时未能加载') : term ? L('没有找到相关内容') : kinds[category].empty || L('第一份记录，正在路上');
    $('empty-description').textContent = !dataValid ? L('请刷新页面重试；如果仍未恢复，请稍后再来。') : term ? (window.COURSE_LANG==='en'?`No matches for “${$('search').value.trim()}”. Try a shorter keyword.`:`没有与“${$('search').value.trim()}”匹配的记录，试试更短的关键词。`) : kinds[category].hint || '作业、研究主题和课后出门票将在这里陆续整理与分享。';
    $('empty-note').hidden = !!term || !dataValid;
    $('clear-search').hidden = !term;
    $('content-status').textContent = L(`显示 ${selected.length} 条${category === 'all' ? '课程内容' : kinds[category].title}`,`${selected.length} notes shown`);
  }

  // A deliberately small, safe text renderer: headings, lists, fenced code and paragraphs.
  function renderBody(body, destination) {
    destination.replaceChildren(); const lines = String(body || '').replace(/\r\n/g,'\n').split('\n');
    let paragraph = []; let list = null; let code = null;
    const flush = () => { if (paragraph.length) { destination.append(text('p',paragraph.join('\n'))); paragraph = []; } };
    for (const line of lines) {
      if (line.startsWith('```')) { flush(); list = null; if(code) { const pre = text('pre',''); pre.append(text('code',code.join('\n'))); destination.append(pre); code = null; } else code = []; continue; }
      if(code) { code.push(line); continue; }
      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      const bullet = line.match(/^[-*]\s+(.+)$/);
      if(heading) { flush(); list = null; destination.append(text(heading[1].length < 3 ? 'h2' : 'h3',heading[2])); }
      else if(bullet) { flush(); if(!list) { list = document.createElement('ul'); destination.append(list); } list.append(text('li',bullet[1])); }
      else if(!line.trim()) { flush(); list = null; }
      else { list = null; paragraph.push(line); }
    }
    flush(); if(code) { const pre = text('pre',''); pre.append(text('code',code.join('\n'))); destination.append(pre); }
    if(!String(body || '').trim()) destination.append(text('p',L('正文尚待补充。')));
  }

  function safeResource(value) {
    if(typeof value !== 'string' || !value.trim()) return null;
    const raw = value.trim();
    if(/^https?:\/\//i.test(raw)) { try { const u = new URL(raw); return ['http:','https:'].includes(u.protocol) ? u.href : null; } catch { return null; } }
    if(raw.startsWith('./files/') || raw.startsWith('files/')) { const parts = raw.replace(/^\.\//,'').split('/'); if(parts.some(p => p === '..') || /[\\\x00-\x1f]/.test(raw)) return null; return raw; }
    return null;
  }
  function showEntry(id) {
    if (lessonPages[id]) { window.location.assign(lessonPages[id]); return; }
    const entry = entries.find(e => e.id === id); $('home-view').hidden = true; $('reader-view').hidden = false;
    $('article-contents').hidden = true; $('article-contents-list').replaceChildren();
    $('article-meta').replaceChildren(); $('article-body').replaceChildren(); $('attachment-list').replaceChildren(); $('article-files').hidden = true; $('article-summary').hidden = false;
    $('reader-back').href = lastListRoute;
    if(!entry) { $('article-title').textContent = L('这条内容还没有发布'); $('article-summary').textContent = L('链接可能已变更，或内容暂时不可用。请返回课程列表继续浏览。'); $('reader-category').href = '#all'; $('reader-category').textContent = L('浏览课程内容'); document.title = L('内容未找到 · 描述性物理海洋课程网站'); }
    else {
      category = entry.category; updateNav(category);
      $('article-title').textContent = entry.title; $('article-summary').textContent = entry.summary || ''; $('article-summary').hidden = !entry.summary;
      $('article-meta').append(text('span',kinds[entry.category].title)); if(validDate(entry.date)) { const date = text('time',entry.date); date.dateTime = entry.date; $('article-meta').append(date); }
      renderBody(entry.body,$('article-body'));
      const headings = [...$('article-body').querySelectorAll('h2')];
      if(headings.length > 1) {
        $('article-contents').hidden = false;
        for(const heading of headings) {
          const item = text('li',''); const jump = text('button',heading.textContent);
          jump.type = 'button';
          jump.addEventListener('click',() => {
            heading.tabIndex = -1;
            heading.focus({preventScroll:true});
            heading.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
          });
          item.append(jump); $('article-contents-list').append(item);
        }
      }
      for(const file of (Array.isArray(entry.attachments) ? entry.attachments : [])) { const url = safeResource(file.url); if(!url) continue; const a = text('a',file.name || L('查看资料'),'attachment-link'); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.append(linkArrow()); $('attachment-list').append(a); }
      $('article-files').hidden = !$('attachment-list').children.length;
      $('reader-category').href = `#${entry.category}`; $('reader-category').textContent = L(`浏览全部${kinds[entry.category].title}`,`Browse ${kinds[entry.category].title.toLowerCase()}`); $('reader-category').append(linkArrow());
      document.title = `${entry.title} · ${L('描述性物理海洋课程网站')}`;
    }
    window.scrollTo({top:0,behavior:'instant'}); $('article-title').focus({preventScroll:true});
  }
  function route(initial = false) {
    const hash = location.hash.slice(1) || 'home';
    if(hash === 'assignments') { location.replace(window.COURSE_LANG === 'en' ? './homework-en.html' : './homework.html'); return; }
    if(hash === 'main') { $('main').focus(); return; }
    $('site-nav').classList.remove('is-open'); document.querySelector('.menu-toggle').setAttribute('aria-expanded','false'); document.querySelector('.menu-toggle').setAttribute('aria-label',L('打开导航菜单'));
    if(hash.startsWith('entry/')) { let id; try { id=decodeURIComponent(hash.slice(6)); } catch { id=''; } showEntry(id); return; }
    $('home-view').hidden = false; $('reader-view').hidden = true; $('article-summary').hidden = false;
    category = Object.hasOwn(kinds,hash) ? hash : 'all'; lastListRoute = `#${category}`; renderList();
    updateNav(hash === 'about' ? 'about' : category === 'all' ? 'home' : category);
    document.title = (category === 'all' ? '' : `${kinds[category].title} · `) + L('描述性物理海洋课程网站');
    if(hash === 'home' || !['all','assignments','research','tickets','about'].includes(hash)) { if(!initial) window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}); }
    else requestAnimationFrame(() => (hash === 'about' ? $('about') : $('collection')).scrollIntoView({behavior:initial || matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'}));
  }
  $('search').addEventListener('input',renderList); $('sort').addEventListener('change',renderList);
  $('clear-search').addEventListener('click',() => { $('search').value=''; renderList(); $('search').focus(); });
  document.querySelector('.menu-toggle').addEventListener('click',event => { const open = $('site-nav').classList.toggle('is-open'); event.currentTarget.setAttribute('aria-expanded',String(open)); event.currentTarget.setAttribute('aria-label',open?L('关闭导航菜单'):L('打开导航菜单')); });
  document.addEventListener('keydown',event => { if(event.key === 'Escape' && $('site-nav').classList.contains('is-open')) { $('site-nav').classList.remove('is-open'); const b=document.querySelector('.menu-toggle'); b.setAttribute('aria-expanded','false'); b.setAttribute('aria-label',L('打开导航菜单')); b.focus(); } });
  window.addEventListener('hashchange',() => route()); route(true);
})();
