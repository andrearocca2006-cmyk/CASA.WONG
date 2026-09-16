import './styles.css';
import { siteContent } from './content.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');
const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
const assetUrl = (path) => path?.startsWith('/') ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path;

function setPhoto(slot, path, alt = '') {
  const oldImage = $('img', slot);
  if (oldImage) oldImage.remove();
  slot.classList.toggle('has-photo', Boolean(path));
  if (!path) return;
  const image = document.createElement('img');
  image.src = assetUrl(path);
  image.alt = alt;
  image.loading = slot.closest('.hero') ? 'eager' : 'lazy';
  if (slot.closest('.hero')) image.fetchPriority = 'high';
  image.decoding = 'async';
  slot.prepend(image);
}

$$('[data-photo]').forEach((slot) => {
  const name = slot.dataset.photo;
  if (name !== 'menu') setPhoto(slot, siteContent.photos[name], slot.dataset.alt || '');
});

$$('a[href="https://www.instagram.com/casa.wong/"]').forEach((link) => {
  link.href = siteContent.instagramUrl;
});

if (siteContent.address) $('#address-value').textContent = siteContent.address;
if (siteContent.hours) $('#hours-value').textContent = siteContent.hours;
if (siteContent.contact) $('#contact-value').textContent = siteContent.contact;

if (siteContent.mapEmbedUrl) {
  const map = $('#map-placeholder');
  map.innerHTML = '';
  map.classList.add('has-map');
  const frame = document.createElement('iframe');
  frame.src = siteContent.mapEmbedUrl;
  frame.title = 'Mappa di Casa Wong';
  frame.loading = 'lazy';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.allowFullscreen = true;
  map.append(frame);
  if (siteContent.mapUrl) {
    const link = document.createElement('a');
    link.href = siteContent.mapUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'map-link';
    link.textContent = 'Apri le indicazioni ↗';
    map.append(link);
  }
} else if (siteContent.mapUrl) {
  const map = $('#map-placeholder');
  const link = document.createElement('a');
  link.href = siteContent.mapUrl;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'map-link';
  link.textContent = 'Apri le indicazioni ↗';
  map.append(link);
}

$('#year').textContent = new Date().getFullYear();

// Reveal text and images only when they enter the viewport.
if (reducedMotion.matches || !('IntersectionObserver' in window)) {
  $$('.reveal').forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -30px 0px', threshold: .08 });
  $$('.reveal').forEach((element) => revealObserver.observe(element));
}

// Transparent navigation becomes opaque as the page moves.
const header = $('#site-header');
const menuToggle = $('#menu-toggle');
const mobileNav = $('#mobile-nav');
const pageMain = $('main');
const pageFooter = $('.site-footer');
function updateHeader() { header.classList.toggle('is-scrolled', window.scrollY > 30); }
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

function setMobileNav(open) {
  header.classList.toggle('is-open', open);
  document.body.classList.toggle('nav-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Chiudi il menu di navigazione' : 'Apri il menu di navigazione');
  mobileNav.inert = !open;
  pageMain.inert = open;
  pageFooter.inert = open;
}
function closeMobileNav(returnFocus = false) {
  setMobileNav(false);
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  setMobileNav(!header.classList.contains('is-open'));
});
$('.wordmark').addEventListener('click', () => {
  if (header.classList.contains('is-open')) closeMobileNav();
});
$$('a', mobileNav).forEach((link) => link.addEventListener('click', () => closeMobileNav()));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && header.classList.contains('is-open')) closeMobileNav(true);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 800 && header.classList.contains('is-open')) closeMobileNav();
});

// The constellation is populated from one small content file.
const categories = siteContent.menuCategories;
const nodeWrap = $('#constellation-nodes');
const previewPhoto = $('.menu-preview-photo');
const previewBottom = $('.menu-preview-bottom');
let activeCategory = -1;
const positions = [
  { desktop: [13, 22], tablet: [10, 10], mobile: [7, 8] },
  { desktop: [28, 54], tablet: [49, 29], mobile: [48, 24] },
  { desktop: [49, 37], tablet: [12, 43], mobile: [12, 38] },
  { desktop: [8, 44], tablet: [50, 42], mobile: [49, 40] },
  { desktop: [48, 10], tablet: [9, 23], mobile: [5, 24] },
];

