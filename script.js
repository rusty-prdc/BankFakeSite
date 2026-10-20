/* BankFake — сайт: тема, меню, лайтбокс */
(function () {
  'use strict';

  /* ---------- тема ---------- */
  var themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', cur);
      try { localStorage.setItem('nl-site-theme', cur); } catch (e) {}
    });
  }

  /* ---------- бургер ---------- */
  var burger = document.getElementById('burger');
  var pillbar = document.getElementById('navPills');
  if (burger && pillbar) {
    burger.addEventListener('click', function () { pillbar.classList.toggle('open'); });
    pillbar.addEventListener('click', function (e) {
      if (e.target.closest('a')) pillbar.classList.remove('open');
    });
  }

  /* ---------- активный пункт шапки при скролле ---------- */
  var pills = [].slice.call(document.querySelectorAll('.h-pill[href^="#"]'));
  var sections = pills
    .map(function (p) { return document.querySelector(p.getAttribute('href')); })
    .filter(Boolean);
  function syncPill() {
    var y = window.scrollY + 120;
    var act = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= y) act = s; });
    pills.forEach(function (p) {
      var on = act && p.getAttribute('href') === '#' + act.id;
      if (on) p.setAttribute('aria-current', 'page');
      else p.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', syncPill, { passive: true });
  syncPill();

  /* ---------- живые цифры ---------- */
  /* статика BankFake статична в разметке: внешних вызовов нет */

  /* ---------- лайтбокс ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');
  function openLb(src, alt) {
    lbImg.src = src; lbImg.alt = alt || '';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.hidden = true; lbImg.src = '';
    document.body.style.overflow = '';
  }
  [].slice.call(document.querySelectorAll('.s-item')).forEach(function (fig) {
    fig.addEventListener('click', function () {
      openLb(fig.getAttribute('data-full') || fig.querySelector('img').src,
             fig.querySelector('img').alt);
    });
  });
  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb && !lb.hidden) closeLb(); });

  /* ---------- слайдер скриншотов ---------- */
  var slider = document.getElementById('shotSlider');
  if (slider) {
    function step(dir) {
      var item = slider.querySelector('.s-item');
      var w = item ? item.getBoundingClientRect().width + 24 : slider.clientWidth * .8;
      slider.scrollBy({ left: dir * w, behavior: 'smooth' });
    }
    var prev = document.getElementById('slidePrev');
    var next = document.getElementById('slideNext');
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
  }

  /* ---------- появление блоков при скролле ---------- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
})();
