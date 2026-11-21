  // --cell = content width / 48, measured (CSS 100vw counts the scrollbar). ?grid=48 shows the overlay.
  var root = document.documentElement, mainEl = document.querySelector('main');
  function cell() { if (mainEl) root.style.setProperty('--cell', (mainEl.clientWidth - 32) / 48 + 'px'); }
  cell(); addEventListener('resize', cell);
  if (/[?&]grid=48\b/.test(location.search)) root.classList.add('grid48');

  // Sample rail: chips filter by data-cat; dots page through 3 cards (2 on phones). Swipe / trackpad scroll works too.
  var rail = document.getElementById('samples');
  var dots = document.getElementById('dots');
  var chips = document.querySelectorAll('.chip');
  var vi = document.documentElement.lang === 'vi';
  function shown() { return [].filter.call(rail.querySelectorAll('.card'), function (c) { return !c.hidden; }); }
  function perPage() {
    var c = shown()[0]; if (!c) return 1;
    var gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    return Math.max(1, Math.round((rail.clientWidth + gap) / (c.offsetWidth + gap)));
  }
  function pageNow() {
    var cards = shown(), per = perPage(), pages = Math.ceil(cards.length / per);
    if (rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2) return pages - 1;
    var i = 0;
    for (var p = 0; p < pages; p++) if (cards[p * per].offsetLeft <= rail.scrollLeft + 2) i = p;
    return i;
  }
  function mark() {
    var i = pageNow();
    [].forEach.call(dots.children, function (d, k) { d.setAttribute('aria-current', String(k === i)); });
  }
  function buildDots() {
    var cards = shown(), per = perPage(), pages = Math.ceil(cards.length / per);
    dots.replaceChildren();
    dots.hidden = pages < 2;
    for (var p = 0; p < pages; p++) {
      var d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', (vi ? 'Trang ' : 'Page ') + (p + 1));
      d.addEventListener('click', (function (p) { return function () { rail.scrollTo({ left: shown()[p * perPage()].offsetLeft }); }; })(p));
      dots.appendChild(d);
    }
    mark();
  }
  function filter() {
    var cat = document.querySelector('.chip[aria-pressed="true"]').dataset.cat;
    rail.querySelectorAll('.card').forEach(function (c) { c.hidden = cat !== 'all' && c.dataset.cat !== cat; });
    rail.scrollLeft = 0;
    buildDots();
  }
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      filter();
    });
  });
  if (rail && dots) {
    var t;
    rail.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(mark, 60); }, { passive: true });
    addEventListener('resize', buildDots);
    filter();
  }

  // Lightbox: the poster shows first; the YouTube player loads only on tap.
  var opener;
  var lang = document.documentElement.lang;
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<div class="lightbox-frame"></div><button class="lightbox-close" type="button">&times;</button>';
  box.querySelector('.lightbox-close').setAttribute('aria-label', lang === 'vi' ? 'Đóng' : 'Close');
  document.body.appendChild(box);
  function closeBox() {
    box.hidden = true;
    box.querySelector('.lightbox-frame').replaceChildren();
    if (opener) opener.focus();
  }
  box.addEventListener('click', function (e) { if (e.target === box) closeBox(); });
  box.querySelector('.lightbox-close').addEventListener('click', closeBox);
  addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') closeBox();
    if (e.key === 'Tab') {  // keep focus inside: the player and the close button
      e.preventDefault();
      var close = box.querySelector('.lightbox-close'), f = box.querySelector('iframe');
      (document.activeElement === close && f ? f : close).focus();
    }
  });
  document.querySelectorAll('.play').forEach(function (el) {
    el.addEventListener('click', function () {
      opener = el;
      var f = document.createElement('iframe');
      f.src = el.dataset.yt
        ? 'https://www.youtube-nocookie.com/embed/' + el.dataset.yt + '?autoplay=1&playsinline=1&rel=0'
        : 'https://drive.google.com/file/d/' + el.dataset.drive + '/preview';
      f.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      f.title = el.getAttribute('aria-label');
      box.setAttribute('aria-label', f.title);
      box.querySelector('.lightbox-frame').replaceChildren(f);
      box.hidden = false;
      box.querySelector('.lightbox-close').focus();
    });
  });

  // Copy email: mailto often does nothing inside TikTok / Facebook in-app browsers.
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () { var t = b.textContent; b.textContent = b.dataset.done; setTimeout(function () { b.textContent = t; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, function () {});
    });
  });
