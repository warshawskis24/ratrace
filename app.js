/* RAT RACE — interactions */
(function () {
  // ---- Nav stuck state ----
  var nav = document.querySelector('.nav');
  function onScroll() { if (window.scrollY > 40) nav.classList.add('is-stuck'); else nav.classList.remove('is-stuck'); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- Notify form ----
  var form = document.getElementById('notify-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('notify-email').value.trim();
      if (!email) return;
      var subject = encodeURIComponent('Notify me — next Rat Race');
      var body = encodeURIComponent('Please notify me at ' + email + ' when the next Rat Race is announced.');
      window.location.href = 'mailto:hello@ratrace.to?subject=' + subject + '&body=' + body;
      form.closest('.notify').classList.add('sent');
    });
  }

  // ---- Reveal on scroll (safe progressive enhancement) ----
  var revealEls = document.querySelectorAll('.reveal');
  function revealAll() { revealEls.forEach(function (el) { el.classList.add('in'); }); }
  if (!('IntersectionObserver' in window) || !revealEls.length) {
    // leave visible
  } else {
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          var el = e.target;
          var delay = Array.prototype.indexOf.call(el.parentNode.children, el) * 90;
          setTimeout(function () { el.classList.add('in'); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    requestAnimationFrame(function () {
      revealEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) el.classList.add('in');
      });
    });
    setTimeout(revealAll, 1800);
  }

  // ---- Stat count-up ----
  var stats = document.querySelectorAll('.stat__n');
  function animateStat(el) {
    var raw = el.getAttribute('data-count');
    var suffix = el.getAttribute('data-suffix') || '';
    var target = parseInt(raw, 10);
    var start = performance.now();
    var dur = 1400;
    function step(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && stats.length) {
    var statIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateStat(e.target); statIo.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    stats.forEach(function (el) { statIo.observe(el); });
  }

  // ---- Slideshow ----
  var track = document.getElementById('slide-track');
  if (track) {
    var slides = track.children.length;
    var idx = 0;
    var dotsWrap = document.getElementById('slide-dots');
    for (var i = 0; i < slides; i++) {
      var d = document.createElement('button');
      if (i === 0) d.className = 'active';
      d.addEventListener('click', function (n) { return function () { goTo(n); }; }(i));
      dotsWrap.appendChild(d);
    }
    function goTo(n) {
      idx = (n + slides) % slides;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      Array.prototype.forEach.call(dotsWrap.children, function (d, i) { d.classList.toggle('active', i === idx); });
    }
    document.getElementById('slide-prev').addEventListener('click', function () { goTo(idx - 1); });
    document.getElementById('slide-next').addEventListener('click', function () { goTo(idx + 1); });
    var auto = setInterval(function () { goTo(idx + 1); }, 5000);
    track.closest('.slideshow').addEventListener('mouseenter', function () { clearInterval(auto); });
  }
})();
