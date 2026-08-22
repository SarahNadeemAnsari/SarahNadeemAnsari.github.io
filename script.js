document.addEventListener('DOMContentLoaded', () => {

  /* ---------- footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile menu toggle ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const menuLinks = document.getElementById('menuLinks');

  if (menuToggle && menuLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => {
      menuLinks.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- scrollspy: highlight active nav link ---------- */
  const sections = document.querySelectorAll('main section[id], footer[id]');
  const navLinksByHash = {};
  document.querySelectorAll('.menu-link[href^="#"]').forEach(link => {
    navLinksByHash[link.getAttribute('href')] = link;
  });

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = '#' + entry.target.id;
      const link = navLinksByHash[id];
      if (!link) return;
      if (entry.isIntersecting) {
        Object.values(navLinksByHash).forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => spyObserver.observe(s));

  /* ---------- hero terminal typewriter ---------- */
  const terminalBody = document.getElementById('terminalBody');
  const lines = [
    { prompt: '$', text: 'whoami' },
    { prompt: '>', text: 'Sarah Nadeem Ansari — QA Engineer', plain: true },
    { prompt: '$', text: 'cat focus.txt' },
    { prompt: '>', text: 'testing software / finding bugs / breaking things responsibly', plain: true },
    { prompt: '>', text: 'building things too', plain: true },
  ];

  function buildTerminal() {
    if (!terminalBody) return;
    let i = 0;

    function showNextLine() {
      if (i >= lines.length) {
        const cursorLine = document.createElement('div');
        cursorLine.className = 'line shown';
        cursorLine.innerHTML = '<span class="prompt">$</span><span class="cursor"></span>';
        terminalBody.appendChild(cursorLine);
        return;
      }
      const l = lines[i];
      const div = document.createElement('div');
      div.className = 'line';
      const promptClass = l.plain ? 'prompt plain' : 'prompt';
      div.innerHTML = `<span class="${promptClass}">${l.prompt}</span><span class="line-text"></span>`;
      terminalBody.appendChild(div);

      requestAnimationFrame(() => div.classList.add('shown'));

      const textSpan = div.querySelector('.line-text');
      let charIndex = 0;
      const speed = l.plain ? 12 : 35;

      function typeChar() {
        if (charIndex < l.text.length) {
          textSpan.textContent += l.text[charIndex];
          charIndex++;
          setTimeout(typeChar, speed);
        } else {
          i++;
          setTimeout(showNextLine, 220);
        }
      }
      typeChar();
    }
    showNextLine();
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    lines.forEach(l => {
      const div = document.createElement('div');
      div.className = 'line shown';
      const promptClass = l.plain ? 'prompt plain' : 'prompt';
      div.innerHTML = `<span class="${promptClass}">${l.prompt}</span><span>${l.text}</span>`;
      terminalBody.appendChild(div);
    });
  } else {
    const heroObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          buildTerminal();
          obs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    if (terminalBody) heroObserver.observe(terminalBody);
  }

  /* ---------- project filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const cats = card.dataset.cat.split(' ');
        const show = filter === 'all' || cats.includes(filter);
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------- gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxLabel = document.getElementById('lightboxLabel');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const artSlots = document.querySelectorAll('.art-slot');

  artSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      const img = slot.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.display = 'block';
        lightboxLabel.textContent = '';
        lightboxCaption.textContent = slot.dataset.label || '';
      } else {
        lightboxImg.style.display = 'none';
        lightboxLabel.textContent = slot.dataset.label ? `${slot.dataset.label.toUpperCase()} — PLACEHOLDER` : 'PLACEHOLDER';
        lightboxCaption.textContent = '';
      }
      lightbox.classList.add('is-open');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('is-open');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

});
