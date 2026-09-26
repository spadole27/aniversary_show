const curtainStage = document.querySelector('.curtain-stage');
const page = document.querySelector('.page');
const floatingHearts = document.querySelector('.floating-hearts');

const introSlideshowEl = document.getElementById('introSlideshow');
const introImgA = document.getElementById('introImgA');
const introImgB = document.getElementById('introImgB');
const photoTrigger = document.querySelector('.scene-photo-trigger');
const photoLightbox = document.getElementById('photoLightbox');
const lightboxImage = document.getElementById('lightboxImage');

if (photoTrigger && photoLightbox && lightboxImage) {
  const scenePhoto = photoTrigger.querySelector('.scene-photo');
  const closeButton = photoLightbox.querySelector('.photo-lightbox-close');

  photoTrigger.addEventListener('click', () => {
    lightboxImage.src = scenePhoto.src;
    lightboxImage.alt = scenePhoto.alt;
    photoLightbox.showModal();
  });

  closeButton.addEventListener('click', () => photoLightbox.close());
  photoLightbox.addEventListener('click', (event) => {
    if (event.target === photoLightbox) photoLightbox.close();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && photoLightbox.open) photoLightbox.close();
  });
}

// Timing (ms)
const CURTAIN_OPEN_DELAY = 300;
const CURTAIN_OPEN_DURATION = 3200; // keep in sync with CSS
const INTRO_SLIDE_INTERVAL = 3500;
const INTRO_CYCLES = 1; // full loops during intro
const INTRO_COUNT = 6; // number of images to show in the cinematic intro

let floatingHeartsIntervalId = null;

setTimeout(() => {
  curtainStage.classList.add('open');
}, CURTAIN_OPEN_DELAY);

function createFloatingHeart() {
  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = '❤';
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDelay = `${Math.random() * 3}s`;
  heart.style.fontSize = `${Math.random() * 18 + 18}px`;
  floatingHearts.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 9000);
}

function startFloatingHearts() {
  if (floatingHeartsIntervalId) return;
  floatingHeartsIntervalId = setInterval(createFloatingHeart, 600);
}

const slides = [
  {
    src: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    text: 'Our first smile together'
  },
  {
    src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    text: 'Every moment with you feels special'
  },
  {
    src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80',
    text: 'Love grows stronger with time'
  },
  {
    src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    text: 'The best memories are with you'
  }
];

// Try to load local manifest (Images folder) so images stay on-device.
fetch('./images-manifest.json').then(res => {
  if (!res.ok) throw new Error('no manifest');
  return res.json();
}).then(list => {
  if (!Array.isArray(list) || !list.length) return;
  // use manifest entries as slides (paths are relative, keep on-device)
  slides.length = 0;
  list.forEach(item => {
    // Ensure proper URI encoding for spaces
    const src = encodeURI(item.src);
    slides.push({ src, text: item.text || '' });
  });
  // update UI
  currentSlide = 0;
  renderSlide(currentSlide);
  clearInterval(galleryAutoId);
  galleryAutoId = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    renderSlide(currentSlide);
  }, 3500);
  // populate cascade immediately so thumbnails are visible after curtain opens
  populateCascade(slides);
}).catch(() => {
  // manifest not available (file protocol or blocked) — fall back to remote slides
});

// Allow user to import local images (from Images folder via file picker)
const photoFilesInput = document.getElementById('photoFiles');
let localObjectUrls = [];

function useFilesAsSlides(fileList) {
  const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
  if (!files.length) return;
  // revoke old urls
  localObjectUrls.forEach(u => URL.revokeObjectURL(u));
  localObjectUrls = files.map(f => URL.createObjectURL(f));
  // replace slides array content
  slides.length = 0;
  localObjectUrls.forEach((url, i) => slides.push({ src: url, text: `Memory ${i + 1}` }));
  // reset gallery and intro to use new slides
  currentSlide = 0;
  renderSlide(currentSlide);
  clearInterval(galleryAutoId);
  galleryAutoId = setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    renderSlide(currentSlide);
  }, 3500);
  // populate cascade with imported slides immediately
  populateCascade(slides);
}

