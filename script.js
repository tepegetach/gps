

const header=document.querySelector('.site-header');const menuButton=document.querySelector('.menu-toggle');menuButton?.addEventListener('click',()=>{const opened=header.classList.toggle('is-open');menuButton.setAttribute('aria-expanded',String(opened))});document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>{header.classList.remove('is-open');menuButton?.setAttribute('aria-expanded','false')}));
const regionData={novgorod:{image:'https://mavdesign.ru/goldport/assets/geo-novgorod-map.png',alt:'Карта Новгородской области'},pskov:{image:'https://mavdesign.ru/goldport/assets/geo-pskov-map.png',alt:'Карта Псковской области'},leningrad:{image:'https://mavdesign.ru/goldport/assets/geo-leningrad-map.png',alt:'Карта Ленинградской области'}};const regionImage=document.querySelector('.geo-map__image');document.querySelectorAll('[data-region]').forEach(tab=>tab.addEventListener('click',()=>{const next=regionData[tab.dataset.region];if(!next||!regionImage)return;document.querySelectorAll('[data-region]').forEach(item=>item.setAttribute('aria-selected','false'));tab.setAttribute('aria-selected','true');regionImage.style.opacity='0';setTimeout(()=>{regionImage.src=next.image;regionImage.alt=next.alt;regionImage.style.opacity='.75'},160)}));
const marquee=document.querySelector('[data-marquee]');const brandSet=marquee?.querySelector('.brands__set');if(marquee&&brandSet)marquee.append(brandSet.cloneNode(true));
/* HEADER SCROLL */

function updateHeaderScroll() {
  header?.classList.toggle(
    'is-scrolled',
    window.scrollY > 12
  );
}

window.addEventListener('scroll', updateHeaderScroll, {
  passive: true
});

updateHeaderScroll();

// Обновление количества торговых точек при переключении карты
const geoCount = document.querySelector('.geo-stats strong');

document.querySelectorAll('.geo-tabs [data-region]').forEach(tab => {
    tab.addEventListener('click', () => {
        if (geoCount) {
            geoCount.textContent = tab.dataset.points;
        }
    });
});

/* MAV Motion Study v2 — independent, dependency-free enhancements. */
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const cards = [...document.querySelectorAll('.category-card')];
  if (cards.length === 0) return;

  // The geographical base stays still; only route/node SVG elements animate.
  if (finePointer.matches && !reducedMotion.matches) {
    cards.forEach(card => {
      let frame = 0;
      card.addEventListener('pointermove', event => {
        const r = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - r.left) / r.width));
        const y = Math.max(0, Math.min(1, (event.clientY - r.top) / r.height));
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          card.style.setProperty('--card-tilt-x', `${((.5 - y) * 1).toFixed(2)}deg`);
          card.style.setProperty('--card-tilt-y', `${((x - .5) * 1.2).toFixed(2)}deg`);
          card.style.setProperty('--card-product-x', `${((x - .5) * 4).toFixed(1)}px`);
          card.style.setProperty('--card-product-y', `${((y - .5) * 2).toFixed(1)}px`);
          card.style.setProperty('--card-light-x', `${(x * 100).toFixed(1)}%`);
          card.style.setProperty('--card-light-y', `${(y * 100).toFixed(1)}%`);
        });
      }, {passive:true});
      card.addEventListener('pointerleave', () => {
        cancelAnimationFrame(frame);
        card.style.removeProperty('--card-tilt-x');
        card.style.removeProperty('--card-tilt-y');
        card.style.removeProperty('--card-product-x');
        card.style.removeProperty('--card-product-y');
        card.style.removeProperty('--card-light-x');
        card.style.removeProperty('--card-light-y');
      });
    });
  }

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const item = entry.target;
        const index = cards.indexOf(item);
        item.style.transitionDelay = `${(index % 3) * 95}ms`;
        item.classList.add('is-visible');
        observer.unobserve(item);
        item.addEventListener('transitionend', event => {
          if (event.propertyName === 'opacity') item.style.transitionDelay = '0ms';
        }, {once:true});
      }
    }, {threshold:.10, rootMargin:'0px 0px 60px 0px'});
    document.documentElement.classList.add('motion-ready');
    cards.forEach(card => observer.observe(card));
  }
})();


/* EXPERIMENT: reveal only the infrastructure cards, one time. */
(() => {
  const section = document.querySelector('.infrastructure');
  const grid = section?.querySelector('.infra-grid');
  if (!section || !grid || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  section.classList.add('infra-motion-ready');
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    section.classList.add('infra-motion-visible');
    observer.disconnect();
  }, { threshold: .12, rootMargin: '0px 0px 50px 0px' });
  observer.observe(grid);
})();


/* Network cards: one-time staggered reveal, with normal hover afterwards. */
(() => {
  const section = document.querySelector('.networks');
  const grid = section?.querySelector('.network-grid');
  if (!section || !grid) return;
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = [...grid.querySelectorAll(':scope > article')];
  if (!cards.length) return;
  section.classList.add('network-motion-ready');
  cards.forEach((card, index) => {
    card.style.transitionDelay = (index * 95) + 'ms';
    card.addEventListener('transitionend', event => {
      if (event.propertyName === 'opacity') card.style.transitionDelay = '0ms';
    }, { once: true });
  });

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    section.classList.add('network-motion-visible');
    observer.disconnect();
  }, { threshold: .12, rootMargin: '0px 0px 50px 0px' });
  observer.observe(grid);
})();
