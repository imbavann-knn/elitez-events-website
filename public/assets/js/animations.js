/* ════════════════════════════════════════════════════
   ELITEZ EVENTS — Visual Animations
   Staggered reveals · Counter · Marquee · Ambient orbs · Shimmer
   No external dependencies — works with existing IntersectionObserver in main.js
════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ─── Staggered child reveal ──────────────────────────────────────
     Observes individual children so each animates in sequence,
     not as a single block like the parent .reveal elements do.        */
  var childObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        childObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -3% 0px' });

  function stagger(selector, step) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.classList.add('reveal-child');
      el.style.transitionDelay = (i * (step || 0.08)).toFixed(2) + 's';
      childObserver.observe(el);
    });
  }

  stagger('.service-row',      0.07);
  stagger('.why-item',         0.10);
  stagger('.port-card',        0.08);
  stagger('.portfolio-card',   0.06);

  /* ─── Number counter ─────────────────────────────────────────────
     Counts from ~20 % of the target to the final value when the
     stat bar enters the viewport. Manipulates only the text node
     so the <span>pax</span> child is never disturbed.                 */
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      counterObserver.unobserve(e.target);
      countUp(e.target);
    });
  }, { threshold: 0.55 });

  function countUp(el) {
    var textNode = null;
    el.childNodes.forEach(function (n) {
      if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) textNode = n;
    });
    if (!textNode) return;

    var raw    = textNode.textContent.trim().replace(/,/g, '');
    var target = parseInt(raw, 10);
    if (isNaN(target) || target === 0) return;

    var from     = Math.floor(target * 0.2);
    var duration = 1600;
    var start    = performance.now();

    function tick(now) {
      var t      = Math.min((now - start) / duration, 1);
      var eased  = 1 - Math.pow(1 - t, 3);
      var val    = Math.round(from + (target - from) * eased);
      textNode.textContent = val >= 1000 ? val.toLocaleString('en-US') : String(val);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        textNode.textContent = target >= 1000 ? target.toLocaleString('en-US') : String(target);
      }
    }
    requestAnimationFrame(tick);
  }

  document.querySelectorAll('.stat-num').forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ─── Infinite marquee (client strip) ────────────────────────────
     Duplicates the client name items for a seamless CSS loop.
     Pauses on hover.                                                   */
  var track = document.querySelector('.client-names');
  if (track) {
    var items = Array.prototype.slice.call(track.children);
    items.forEach(function (item) {
      track.appendChild(item.cloneNode(true));
    });
    track.classList.add('marquee-active');

    var strip = track.closest('.clients-strip');
    if (strip) {
      strip.addEventListener('mouseenter', function () {
        track.style.animationPlayState = 'paused';
      });
      strip.addEventListener('mouseleave', function () {
        track.style.animationPlayState = '';
      });
    }
  }

  /* ─── Ambient section orbs ───────────────────────────────────────
     Injects subtly pulsing radial-gradient blobs into sections to
     give the same warm atmosphere as composio.dev's background orbs.
     Skips the hero (index 0) which already has its own glow.          */
  var orbDefs = [
    { idx: 1, x: '82%',  y: '28%', color: 'rgba(201,146,58,0.055)', delay: '0s'  },
    { idx: 2, x: '12%',  y: '68%', color: 'rgba(201,146,58,0.04)',  delay: '-4s' },
    { idx: 3, x: '78%',  y: '55%', color: 'rgba(201,146,58,0.05)',  delay: '-2s' },
  ];

  var sections = document.querySelectorAll('section');
  orbDefs.forEach(function (cfg) {
    var sec = sections[cfg.idx];
    if (!sec) return;
    var cs = window.getComputedStyle(sec);
    if (cs.position === 'static') sec.style.position = 'relative';

    var orb = document.createElement('div');
    orb.className = 'ambient-orb';
    orb.style.cssText = [
      'left:'       + cfg.x,
      'top:'        + cfg.y,
      'background:radial-gradient(ellipse,'+cfg.color+' 0%,transparent 68%)',
      'animation-delay:' + cfg.delay,
    ].join(';');
    sec.insertBefore(orb, sec.firstChild);
  });

  /* ─── Eyebrow shimmer ────────────────────────────────────────────
     Adds a slow gold-to-gold-light shimmer to the short label text
     above every section heading.                                       */
  document.querySelectorAll('.eyebrow').forEach(function (el) {
    el.classList.add('shimmer');
  });

})();