function updateNodePositions() {
  const size = window.innerWidth <= 560 ? 'mobile' : window.innerWidth <= 800 ? 'tablet' : 'desktop';
  $$('.constellation-node', nodeWrap).forEach((node, index) => {
    const [left, top] = positions[index % positions.length][size];
    node.style.left = `${left}%`;
    node.style.top = `${top}%`;
  });
}

function selectCategory(index) {
  const item = categories[index];
  if (!item || index === activeCategory) return;
  const animate = activeCategory !== -1 && !reducedMotion.matches;
  activeCategory = index;
  $$('.constellation-node', nodeWrap).forEach((node, i) => {
    node.classList.toggle('is-active', i === index);
    node.setAttribute('aria-pressed', String(i === index));
  });
  $('#preview-number').textContent = `${String(index + 1).padStart(2, '0')} / ${String(categories.length).padStart(2, '0')}`;
  $('#preview-title').textContent = item.dishName || item.name;
  $('#preview-description').textContent = item.description;
  const price = $('#preview-price');
  price.hidden = !item.price;
  price.textContent = item.price || '';
  setPhoto(previewPhoto, item.image, item.dishName || item.name);
  if (animate) {
    previewPhoto.getAnimations().forEach((animation) => animation.cancel());
    previewBottom.getAnimations().forEach((animation) => animation.cancel());
    previewPhoto.animate([
      { opacity: .35, transform: 'scale(1.035)' },
      { opacity: 1, transform: 'scale(1)' },
    ], { duration: 460, easing: 'cubic-bezier(.2,.75,.2,1)' });
    previewBottom.animate([
      { opacity: .35, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 400, easing: 'cubic-bezier(.2,.75,.2,1)' });
  }
}

categories.slice(0, 5).forEach((item, index) => {
  const node = document.createElement('button');
  node.type = 'button';
  node.className = 'constellation-node';
  node.innerHTML = `<span>${String(index + 1).padStart(2, '0')} / ${String(categories.length).padStart(2, '0')}</span><strong></strong>`;
  $('strong', node).textContent = item.name;
  node.addEventListener('click', () => selectCategory(index));
  node.addEventListener('mouseenter', () => {
    if (finePointer.matches) selectCategory(index);
  });
  nodeWrap.append(node);
});
if (categories.length) selectCategory(0);
updateNodePositions();
window.addEventListener('resize', updateNodePositions);

// A short response on press gives touch controls the same sense of depth as hover.
$$('.button').forEach((control) => {
  const press = (x, y) => {
    if (reducedMotion.matches) return;
    control.style.setProperty('--press-x', `${x}%`);
    control.style.setProperty('--press-y', `${y}%`);
    control.classList.add('is-pressed');
  };
  control.addEventListener('pointerdown', (event) => {
    const rect = control.getBoundingClientRect();
    press((event.clientX - rect.left) / rect.width * 100, (event.clientY - rect.top) / rect.height * 100);
  }, { passive: true });
  control.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') press(50, 50);
  });
  control.addEventListener('animationend', (event) => {
    if (event.animationName === 'button-bloom') control.classList.remove('is-pressed');
  });
});

// Fallback dialogs can turn into real links through content.js.
const configuredLinks = {
  'menu-dialog': siteContent.fullMenuUrl,
  'order-dialog': siteContent.orderUrl,
  'booking-dialog': siteContent.bookingUrl,
};
function openModal(dialog) {
  if (dialog.open) return;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  if (!reducedMotion.matches) {
    dialog.animate([
      { opacity: 0, transform: 'translateY(20px) scale(.975)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' },
    ], { duration: 340, easing: 'cubic-bezier(.2,.75,.2,1)' });
  }
}
function closeModal(dialog) {
  if (!dialog.open || dialog.dataset.closing) return;
  if (reducedMotion.matches) {
    dialog.close();
    return;
  }
  dialog.dataset.closing = 'true';
  dialog.getAnimations().forEach((animation) => animation.cancel());
  const exit = dialog.animate([
    { opacity: 1, transform: 'translateY(0) scale(1)' },
    { opacity: 0, transform: 'translateY(12px) scale(.985)' },
  ], { duration: 210, easing: 'ease-in', fill: 'forwards' });
  exit.addEventListener('finish', () => dialog.close(), { once: true });
}
$$('dialog').forEach((dialog) => {
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeModal(dialog);
  });
  dialog.addEventListener('close', () => {
    dialog.getAnimations().forEach((animation) => animation.cancel());
    delete dialog.dataset.closing;
    if (!$$('dialog').some((item) => item.open)) document.body.classList.remove('dialog-open');
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeModal(dialog);
  });
});
$$('[data-dialog]').forEach((button) => button.addEventListener('click', () => {
  const id = button.dataset.dialog;
  if (configuredLinks[id]) {
    window.location.assign(configuredLinks[id]);
    return;
  }
  const dialog = $(`#${id}`);
  openModal(dialog);
}));
$$('.site-dialog').forEach((dialog) => {
  $('.dialog-close', dialog).addEventListener('click', () => closeModal(dialog));
});

