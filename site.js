  // One service per page: the menu hash picks which section shows.
  var pages = ['edit', 'website', 'shoot', 'about'];
  function showPage(scroll) {
    var id = location.hash.slice(1);
    if (pages.indexOf(id) < 0) id = 'edit';
    document.querySelectorAll('.page').forEach(function (s) { s.classList.toggle('active', s.id === id); });
    document.querySelectorAll('.nav a').forEach(function (a) { a.classList.toggle('current', a.getAttribute('href') === '#' + id); });
    if (scroll) window.scrollTo(0, 0);
  }
  addEventListener('hashchange', function () { showPage(true); });
  showPage(false);

  // Collapse / expand the samples strip.
  document.querySelectorAll('.toggle').forEach(function (btn) {
    var box = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      box.hidden = !open;
      btn.textContent = open ? btn.dataset.hide : btn.dataset.show;
    });
  });

  // Lite embed: ảnh poster trước, trình phát Drive chỉ tải khi bấm.
  var opener;
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.hidden = true;
  box.innerHTML = '<div class="lightbox-frame"></div><button class="lightbox-close" type="button" aria-label="Close">&times;</button>';
  document.body.appendChild(box);
  function closeBox() {
    box.hidden = true;
    box.querySelector('.lightbox-frame').replaceChildren();
    if (opener) opener.focus();
  }
  box.addEventListener('click', function (e) { if (e.target === box) closeBox(); });
  box.querySelector('.lightbox-close').addEventListener('click', closeBox);
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.hidden) closeBox(); });

  document.querySelectorAll('div.frame.lite').forEach(function (el) {
    function open() {
      opener = el;
      var f = document.createElement('iframe');
      f.src = 'https://drive.google.com/file/d/' + el.dataset.id + '/preview';
      f.allow = 'autoplay; fullscreen';
      f.allowFullscreen = true;
      f.title = el.getAttribute('aria-label');
      box.querySelector('.lightbox-frame').replaceChildren(f);
      box.hidden = false;
    }
    el.addEventListener('click', open);
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  // Alignment check: ?grid=48 draws a 48px canvas grid over the page.
  if (new URLSearchParams(location.search).get('grid') === '48') {
    var c = document.createElement('canvas');
    c.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:9999';
    document.body.appendChild(c);
    var draw = function () {
      c.width = document.documentElement.scrollWidth;
      c.height = document.documentElement.scrollHeight;
      var x = c.getContext('2d');
      x.strokeStyle = 'rgba(255,0,0,.35)';
      x.beginPath();
      var m = document.querySelector('main').getBoundingClientRect();
      var ox = (m.left + scrollX) % 48;
      for (var i = ox; i <= c.width; i += 48) { x.moveTo(i + .5, 0); x.lineTo(i + .5, c.height); }
      for (var j = 0; j <= c.height; j += 48) { x.moveTo(0, j + .5); x.lineTo(c.width, j + .5); }
      x.stroke();
    };
    draw();
    addEventListener('resize', draw);
  }
