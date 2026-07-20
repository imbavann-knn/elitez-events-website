// PostHog Analytics — Elitez Events
// Replace POSTHOG_KEY with your phc_... key from posthog.com
(function() {
  var PH_KEY = 'POSTHOG_KEY';
  if (!PH_KEY || PH_KEY === 'POSTHOG_KEY') return; // no-op until key is set

  // PostHog snippet (v1.x)
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","") + "/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="init capture register register_once unregister identify alias people.set people.set_once set_config group reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||(window.posthog=[]));

  posthog.init(PH_KEY, {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true
  });

  // ── Custom event tracking ──────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    var page = window.location.pathname;

    // Track all Get a Quote / CTA button clicks
    document.querySelectorAll('.btn-gold, .btn.btn-gold, .nav-cta').forEach(function(el) {
      el.addEventListener('click', function() {
        posthog.capture('cta_clicked', {
          label: el.textContent.trim(),
          page: page
        });
      });
    });

    // Track portfolio / ghost CTA clicks
    document.querySelectorAll('.btn-ghost, .btn-text-arrow').forEach(function(el) {
      el.addEventListener('click', function() {
        posthog.capture('secondary_cta_clicked', {
          label: el.textContent.trim(),
          page: page
        });
      });
    });

    // Track service row clicks
    document.querySelectorAll('.service-row').forEach(function(el) {
      el.addEventListener('click', function() {
        var name = el.querySelector('.service-name');
        posthog.capture('service_clicked', {
          service: name ? name.textContent.trim() : '',
          page: page
        });
      });
    });

    // Track nav link clicks
    document.querySelectorAll('.nav-links a').forEach(function(el) {
      el.addEventListener('click', function() {
        posthog.capture('nav_clicked', {
          destination: el.getAttribute('href'),
          label: el.textContent.trim(),
          page: page
        });
      });
    });

    // Track enquiry form submission
    var form = document.getElementById('enquiry-form');
    if (form) {
      // Track when form is first interacted with
      var formTouched = false;
      form.addEventListener('focusin', function() {
        if (!formTouched) {
          formTouched = true;
          posthog.capture('enquiry_form_started', { page: page });
        }
      });

      // Track submission
      form.addEventListener('submit', function() {
        var eventType = form.querySelector('#event_type');
        var pax = form.querySelector('#pax');
        posthog.capture('enquiry_submitted', {
          event_type: eventType ? eventType.value : '',
          pax_range: pax ? pax.value : '',
          page: page
        });
      });
    }

    // Track if visitor arrived from a ?sent=1 redirect (form success)
    if (window.location.search.indexOf('sent=1') !== -1) {
      posthog.capture('enquiry_completed', { page: page });
    }

    // Track portfolio card clicks
    document.querySelectorAll('.port-card, .portfolio-card').forEach(function(el) {
      el.addEventListener('click', function() {
        var name = el.querySelector('.port-name, .portfolio-card-name');
        posthog.capture('portfolio_card_clicked', {
          client: name ? name.textContent.trim() : '',
          page: page
        });
      });
    });

    // Track filter button clicks (portfolio page)
    document.querySelectorAll('.filter-btn').forEach(function(el) {
      el.addEventListener('click', function() {
        posthog.capture('portfolio_filtered', {
          filter: el.dataset.filter,
          page: page
        });
      });
    });
  });
})();