// wire file input -> use files
if (photoFilesInput) {
  photoFilesInput.addEventListener('change', (e) => {
    useFilesAsSlides(e.target.files);
  });
  // also allow drag-and-drop folder drop onto the slide-frame
  const frame = document.querySelector('.slide-frame');
  if (frame) {
    frame.addEventListener('dragover', (ev) => ev.preventDefault());
    frame.addEventListener('drop', (ev) => {
      ev.preventDefault();
      const items = ev.dataTransfer.files;
      if (items && items.length) useFilesAsSlides(items);
    });
  }
}

const slideImage = document.getElementById('slide-image');
const slideText = document.getElementById('slide-text');
const slideIndex = document.getElementById('slide-index');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let currentSlide = 0;

function renderSlide(index) {
  const item = slides[index];
  if (!item) return;
  // pick a transition for variety
  const trans = ['fade','zoom','left','right','blur'];
  const t = trans[index % trans.length];

  // OUT animation: use a simple ease-in-out fade with a mild scale to avoid corner jumps
  const outDuration = 320; // ms
  slideImage.style.transition = `opacity ${outDuration}ms ease-in-out, transform ${outDuration}ms ease-in-out, filter ${outDuration}ms ease-in-out`;
  slideImage.style.opacity = '0';
  slideImage.style.transform = 'scale(1.03)';
  slideImage.style.filter = 'none';

  // after out animation, change src and animate IN
  setTimeout(() => {
    // ensure new image is loaded before showing to avoid flash
    const img = new Image();
    img.src = item.src;
    img.onload = () => {
      slideImage.src = item.src;
      slideText.textContent = item.text;
      slideIndex.textContent = String(index + 1).padStart(2, '0');

      // reset transforms and animate in with ease-in-out fade
      slideImage.style.transition = `opacity 600ms ease-in-out, transform 700ms ease-in-out`;
      slideImage.style.transform = 'scale(1)';
      slideImage.style.opacity = '1';
    };
    img.onerror = () => {
      // fallback: still set src to attempt display
      slideImage.src = item.src;
      slideText.textContent = item.text;
      slideIndex.textContent = String(index + 1).padStart(2, '0');
      slideImage.style.transition = `opacity 600ms ease-in-out, transform 700ms ease-in-out`;
      slideImage.style.transform = 'scale(1)';
      slideImage.style.opacity = '1';
    };
  }, outDuration + 40);
}

prevButton.addEventListener('click', () => {
  clearInterval(galleryAutoId);
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  renderSlide(currentSlide);
});

nextButton.addEventListener('click', () => {
  clearInterval(galleryAutoId);
  currentSlide = (currentSlide + 1) % slides.length;
  renderSlide(currentSlide);
});

// autoplay for the on-page slideshow
let galleryAutoId = setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  renderSlide(currentSlide);
}, 3500);

renderSlide(currentSlide);

// ---------------- Intro cinematic slideshow
function preloadImages(list) {
  return Promise.all(list.map(i => new Promise(resolve => {
    const img = new Image();
    img.src = i.src;
    img.onload = () => resolve();
    img.onerror = () => resolve();
  })));
}

