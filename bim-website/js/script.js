/* ==========================================================================
   ArchVDC — shared behavior (nav, dropdowns, reveal, counters, hero slider)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- sticky header shadow on scroll ---- */
  const header = document.querySelector('.site-header');
  if (header){
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
  }

  /* ---- mobile burger menu ---- */
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.main-nav');
  if (burger && nav){
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      nav.classList.toggle('open');
    });
    // Mobile: tap a top-level link with a dropdown to expand instead of navigating
    nav.querySelectorAll('li').forEach(li => {
      const link = li.querySelector(':scope > a');
      const dd = li.querySelector(':scope > .dropdown');
      if (dd && link){
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 860){
            e.preventDefault();
            li.classList.toggle('dd-open');
          }
        });
      }
    });
  }

  /* ---- reveal-on-scroll ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---- staggered advantage list ---- */
  const advList = document.querySelectorAll('.advantage-list li');
  if (advList.length){
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry, groupIdx) => {
        if (entry.isIntersecting){
          const items = entry.target.parentElement.querySelectorAll('li');
          items.forEach((li, i) => setTimeout(() => li.classList.add('in'), i * 90));
          io2.unobserve(entry.target);
        }
      });
    }, { threshold:.2 });
    io2.observe(advList[0]);
  }

  /* ---- animated counters ---- */
  const counters = document.querySelectorAll('.stat .num[data-target]');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length){
    const io3 = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          animateCounter(entry.target);
          io3.unobserve(entry.target);
        }
      });
    }, { threshold:.5 });
    counters.forEach(c => io3.observe(c));
  }

  /* ---- hero dot slider (home page) ---- */
  const dots = document.querySelectorAll('.hero-dots span');
  const heroCopy = document.querySelector('.hero-copy');
  const heroSlides = [
    { title:'STRUCTURAL VDC / BIM', sub:'Services & Consulting', text:'Our structural BIM / VDC services include structural bim modeling, structural steel detailing, precast panel detailing, rebar detailing and construction documentation.' },
    { title:'ARCHITECTURAL VDC / BIM', sub:'Services & Consulting', text:'Precise 3D models, construction documentation, and design coordination for enhanced pre-construction efficiency.' },
    { title:'MEP VDC / BIM', sub:'Services & Consulting', text:'Comprehensive & precise modeling for mechanical, electrical, and plumbing systems across every project scale.' },
    { title:'POINT CLOUD TO BIM', sub:'Scan-to-BIM Services', text:'Convert point cloud scan data into accurate, coordinated BIM models for renovation and construction.' },
    { title:'BIM CONSULTING', sub:'& Implementation', text:'Streamline your transition from CAD to effective, standards-driven BIM practice.' },
  ];
  if (dots.length && heroCopy){
    let active = 0, timer;
    const h1 = heroCopy.querySelector('h1');
    const p = heroCopy.querySelector('p');
    const render = (i) => {
      dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
      if (h1 && heroSlides[i]){
        h1.style.animation = 'none'; void h1.offsetWidth; h1.style.animation = '';
        h1.innerHTML = heroSlides[i].title + '<span>' + heroSlides[i].sub + '</span>';
      }
      if (p && heroSlides[i]){
        p.style.animation = 'none'; void p.offsetWidth; p.style.animation = '';
        p.textContent = heroSlides[i].text;
      }
    };
    const go = (i) => { active = (i + dots.length) % dots.length; render(active); };
    dots.forEach((d, idx) => d.addEventListener('click', () => { go(idx); resetTimer(); }));
    const resetTimer = () => { clearInterval(timer); timer = setInterval(() => go(active + 1), 5500); };
    resetTimer();
  }

  /* ---- benefit cards: click to focus/expand on touch devices ---- */
  document.querySelectorAll('.benefit-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('is-open'));
  });

  /* ---- smooth-scroll for on-page anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1){
        const target = document.querySelector(id);
        if (target){
          e.preventDefault();
          target.scrollIntoView({ behavior:'smooth', block:'start' });
        }
      }
    });
  });

});
