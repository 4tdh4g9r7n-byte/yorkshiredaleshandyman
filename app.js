
// Mobile nav toggle
(function () {
  const btn = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    })
  );
})();

// Scroll-reveal — fades/slides sections and cards in as they enter the viewport
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => io.observe(el));
})();

// Parallax background layering — subtle drift on the hero/about decorative
// blobs as the page scrolls, layered on top of the scroll-reveal above.
(function () {
  const layers = document.querySelectorAll('.hero, .about');
  if (!layers.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking = false;
  function update() {
    layers.forEach((el) => {
      const offset = el.getBoundingClientRect().top * 0.15;
      el.style.setProperty('--parallax-offset', offset.toFixed(1) + 'px');
    });
    ticking = false;
  }
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
})();

// Quote form — submits to Web3Forms (https://web3forms.com), a free form-to-email
// service. No backend/server needed. To activate: sign up free at web3forms.com,
// verify the inbox that should receive quotes, then paste the access key into the
// hidden "access_key" input in index.html (search for YOUR_WEB3FORMS_ACCESS_KEY).
(function () {
  const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
  const form = document.querySelector('[data-quote-form]');
  const confirmation = document.querySelector('[data-confirmation]');
  const errorBox = document.querySelector('[data-form-error]');
  const submitBtn = document.querySelector('[data-submit-btn]');
  if (!form || !confirmation) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const accessKey = form.querySelector('[name="access_key"]')?.value || '';
    if (errorBox) errorBox.hidden = true;

    if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      // Not configured yet — fail gracefully with a clear message instead of a silent no-op.
      if (errorBox) errorBox.hidden = false;
      return;
    }

    const data = new FormData(form);
    data.delete('photos'); // file attachments aren't supported on the free plan — see the hint text near the upload field

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const result = await res.json().catch(() => ({}));

      if (res.ok && result.success) {
        form.classList.add('is-hidden');
        confirmation.classList.add('is-visible');
        confirmation.setAttribute('tabindex', '-1');
        confirmation.focus();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      if (errorBox) errorBox.hidden = false;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send My Details — Get a Fixed Quote';
      }
    }
  });
// Animated counting stats
(function () {
  const nums = document.querySelectorAll('.stat-num[data-count-to]');
  if (!nums.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.countTo);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = 1100;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased);
          el.textContent = prefix + value + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  nums.forEach((el) => io.observe(el));
})();
})();
// Full-bleed hero video morphing into docked card on scroll
(function () {
  const overlay = document.querySelector('[data-hero-fullbleed]');
  const dock = document.querySelector('[data-hero-dock]');
  const heroSection = document.querySelector('.hero');
  if (!overlay || !dock || !heroSection) return;

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  function update() {
    ticking = false;
    const heroHeight = heroSection.offsetHeight;
    const progress = Math.min(Math.max(window.scrollY / (heroHeight * 0.9), 0), 1);
    const dockRect = dock.getBoundingClientRect();

    const startW = window.innerWidth;
    const startH = window.innerHeight;
    const endW = dockRect.width;
    const endH = dockRect.height;
    const endTop = dockRect.top;
    const endLeft = dockRect.left;

    const w = startW + (endW - startW) * progress;
    const h = startH + (endH - startH) * progress;
    const radius = progress * 20;

    overlay.style.borderRadius = radius + 'px';
    overlay.style.boxShadow = progress > 0.05 ? '0 20px 48px rgba(0,0,0,0.25)' : 'none';
    overlay.style.width = w + 'px';
    overlay.style.height = h + 'px';

    if (progress >= 1) {
      overlay.style.position = 'absolute';
      overlay.style.top = endTop + window.scrollY + 'px';
      overlay.style.left = endLeft + window.scrollX + 'px';
    } else {
      overlay.style.position = 'fixed';
      overlay.style.top = (0 + (endTop - 0) * progress) + 'px';
      overlay.style.left = (0 + (endLeft - 0) * progress) + 'px';
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
 