function startIntroSlideshow() {
  if (!introSlideshowEl) return finishIntro();
  introSlideshowEl.classList.add('visible');
  introSlideshowEl.setAttribute('aria-hidden', 'false');
  // Use only first INTRO_COUNT images for cinematic intro
  const introSlides = slides.slice(0, Math.min(INTRO_COUNT, slides.length));
  const remainingSlides = slides.slice(Math.min(INTRO_COUNT, slides.length));

  const imgs = [introImgA, introImgB];
  let toggle = 0;
  let index = 0;
  let cyclesRemaining = INTRO_CYCLES;

  preloadImages(introSlides).then(() => {
    imgs[0].src = introSlides[0].src;
    imgs[0].className = 'active trans-zoom';

    // helper to pick a transition class per image for variety
    const trans = ['trans-fade','trans-zoom','trans-slide-left','trans-slide-right','trans-blur'];

    const introInterval = setInterval(() => {
      index = (index + 1) % introSlides.length;
      const cur = imgs[toggle];
      const next = imgs[toggle ^ 1];
      next.src = introSlides[index].src;
      // assign transition class based on index
      const cls = trans[index % trans.length];
      next.className = ' ' + cls;
      // force style recalc then show
      void next.offsetWidth;
      next.classList.add('active');
      cur.classList.remove('active');
      toggle ^= 1;

      if (index === introSlides.length - 1) {
        cyclesRemaining -= 1;
        if (cyclesRemaining <= 0) {
          clearInterval(introInterval);
          introSlideshowEl.classList.add('fade-out');
          setTimeout(() => {
            introSlideshowEl.classList.remove('visible');
            introSlideshowEl.classList.remove('fade-out');
            introSlideshowEl.setAttribute('aria-hidden', 'true');
            // populate cascade with remainingSlides
            populateCascade(remainingSlides.length ? remainingSlides : introSlides.slice(1));
            finishIntro();
          }, 900);
        }
      }
    }, INTRO_SLIDE_INTERVAL);
  });
}

function populateCascade(list) {
  const track = document.getElementById('cascadeTrack');
  const slider = document.getElementById('cascadeSlider');
  if (!track || !slider || !list.length) return;
  slider.setAttribute('aria-hidden', 'false');
  track.innerHTML = '';
  list.forEach((it, i) => {
    const item = document.createElement('div');
    item.className = 'cascade-item';
    const img = document.createElement('img');
    img.src = it.src;
    img.alt = it.text || `Memory ${i+1}`;
    item.appendChild(img);
    track.appendChild(item);
  });
  startCascadeAutoScroll();
}

let cascadeIntervalId = null;
function startCascadeAutoScroll() {
  const track = document.getElementById('cascadeTrack');
  if (!track) return;
  const items = Array.from(track.children);
  if (items.length <= 4) return; // nothing to scroll
  let index = 0;
  const itemWidth = items[0].getBoundingClientRect().width + 12; // gap
  if (cascadeIntervalId) clearInterval(cascadeIntervalId);
  cascadeIntervalId = setInterval(() => {
    index = (index + 1) % items.length;
    const translateX = -index * itemWidth;
    track.style.transform = `translateX(${translateX}px)`;
  }, 2400);
  // touch support pause/resume
  track.addEventListener('touchstart', () => clearInterval(cascadeIntervalId), { passive: true });
  track.addEventListener('touchend', () => startCascadeAutoScroll(), { passive: true });
}

function finishIntro() {
  curtainStage.style.transition = 'opacity 1s ease';
  curtainStage.style.opacity = '0';
  page.classList.remove('hidden');
  page.classList.add('visible');
  startFloatingHearts();
}

// Skip intro slideshow — reveal page immediately after curtain opens with all images in cascade
setTimeout(() => {
  finishIntro();
  // populate cascade with all slides (no intro screen)
  populateCascade(slides);
}, CURTAIN_OPEN_DELAY + CURTAIN_OPEN_DURATION + 100);

// Respect user's reduced motion preference: skip intro and heavy animations
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // cancel intro if scheduled and reveal content immediately
  setTimeout(() => finishIntro(), CURTAIN_OPEN_DELAY + 600);
}

/* Touch/swipe support for on-page slideshow (mobile-friendly) */
;(function attachSwipe() {
  const frame = document.querySelector('.slide-frame');
  if (!frame) return;
  let startX = 0;
  let endX = 0;
  frame.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  frame.addEventListener('touchmove', (e) => {
    endX = e.touches[0].clientX;
  }, { passive: true });
  frame.addEventListener('touchend', () => {
    const dx = endX - startX;
    if (Math.abs(dx) < 40) return;
    if (dx > 0) {
      // swipe right -> previous
      clearInterval(galleryAutoId);
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      renderSlide(currentSlide);
    } else {
      // swipe left -> next
      clearInterval(galleryAutoId);
      currentSlide = (currentSlide + 1) % slides.length;
      renderSlide(currentSlide);
    }
    startX = endX = 0;
  }, { passive: true });
})();