// The gallery opens in place and can be browsed by tap, swipe, or arrow keys.
const galleryDialog = $('#gallery-dialog');
const galleryView = $('#gallery-view');
const galleryImage = $('#gallery-view-image');
const galleryCards = $$('.gallery-photo');
const galleryItems = galleryCards.map((card) => ({
  src: assetUrl(siteContent.photos[card.dataset.photo]),
  alt: card.dataset.alt,
  caption: card.dataset.caption,
}));
let galleryIndex = 0;
let galleryOpener = null;
let swipeStart = null;
let galleryPreloads = null;

function showGalleryPhoto(index, direction = 1, animate = true) {
  galleryIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[galleryIndex];
  galleryImage.getAnimations().forEach((animation) => animation.cancel());
  galleryImage.src = item.src;
  galleryImage.alt = item.alt;
  $('#gallery-view-index').textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
  $('#gallery-view-caption').textContent = item.caption;
  if (animate && !reducedMotion.matches) {
    galleryImage.animate([
      { opacity: .15, transform: `translateX(${direction * 26}px) scale(.985)` },
      { opacity: 1, transform: 'translateX(0) scale(1)' },
    ], { duration: 380, easing: 'cubic-bezier(.2,.75,.2,1)' });
  }
}
function moveGallery(step) { showGalleryPhoto(galleryIndex + step, step); }
galleryCards.forEach((card, index) => card.addEventListener('click', () => {
  galleryOpener = card;
  showGalleryPhoto(index, 1, false);
  openModal(galleryDialog);
  if (!galleryPreloads) galleryPreloads = galleryItems.map((item) => {
    const preload = new Image();
    preload.src = item.src;
    return preload;
  });
}));
$('.gallery-dialog-close', galleryDialog).addEventListener('click', () => closeModal(galleryDialog));
$('.gallery-arrow-prev', galleryDialog).addEventListener('click', () => moveGallery(-1));
$('.gallery-arrow-next', galleryDialog).addEventListener('click', () => moveGallery(1));
galleryDialog.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    moveGallery(event.key === 'ArrowRight' ? 1 : -1);
  }
});
galleryDialog.addEventListener('close', () => galleryOpener?.focus({ preventScroll: true }));
galleryView.addEventListener('pointerdown', (event) => {
  swipeStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
});
galleryView.addEventListener('pointerup', (event) => {
  if (!swipeStart || swipeStart.id !== event.pointerId) return;
  const deltaX = event.clientX - swipeStart.x;
  const deltaY = event.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) moveGallery(deltaX < 0 ? 1 : -1);
});
galleryView.addEventListener('pointercancel', () => { swipeStart = null; });

// A few millimetres of depth on the official dish photo area.
const dishStage = $('#dish-stage');
if (finePointer.matches && !reducedMotion.matches) {
  dishStage.addEventListener('pointermove', (event) => {
    const rect = dishStage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    dishStage.style.setProperty('--dish-ry', `${x * 6}deg`);
    dishStage.style.setProperty('--dish-rx', `${-y * 6}deg`);
  });
  dishStage.addEventListener('pointerleave', () => {
    dishStage.style.setProperty('--dish-ry', '0deg');
    dishStage.style.setProperty('--dish-rx', '0deg');
  });
}

// Draw the silk once. Pointer interaction only moves the composited canvas layer.
const canvas = $('#silk-canvas');
const context = canvas.getContext('2d', { alpha: true });
let width = 0;
let height = 0;
let pixelRatio = 1;

