/* Shared language links and compatibility for bookmarks made before the split. */
(() => {
  'use strict';
  const routes = {"zh": {"classroom": "notes.html", "textbook": "textbook.html", "textbook-notes": "textbook.html", "textbook-download": "textbook.html#textbook-download", "story": "story.html#story", "retell": "story.html#retell", "main": "index.html", "top": "index.html", "lesson-01": "lesson-01.html", "ai-lesson-01": "lesson-01.html#ai-lesson-01", "ai-lesson-01-title": "lesson-01.html#ai-lesson-01-title", "book-01": "chapter-01.html", "ai-book-01": "chapter-01.html#ai-book-01", "ai-book-01-title": "chapter-01.html#ai-book-01-title", "lesson-02": "lesson-02.html", "ai-lesson-02": "lesson-02.html#ai-lesson-02", "ai-lesson-02-title": "lesson-02.html#ai-lesson-02-title", "book-02": "chapter-02.html", "ai-book-02": "chapter-02.html#ai-book-02", "ai-book-02-title": "chapter-02.html#ai-book-02-title", "lesson-03": "lesson-03.html", "ai-lesson-03": "lesson-03.html#ai-lesson-03", "ai-lesson-03-title": "lesson-03.html#ai-lesson-03-title", "book-03": "chapter-03.html", "ai-book-03": "chapter-03.html#ai-book-03", "ai-book-03-title": "chapter-03.html#ai-book-03-title", "lesson-04": "lesson-04.html", "ai-lesson-04": "lesson-04.html#ai-lesson-04", "ai-lesson-04-title": "lesson-04.html#ai-lesson-04-title", "book-04": "chapter-04.html", "ai-book-04": "chapter-04.html#ai-book-04", "ai-book-04-title": "chapter-04.html#ai-book-04-title", "lesson-05": "lesson-05.html", "ai-lesson-05": "lesson-05.html#ai-lesson-05", "ai-lesson-05-title": "lesson-05.html#ai-lesson-05-title", "book-05": "chapter-05.html", "ai-book-05": "chapter-05.html#ai-book-05", "ai-book-05-title": "chapter-05.html#ai-book-05-title", "lesson-06": "lesson-06.html", "ai-lesson-06": "lesson-06.html#ai-lesson-06", "ai-lesson-06-title": "lesson-06.html#ai-lesson-06-title", "book-06": "chapter-06.html", "ai-book-06": "chapter-06.html#ai-book-06", "ai-book-06-title": "chapter-06.html#ai-book-06-title", "lesson-07": "lesson-07.html", "ai-lesson-07": "lesson-07.html#ai-lesson-07", "ai-lesson-07-title": "lesson-07.html#ai-lesson-07-title", "book-07": "chapter-07.html", "ai-book-07": "chapter-07.html#ai-book-07", "ai-book-07-title": "chapter-07.html#ai-book-07-title", "lesson-08": "lesson-08.html", "ai-lesson-08": "lesson-08.html#ai-lesson-08", "ai-lesson-08-title": "lesson-08.html#ai-lesson-08-title", "book-08": "chapter-08.html", "ai-book-08": "chapter-08.html#ai-book-08", "ai-book-08-title": "chapter-08.html#ai-book-08-title", "story-title": "story.html#story-title", "video-story": "story.html#video-story", "story-video": "story.html#story-video", "video-download": "story.html#video-download", "introduction": "story.html#introduction", "algae": "story.html#algae", "taxonomy-caption": "story.html#taxonomy-caption", "bloom": "story.html#bloom", "ecology": "story.html#ecology", "occurrence": "story.html#occurrence", "prevention": "story.html#prevention", "frontier": "story.html#frontier", "paper-figure-1": "story.html#paper-figure-1", "remote-method-title": "story.html#remote-method-title", "paper-figure-2": "story.html#paper-figure-2", "paper-figure-3": "story.html#paper-figure-3", "conclusion": "story.html#conclusion", "references": "story.html#references", "references-title": "story.html#references-title", "ref-noaa": "story.html#ref-noaa", "ref-epa": "story.html#ref-epa", "ref-causes": "story.html#ref-causes", "ref-control": "story.html#ref-control", "ref-whoi": "story.html#ref-whoi", "ref-dai-2023": "story.html#ref-dai-2023", "ai-story": "story.html#ai-story", "ai-story-title": "story.html#ai-story-title", "retell-form": "story.html#retell-form", "reviewer": "story.html#reviewer", "retell-date": "story.html#retell-date", "retell-text": "story.html#retell-text", "save-retell": "story.html#save-retell", "print-retell": "story.html#print-retell", "retell-status": "story.html#retell-status"}, "en": {"classroom": "notes-en.html", "textbook": "textbook-en.html", "textbook-notes": "textbook-en.html", "textbook-download": "textbook-en.html#textbook-download", "story": "story-en.html#story", "retell": "story-en.html#retell", "main": "en.html", "top": "en.html", "lesson-01": "lesson-01-en.html", "ai-lesson-01": "lesson-01-en.html#ai-lesson-01", "ai-lesson-01-title": "lesson-01-en.html#ai-lesson-01-title", "book-01": "chapter-01-en.html", "ai-book-01": "chapter-01-en.html#ai-book-01", "ai-book-01-title": "chapter-01-en.html#ai-book-01-title", "lesson-02": "lesson-02-en.html", "ai-lesson-02": "lesson-02-en.html#ai-lesson-02", "ai-lesson-02-title": "lesson-02-en.html#ai-lesson-02-title", "book-02": "chapter-02-en.html", "ai-book-02": "chapter-02-en.html#ai-book-02", "ai-book-02-title": "chapter-02-en.html#ai-book-02-title", "lesson-03": "lesson-03-en.html", "ai-lesson-03": "lesson-03-en.html#ai-lesson-03", "ai-lesson-03-title": "lesson-03-en.html#ai-lesson-03-title", "book-03": "chapter-03-en.html", "ai-book-03": "chapter-03-en.html#ai-book-03", "ai-book-03-title": "chapter-03-en.html#ai-book-03-title", "lesson-04": "lesson-04-en.html", "ai-lesson-04": "lesson-04-en.html#ai-lesson-04", "ai-lesson-04-title": "lesson-04-en.html#ai-lesson-04-title", "book-04": "chapter-04-en.html", "ai-book-04": "chapter-04-en.html#ai-book-04", "ai-book-04-title": "chapter-04-en.html#ai-book-04-title", "lesson-05": "lesson-05-en.html", "ai-lesson-05": "lesson-05-en.html#ai-lesson-05", "ai-lesson-05-title": "lesson-05-en.html#ai-lesson-05-title", "book-05": "chapter-05-en.html", "ai-book-05": "chapter-05-en.html#ai-book-05", "ai-book-05-title": "chapter-05-en.html#ai-book-05-title", "lesson-06": "lesson-06-en.html", "ai-lesson-06": "lesson-06-en.html#ai-lesson-06", "ai-lesson-06-title": "lesson-06-en.html#ai-lesson-06-title", "book-06": "chapter-06-en.html", "ai-book-06": "chapter-06-en.html#ai-book-06", "ai-book-06-title": "chapter-06-en.html#ai-book-06-title", "lesson-07": "lesson-07-en.html", "ai-lesson-07": "lesson-07-en.html#ai-lesson-07", "ai-lesson-07-title": "lesson-07-en.html#ai-lesson-07-title", "book-07": "chapter-07-en.html", "ai-book-07": "chapter-07-en.html#ai-book-07", "ai-book-07-title": "chapter-07-en.html#ai-book-07-title", "lesson-08": "lesson-08-en.html", "ai-lesson-08": "lesson-08-en.html#ai-lesson-08", "ai-lesson-08-title": "lesson-08-en.html#ai-lesson-08-title", "book-08": "chapter-08-en.html", "ai-book-08": "chapter-08-en.html#ai-book-08", "ai-book-08-title": "chapter-08-en.html#ai-book-08-title", "story-title": "story-en.html#story-title", "video-story": "story-en.html#video-story", "story-video": "story-en.html#story-video", "video-download": "story-en.html#video-download", "introduction": "story-en.html#introduction", "algae": "story-en.html#algae", "bloom": "story-en.html#bloom", "ecology": "story-en.html#ecology", "occurrence": "story-en.html#occurrence", "prevention": "story-en.html#prevention", "frontier": "story-en.html#frontier", "paper-figure-1": "story-en.html#paper-figure-1", "remote-method-title": "story-en.html#remote-method-title", "paper-figure-2": "story-en.html#paper-figure-2", "paper-figure-3": "story-en.html#paper-figure-3", "conclusion": "story-en.html#conclusion", "references": "story-en.html#references", "ref-dai-2023": "story-en.html#ref-dai-2023", "ai-story": "story-en.html#ai-story", "ai-story-title": "story-en.html#ai-story-title", "retell-form": "story-en.html#retell-form", "reviewer": "story-en.html#reviewer", "retell-date": "story-en.html#retell-date", "retell-text": "story-en.html#retell-text", "save-retell": "story-en.html#save-retell", "print-retell": "story-en.html#print-retell", "retell-status": "story-en.html#retell-status"}};
  const body = document.body;
  let english = document.documentElement.lang.startsWith('en');
  const current = new URL(location.href);
  const alias = body.dataset.frameAlias;
  if (alias === 'course') {
    let saved = 'zh';
    try { saved = localStorage.getItem('ocean-language') || 'zh'; } catch {}
    english = (current.searchParams.get('lang') || saved) === 'en';
  }
  const language = english ? 'en' : 'zh';
  const suffix = english ? '-en' : '';
  try { localStorage.setItem('ocean-language', language); } catch {}
  document.querySelectorAll('.frame-nav [data-section]').forEach(link => {
    link.href = './' + link.dataset.section + suffix + '.html';
  });
  document.querySelectorAll('[data-language-link]').forEach(link => {
    link.addEventListener('click', () => {
      try { localStorage.setItem('ocean-language', english ? 'zh' : 'en'); } catch {}
    });
  });
  function resolveBookmark() {
    let hash = '';
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    let target;
    if (alias === 'course') {
      const entries = {
        'geostrophic-calculations': 'geostrophic-calculations.html?lang=' + language,
        'ocean-dynamics-five': 'ocean-dynamics-homework.html?lang=' + language,
        'geostrophic-current': 'geostrophic.html?lang=' + language,
        'eof-method': 'eof.html?lang=' + language,
        'mixed-layer-homework': 'homework-mixed-layer' + suffix + '.html',
        'heat-budget-homework': 'homework-heat-budget' + suffix + '.html',
        'phytoplankton-blooms': 'story' + suffix + '.html'
      };
      target = entries[hash.replace(/^entry\//, '')];
      if (!target) target = ({
        assignments: 'homework' + suffix + '.html',
        tickets: 'notes' + suffix + '.html',
        research: 'story' + suffix + '.html'
      })[hash] || (english ? 'en.html' : 'index.html');
    } else if (alias === 'home' && !['main', 'top', 'ai-disclosure', 'ai-disclosure-title'].includes(hash)) {
      target = routes[language][hash];
    }
    if (target) {
      location.replace(new URL('./' + target, location.href).href);
      return;
    }
    const anchor = document.getElementById(hash);
    if (anchor) {
      for (let parent = anchor.parentElement; parent; parent = parent.parentElement) {
        if (parent.tagName === 'DETAILS') parent.open = true;
      }
    }
  }
  resolveBookmark();
  window.addEventListener('hashchange', resolveBookmark);
})();
