  // Sample filter: chips toggle cards by data-cat. Without JS every card shows.
  var grid = document.getElementById('samples');
  var more = document.getElementById('more');
  var chips = document.querySelectorAll('.chip');
  var showAll = false;
  function apply() {
    var cat = document.querySelector('.chip[aria-pressed="true"]').dataset.cat;
    var hiddenExtras = 0;
    grid.querySelectorAll('.card').forEach(function (c) {
      var match = cat === 'all' || c.dataset.cat === cat;
      var extra = c.hasAttribute('data-extra') && cat === 'all' && !showAll;
      if (match && extra) hiddenExtras++;
      c.hidden = !match || extra;
    });
    if (more) more.hidden = hiddenExtras === 0;
  }
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      apply();
    });
  });
  if (more) more.addEventListener('click', function () { showAll = true; apply(); });
  if (grid) apply();

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
    if (e.key === 'Tab') { e.preventDefault(); box.querySelector('.lightbox-close').focus(); }
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