function resizeCanvas() {
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  pixelRatio = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.35);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  drawSilk();
}

function silkPoint(u, v, time, second = false) {
  const mobile = width < 800;
  const cx = width * (mobile ? .57 : .67);
  const cy = height * (mobile ? .35 : .52);
  const phase = second ? 1.9 : 0;
  const offset = second ? -.11 : 0;
  const fold = Math.sin(v * 3.25 + time * .45 + phase) * .5 + .5;
  const x = cx + offset * width + v * width * (mobile ? .43 : .37)
    + Math.sin(v * 3.5 + time * .33 + phase) * width * (mobile ? .08 : .073)
    + u * width * (mobile ? .22 : .145) * Math.cos(v * 2.2 + time * .26 + phase);
  const y = cy + v * height * (mobile ? .35 : .39)
    + u * height * (mobile ? .11 : .15)
    + Math.sin(u * 3.8 + v * 2.7 + time * .35 + phase) * height * .039
    + fold * height * .027;
  return [x, y];
}

function drawSurface(time, second = false) {
  const mobile = width < 800;
  const threads = mobile ? (lowPower ? 40 : 58) : (lowPower ? 64 : 88);
  const steps = mobile ? (lowPower ? 36 : 50) : (lowPower ? 48 : 62);
  for (let index = 0; index < threads; index++) {
    const u = index / (threads - 1) * 2 - 1;
    const foldLight = Math.sin(u * 8.2 + time * .28 + (second ? 2 : 0));
    const edge = 1 - Math.pow(Math.abs(u), 2.6);
    const copper = Math.max(0, Math.sin(u * 11 + time * .14)) * 34;
    const red = Math.round(95 + copper + foldLight * 35 + edge * 35);
    const green = Math.round(22 + copper * .65 + foldLight * 14 + edge * 22);
    const blue = Math.round(19 + copper * .38 + foldLight * 7 + edge * 12);
    const alpha = (second ? .19 : .43) + edge * (second ? .08 : .30);
    const first = silkPoint(u, -1.18, time, second);
    const last = silkPoint(u, 1.18, time, second);
    const gradient = context.createLinearGradient(first[0], first[1], last[0], last[1]);
    gradient.addColorStop(0, `rgba(35,8,8,${alpha * .18})`);
    gradient.addColorStop(.18, `rgba(${red},${green},${blue},${alpha * .7})`);
    gradient.addColorStop(.48, `rgba(${Math.min(255, red + 42)},${Math.min(255, green + 25)},${Math.min(255, blue + 18)},${alpha})`);
    gradient.addColorStop(.76, `rgba(${red},${green},${blue},${alpha * .75})`);
    gradient.addColorStop(1, `rgba(31,7,8,${alpha * .12})`);
    context.beginPath();
    context.moveTo(first[0], first[1]);
    for (let step = 1; step <= steps; step++) {
      const v = -1.18 + step / steps * 2.36;
      const point = silkPoint(u, v, time, second);
      context.lineTo(point[0], point[1]);
    }
    context.strokeStyle = gradient;
    context.lineWidth = (mobile ? 3.2 : 4.6) + edge * (mobile ? .9 : 1.4);
    context.stroke();
    if (index % 13 === 0) {
      context.strokeStyle = `rgba(244,180,126,${(second ? .09 : .20) + edge * .2})`;
      context.lineWidth = .75;
      context.stroke();
    }
  }
}

function drawSilk() {
  if (!context) return;
  context.clearRect(0, 0, width, height);
  context.save();
  context.globalCompositeOperation = 'screen';
  drawSurface(0, true);
  drawSurface(0, false);
  context.restore();
}

if (context) {
  resizeCanvas();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 160);
  }, { passive: true });

  if (finePointer.matches) {
    const hero = $('.hero');
    let scheduled = false;
    let nextX = 0;
    let nextY = 0;
    hero.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches) return;
      const rect = hero.getBoundingClientRect();
      nextX = ((event.clientX - rect.left) / rect.width - .5) * 20;
      nextY = ((event.clientY - rect.top) / rect.height - .5) * 15;
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        canvas.style.transform = `translate3d(${nextX}px, ${nextY}px, 0) scale(1.04)`;
        scheduled = false;
      });
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { canvas.style.transform = ''; });
  }
}
