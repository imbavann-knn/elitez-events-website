/* ═══════════════════════════════════════════════════
   ELITEZ EVENTS — Main JS
═══════════════════════════════════════════════════ */

/* ── Toast notification ────────────────────────────── */
(function() {
  const el = document.createElement('div');
  el.id = 'ee-toast';
  document.body.appendChild(el);
})();

function toast(msg, duration) {
  duration = duration || 2800;
  const t = document.getElementById('ee-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), duration);
}

/* ── Scroll reveal ─────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Nav scroll state ──────────────────────────────── */
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.background = 'rgba(8,12,24,0.98)';
      nav.style.boxShadow  = '0 1px 24px rgba(0,0,0,0.4)';
    } else {
      nav.style.background = 'rgba(8,12,24,0.92)';
      nav.style.boxShadow  = '';
    }
  }, { passive: true });
}

/* ── Mobile nav toggle ─────────────────────────────── */
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(4px, 4px)'  : '';
    spans[1].style.opacity   = isOpen ? '0' : '';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(4px, -4px)' : '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = toggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });
}

/* ── Active nav link ───────────────────────────────── */
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
})();

/* ── Contact form ──────────────────────────────────── */
const form = document.querySelector('#enquiry-form');
if (form) {
  // Show success toast if redirected back after submission
  if (window.location.search.includes('sent=1')) {
    toast('✓ Enquiry sent — we\'ll be in touch within 24 hours.', 5000);
    window.history.replaceState({}, '', window.location.pathname);
  }

  const eventTypeLabels = {
    'Corporate Dinner & Dance': 'Corporate Dinner & Dance',
    'Awards Ceremony':          'Awards Ceremony',
    'Family Day':               'Family Day',
    'Conference / Seminar':     'Conference / Seminar',
    'Rallies™':                 'Rallies™',
    'Team Building':            'Team Building',
    'Other / Not sure yet':     'Other'
  };

  form.addEventListener('submit', () => {
    const company   = (form.querySelector('[name="company"]').value   || '').trim();
    const eventVal  = form.querySelector('[name="Event Type"]').value || '';
    const eventLabel = eventTypeLabels[eventVal] || eventVal || 'Event Enquiry';
    const email     = form.querySelector('[name="email"]').value || '';

    // Set dynamic subject and reply-to for Formsubmit
    document.getElementById('fs-subject').value =
      'New EVENTS enquiry! ' + company + ' — ' + eventLabel;
    document.getElementById('fs-replyto').value = email;
  });
}

/* ── Portfolio filter ──────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card[data-type]');

if (filterBtns.length && portfolioCards.length) {
  // Set initial transition on all cards
  portfolioCards.forEach(card => {
    card.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      portfolioCards.forEach(card => {
        const match = filter === 'all' || card.dataset.type === filter;
        if (match) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => { card.style.display = 'none'; }, 280);
        }
      });

      const count = filter === 'all'
        ? portfolioCards.length
        : [...portfolioCards].filter(c => c.dataset.type === filter).length;
      toast(count + ' event' + (count !== 1 ? 's' : '') + ' shown');
    });
  });
}
