/**
 * ====================================================================
 * BIRTHDAY WEBSITE INTERACTIVE LOGIC (BLACK & WHITE MINIMALIST)
 * - Local HTML5 Audio with Spinning Vinyl Disc & Real-Time Synced Lyrics
 * - Balloon Click-to-Inflate & Pop Revealing Paper Wish Slips
 * - Tactile Pull-to-Tear VIP Ticket for Page Transition
 * - Minimalist Monochrome Confetti & Canvas Sparkles
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Content from BIRTHDAY_CONFIG
  initConfiguration();

  // 2. Initialize Ambient Monochrome Sparkles
  initSparklesCanvas();

  // 3. Initialize Synthesized Audio (Web Audio API)
  initAudioSystem();

  // 4. Initialize Interactive Gift Box Intro
  initGiftBoxIntro();

  // 5. Initialize Korean Birthday Song Player & Synced Lyrics
  initMusicPlayer();

  // 6. Initialize Cake, Candle Blowing & Draggable Ticket Pull
  initCakeAndTicketPull();

  // 7. Initialize Balloons (Inflate -> Pop -> Reveal Paper Wish)
  initBalloons();

  // 8. Initialize Taglish Birthday Envelope & Letter
  initLetterEnvelope();

  // 9. Extra Confetti Shower
  initExtraFeatures();
});


/* ====================================================================
   1. BIND CONFIGURATION TO DOM
   ==================================================================== */
function initConfiguration() {
  if (typeof BIRTHDAY_CONFIG === 'undefined') return;

  const cfg = BIRTHDAY_CONFIG;

  // Recipient Names
  const nameTargets = ['tagRecipientName', 'heroRecipientName', 'footerRecipientName'];
  nameTargets.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = cfg.recipientName || 'Jie';
  });

  // Korean Greeting
  const korGreet = document.getElementById('koreanGreeting');
  if (korGreet && cfg.koreanGreeting) korGreet.textContent = cfg.koreanGreeting;

  // Title & Subtitle
  const celebTitle = document.getElementById('celebrationTitle');
  if (celebTitle && cfg.titleGreeting) {
    celebTitle.innerHTML = cfg.titleGreeting.replace(
      cfg.recipientName,
      `<span class="highlight-name">${cfg.recipientName}</span>`
    );
  }

  const celebSubtitle = document.getElementById('celebrationSubtitle');
  if (celebSubtitle && cfg.subtitleGreeting) {
    celebSubtitle.textContent = cfg.subtitleGreeting;
  }

  // Hero Cat GIF & Fallback
  setupGifWithFallback('heroGif', 'heroGifFallback');

  // Populate Balloon Prompts & Placeholders (Jie will write her own wishes!)
  const prompts = cfg.balloonPrompts || cfg.balloonWishes;
  if (Array.isArray(prompts)) {
    prompts.forEach(item => {
      const tagEl = document.getElementById(`slipTag${item.id}`);
      const titleEl = document.getElementById(`slipTitle${item.id}`);
      const inputEl = document.getElementById(`wishInput${item.id}`);

      if (tagEl && item.tag) tagEl.textContent = item.tag;
      if (titleEl && item.title) titleEl.textContent = item.title;
      if (inputEl && (item.placeholder || item.message)) {
        inputEl.placeholder = item.placeholder || item.message;
      }
    });
  }

  // Populate Taglish Birthday Letter
  if (cfg.letter) {
    const salutation = document.getElementById('letterSalutation');
    if (salutation) {
      if (cfg.letter.salutation) {
        salutation.textContent = cfg.letter.salutation;
        salutation.style.display = 'block';
      } else {
        salutation.style.display = 'none';
      }
    }

    const letterTag = document.getElementById('letterTag');
    if (letterTag && cfg.letter.tag) letterTag.textContent = cfg.letter.tag;

    const parasContainer = document.getElementById('letterParagraphs');
    if (parasContainer && Array.isArray(cfg.letter.paragraphs)) {
      parasContainer.innerHTML = '';
      cfg.letter.paragraphs.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        parasContainer.appendChild(p);
      });
    }

    const closing = document.getElementById('letterClosing');
    const signature = document.getElementById('letterSignature');
    const closingWrapper = closing ? closing.parentElement : null;

    if (closing) {
      if (cfg.letter.closing) {
        closing.textContent = cfg.letter.closing;
        closing.style.display = 'block';
      } else {
        closing.style.display = 'none';
      }
    }

    if (signature) {
      if (cfg.letter.signature) {
        signature.textContent = cfg.letter.signature;
        signature.style.display = 'block';
      } else {
        signature.style.display = 'none';
      }
    }

    if (closingWrapper && closingWrapper.classList.contains('letter-closing')) {
      if (!cfg.letter.closing && !cfg.letter.signature) {
        closingWrapper.style.display = 'none';
      } else {
        closingWrapper.style.display = 'block';
      }
    }
  }
}

function setupGifWithFallback(imgId, fallbackId) {
  const img = document.getElementById(imgId);
  const fallback = document.getElementById(fallbackId);
  if (!img) return;

  img.addEventListener('error', () => {
    img.style.display = 'none';
    if (fallback) fallback.classList.add('active');
  });

  if (img.complete && img.naturalWidth === 0) {
    img.style.display = 'none';
    if (fallback) fallback.classList.add('active');
  }
}


/* ====================================================================
   2. SYNTHESIZED SOUND SYSTEM (Web Audio API)
   ==================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioSystem() {
  const toggleBtn = document.getElementById('soundToggleBtn');
  const soundLabel = toggleBtn ? toggleBtn.querySelector('.sound-label') : null;

  function updateBtnUI() {
    if (soundLabel) soundLabel.textContent = soundEnabled ? 'Sound On' : 'Muted';
    if (toggleBtn) toggleBtn.style.opacity = soundEnabled ? '1' : '0.65';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEnabled = !soundEnabled;
      updateBtnUI();
      if (soundEnabled) {
        ensureAudioCtx();
        playSound('pop');
      }
    });
  }
}

function ensureAudioCtx() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playSound(type, param) {
  if (!soundEnabled) return;
  try {
    ensureAudioCtx();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    if (type === 'chime' || type === 'box-open') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });
    } else if (type === 'ticket') {
      // Crisp paper tearing noise + rising glissando chime
      const bufferSize = audioCtx.sampleRate * 0.15;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.04));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3.0, now);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + 0.16);

      // Chime accent
      setTimeout(() => playSound('sparkle'), 120);
    } else if (type === 'pump') {
      // Balloon inflation sound with rising pitch per click
      const clickCount = param || 1;
      const baseFreq = 260 + clickCount * 85;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 90, now + 0.1);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'burst') {
      // Rubber balloon pop: loud crack noise + deep bass pop
      const bufferSize = audioCtx.sampleRate * 0.14;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.025));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      noise.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + 0.14);

      // Deep bass punch
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.1);
      oscGain.gain.setValueAtTime(0.65, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    } else if (type === 'pop') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } else if (type === 'blow') {
      // Soft breath / wind blowing sound
      const bufferSize = audioCtx.sampleRate * 0.35;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.linearRampToValueAtTime(180, now + 0.35);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
      noise.stop(now + 0.35);

      setTimeout(() => playSound('sparkle'), 250);
    } else if (type === 'sparkle') {
      const freqs = [880, 1174.66, 1318.51];
      freqs.forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.06);

        gain.gain.setValueAtTime(0.14, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.28);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.32);
      });
    }
  } catch (err) {
    console.debug('Audio playback note:', err);
  }
}


/* ====================================================================
   3. INTRO SCREEN & ANIMATED GIFT BOX
   ==================================================================== */
function initGiftBoxIntro() {
  const introOverlay = document.getElementById('giftIntroOverlay');
  const giftBox = document.getElementById('interactiveGiftBox');
  const mainCelebration = document.getElementById('mainCelebration');

  let hasOpened = false;

  function openGiftSurprise() {
    if (hasOpened) return;
    hasOpened = true;

    if (giftBox) giftBox.classList.add('open');
    playSound('box-open');

    fireBurstConfetti(window.innerWidth / 2, window.innerHeight / 2, 60);

    setTimeout(() => {
      if (introOverlay) introOverlay.classList.add('fade-out');

      if (mainCelebration) {
        mainCelebration.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      setTimeout(() => {
        fireCelebrationShower();
        if (introOverlay) introOverlay.style.display = 'none';
      }, 500);
    }, 550);
  }

  if (giftBox) {
    giftBox.addEventListener('click', openGiftSurprise);
    giftBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGiftSurprise();
      }
    });
  }
}


/* ====================================================================
   4. KOREAN BIRTHDAY SONG (DISC PLAYER + REAL-TIME SYNCED LYRICS)
   ==================================================================== */
function initMusicPlayer() {
  const audio = document.getElementById('birthdayAudio');
  const playBtn = document.getElementById('audioPlayBtn');
  const vinylDisc = document.getElementById('vinylDisc');
  const lyricsLines = document.getElementById('lyricsLines');
  const progressBar = document.getElementById('playerProgressBar');
  const progressFill = document.getElementById('playerProgressFill');
  const currentTimeEl = document.getElementById('playerCurrentTime');
  const durationEl = document.getElementById('playerDuration');
  const directLink = document.getElementById('directYoutubeLink');

  // Fallback YouTube Link
  const watchUrl = BIRTHDAY_CONFIG?.youtube?.watchUrl || 'https://www.youtube.com/shorts/tSzsjx-i5vY';
  if (directLink) directLink.href = watchUrl;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Render Synced Lyrics from Configuration
  if (lyricsLines && Array.isArray(BIRTHDAY_CONFIG.lyrics)) {
    lyricsLines.innerHTML = '';
    BIRTHDAY_CONFIG.lyrics.forEach((item, index) => {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'lyric-item';
      lineDiv.dataset.index = index;
      lineDiv.dataset.start = item.start;
      lineDiv.dataset.end = item.end;
      lineDiv.innerHTML = `
        <div class="lyric-kor">${item.kor}</div>
        <div class="lyric-rom">${item.rom} • ${item.eng}</div>
      `;

      // Allow clicking a line to seek directly
      lineDiv.addEventListener('click', () => {
        if (!audio) return;
        audio.currentTime = item.start;
        if (audio.paused) {
          audio.play().then(() => {
            if (playBtn) playBtn.textContent = 'Pause';
            if (vinylDisc) vinylDisc.classList.add('playing');
          }).catch(console.warn);
        }
      });

      lyricsLines.appendChild(lineDiv);
    });
  }

  // Audio Play / Pause Toggle
  if (playBtn && audio) {
    playBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play().then(() => {
          playBtn.textContent = 'Pause';
          if (vinylDisc) vinylDisc.classList.add('playing');
          fireBurstConfetti(window.innerWidth / 2, window.innerHeight * 0.45, 30);
        }).catch(err => {
          console.warn('Playback error:', err);
        });
      } else {
        audio.pause();
        playBtn.textContent = 'Play Song';
        if (vinylDisc) vinylDisc.classList.remove('playing');
      }
    });

    audio.addEventListener('loadedmetadata', () => {
      if (durationEl && audio.duration) {
        durationEl.textContent = formatTime(audio.duration);
      }
    });

    // Real-Time Synced Lyrics & Progress Tracking
    audio.addEventListener('timeupdate', () => {
      const curTime = audio.currentTime;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(curTime);

      if (progressFill && audio.duration) {
        const pct = (curTime / audio.duration) * 100;
        progressFill.style.width = `${pct}%`;
      }

      // Synchronize active lyric row
      if (lyricsLines) {
        const lyricRows = lyricsLines.querySelectorAll('.lyric-item');
        lyricRows.forEach(row => {
          const start = parseFloat(row.dataset.start);
          const end = parseFloat(row.dataset.end);

          if (curTime >= start && curTime < end) {
            if (!row.classList.contains('active')) {
              row.classList.add('active');
              row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          } else {
            row.classList.remove('active');
          }
        });
      }
    });

    // Reset when audio ends
    audio.addEventListener('ended', () => {
      playBtn.textContent = 'Play Song';
      if (vinylDisc) vinylDisc.classList.remove('playing');
      if (progressFill) progressFill.style.width = '0%';
      if (currentTimeEl) currentTimeEl.textContent = '0:00';

      if (lyricsLines) {
        lyricsLines.querySelectorAll('.lyric-item').forEach(r => r.classList.remove('active'));
      }
    });

    // Seek on progress bar click
    if (progressBar) {
      progressBar.addEventListener('click', (e) => {
        if (!audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        audio.currentTime = pct * audio.duration;
      });
    }
  }
}


/* ====================================================================
   5. BIRTHDAY CAKE & INTERACTIVE TICKET PULL (PAGE TRANSITION)
   ==================================================================== */
function initCakeAndTicketPull() {
  const cakeStage = document.getElementById('cakeStage');
  const blowBtn = document.getElementById('blowCandlesBtn');
  const wishContainer = document.getElementById('wishGrantedContainer');
  const ticket = document.getElementById('birthdayTicket');
  const ticketPullHandle = document.getElementById('ticketPullHandle');

  const pageCelebration = document.getElementById('pageCelebration');
  const pageWishesAndLetter = document.getElementById('pageWishesAndLetter');
  const backBtn = document.getElementById('backToCakeBtn');

  const flames = [
    document.getElementById('flame1'),
    document.getElementById('flame2'),
    document.getElementById('flame3')
  ];

  const smokes = [
    document.getElementById('smoke1'),
    document.getElementById('smoke2'),
    document.getElementById('smoke3')
  ];

  let areCandlesBlown = false;
  let isTicketTorn = false;

  function blowCandles() {
    if (areCandlesBlown) return;
    areCandlesBlown = true;

    playSound('blow');

    flames.forEach(f => {
      if (f) f.classList.add('blown-out');
    });

    smokes.forEach(s => {
      if (s) {
        s.classList.remove('puff');
        void s.offsetWidth;
        s.classList.add('puff');
      }
    });

    // Reveal Wish Granted & Ticket Pull Box
    setTimeout(() => {
      if (wishContainer) wishContainer.classList.remove('hidden');
      if (blowBtn) blowBtn.style.display = 'none';

      const rect = cakeStage ? cakeStage.getBoundingClientRect() : null;
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
      const y = rect ? rect.top + rect.height / 3 : window.innerHeight / 2;
      fireBurstConfetti(x, y, 50);

      if (wishContainer) {
        wishContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 400);
  }

  if (cakeStage) cakeStage.addEventListener('click', blowCandles);
  if (blowBtn) blowBtn.addEventListener('click', blowCandles);

  // Transition to Page 2
  function executeTicketTear() {
    if (isTicketTorn) return;
    isTicketTorn = true;

    playSound('ticket');

    if (ticket) ticket.classList.add('tearing');

    const rect = ticket ? ticket.getBoundingClientRect() : null;
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    fireBurstConfetti(x, y, 60);

    setTimeout(() => {
      if (pageCelebration) {
        pageCelebration.classList.remove('active');
        pageCelebration.classList.add('hidden');
      }
      if (pageWishesAndLetter) {
        pageWishesAndLetter.classList.remove('hidden');
        pageWishesAndLetter.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      setTimeout(() => fireCelebrationShower(), 200);
    }, 450);
  }

  // Tactile Drag / Swipe & Click Ticket Pull
  if (ticket && ticketPullHandle) {
    let startX = 0;
    let currentDragX = 0;
    let isDragging = false;
    let wasDragging = false;

    function handleDragStart(clientX) {
      if (isTicketTorn) return;
      isDragging = true;
      wasDragging = false;
      startX = clientX;
      currentDragX = 0;
      ticketPullHandle.style.transition = 'none';
    }

    function handleDragMove(clientX) {
      if (!isDragging || isTicketTorn) return;
      const deltaX = clientX - startX;
      if (Math.abs(deltaX) > 6) wasDragging = true;
      currentDragX = Math.max(0, Math.min(80, deltaX));
      ticketPullHandle.style.transform = `translateX(${currentDragX}px)`;
    }

    function handleDragEnd() {
      if (!isDragging || isTicketTorn) return;
      isDragging = false;

      // If dragged past threshold (35px), tear ticket!
      if (currentDragX >= 35) {
        ticketPullHandle.style.transition = 'transform 0.25s ease';
        ticketPullHandle.style.transform = 'translateX(65px)';
        executeTicketTear();
      } else {
        // Snap back
        ticketPullHandle.style.transition = 'transform 0.25s ease';
        ticketPullHandle.style.transform = 'translateX(0)';
        // Reset wasDragging after short delay so click event doesn't trigger tear
        setTimeout(() => { wasDragging = false; }, 200);
      }
    }

    // Touch events for phones
    ticketPullHandle.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) handleDragStart(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches && e.touches[0]) {
        handleDragMove(e.touches[0].clientX);
      }
    }, { passive: true });

    window.addEventListener('touchend', handleDragEnd);

    // Mouse events for desktop
    ticketPullHandle.addEventListener('mousedown', (e) => {
      handleDragStart(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) handleDragMove(e.clientX);
    });

    window.addEventListener('mouseup', handleDragEnd);

    // Click / Tap Fallback: If clicked, also pull smoothly to tear
    ticket.addEventListener('click', (e) => {
      if (isTicketTorn) return;
      if (wasDragging) return;
      // Animate pull forward
      ticketPullHandle.style.transition = 'transform 0.22s ease';
      ticketPullHandle.style.transform = 'translateX(55px)';
      setTimeout(() => {
        executeTicketTear();
      }, 180);
    });
  }

  // Back Button -> Return to Page 1
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      playSound('sparkle');
      isTicketTorn = false;

      if (ticket) {
        ticket.classList.remove('tearing');
        if (ticketPullHandle) {
          ticketPullHandle.style.transform = 'translateX(0)';
        }
      }

      if (pageWishesAndLetter) {
        pageWishesAndLetter.classList.remove('active');
        pageWishesAndLetter.classList.add('hidden');
      }
      if (pageCelebration) {
        pageCelebration.classList.remove('hidden');
        pageCelebration.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}


/* ====================================================================
   6. THREE BALLOONS (GAME HITBOX COMBO x1, x2, x3, x4 -> POP & WISH)
   ==================================================================== */
function spawnHitboxPopup(x, y, text, isCritical = false) {
  const el = document.createElement('div');
  el.className = isCritical ? 'hitbox-popup critical' : 'hitbox-popup';
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 550);
}

function initBalloons() {
  const balloonUnits = [1, 2, 3];
  const balloonsHint = document.getElementById('balloonsHint');

  balloonUnits.forEach(id => {
    const balloonUnit = document.getElementById(`balloonUnit${id}`);
    const balloonGraphic = document.getElementById(`balloonGraphic${id}`);
    const balloonStatus = document.getElementById(`balloonStatus${id}`);
    const paperSlip = document.getElementById(`paperWishSlip${id}`);

    const writeMode = document.getElementById(`writeMode${id}`);
    const sealedMode = document.getElementById(`sealedMode${id}`);
    const wishInput = document.getElementById(`wishInput${id}`);
    const sealedText = document.getElementById(`sealedText${id}`);

    const saveBtn = paperSlip ? paperSlip.querySelector(`.slip-save-btn[data-wish="${id}"]`) : null;
    const editBtn = paperSlip ? paperSlip.querySelector(`.slip-edit-btn[data-wish="${id}"]`) : null;
    const resetBtn = paperSlip ? paperSlip.querySelector(`.slip-reset-btn[data-reset="${id}"]`) : null;

    let clicks = 0;
    const clicksToPop = 4;
    let isPopping = false;

    // Check localStorage for previously saved wish on load
    const storageKey = `jie_birthday_wish_${id}`;
    let savedWish = null;
    try {
      savedWish = localStorage.getItem(storageKey);
    } catch (e) {
      console.debug('Storage note:', e);
    }

    if (savedWish && savedWish.trim() !== '') {
      if (balloonGraphic) balloonGraphic.classList.add('popped');
      if (balloonStatus) {
        balloonStatus.textContent = 'x4 POP!';
        balloonStatus.classList.add('popped');
      }
      if (paperSlip) paperSlip.classList.remove('hidden');
      if (writeMode) writeMode.classList.add('hidden');
      if (sealedMode) sealedMode.classList.remove('hidden');
      if (sealedText) sealedText.textContent = savedWish;
      if (wishInput) wishInput.value = savedWish;
      if (balloonsHint) balloonsHint.classList.add('hidden');
    }

    // Balloon Click & Game Hitbox Combo Handler
    if (balloonUnit && balloonGraphic) {
      balloonUnit.addEventListener('click', (e) => {
        if (isPopping || balloonGraphic.classList.contains('popped')) return;

        clicks++;
        const rect = balloonGraphic.getBoundingClientRect();
        const x = e.clientX || (rect.left + rect.width / 2);
        const y = e.clientY || (rect.top + rect.height / 3);

        if (clicks < clicksToPop) {
          const scale = 1 + clicks * 0.22;
          balloonGraphic.style.setProperty('--balloon-scale', scale);
          balloonGraphic.style.transform = `scale(${scale})`;

          balloonGraphic.classList.remove('pumping');
          void balloonGraphic.offsetWidth;
          balloonGraphic.classList.add('pumping');

          // Rising game pump sound
          playSound('pump', clicks);

          // Update game hitbox combo text (x1, x2, x3)
          if (balloonStatus) {
            balloonStatus.textContent = `x${clicks}`;
            balloonStatus.classList.add('combo');
          }

          // Spawn floating arcade hitbox popup
          spawnHitboxPopup(x, y, `x${clicks}`);

          // Small monochrome puff
          fireBurstConfetti(x, y, 10 + clicks * 6);
        } else {
          // 4th Click: BOOM! Critical Hit Pop!
          isPopping = true;
          playSound('burst');

          // Spawn critical hitbox popup
          spawnHitboxPopup(x, y, 'x4 CRITICAL!', true);

          fireBurstConfetti(x, y, 70);

          balloonGraphic.classList.add('popped');

          if (balloonStatus) {
            balloonStatus.textContent = 'x4 POP!';
            balloonStatus.classList.remove('combo');
            balloonStatus.classList.add('popped');
          }

          // Hide instructional hint
          if (balloonsHint) balloonsHint.classList.add('hidden');

          // Reveal Paper Wish Slip for writing
          setTimeout(() => {
            if (paperSlip) {
              paperSlip.classList.remove('hidden');
              paperSlip.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              playSound('sparkle');

              if (wishInput && (!savedWish || (writeMode && !writeMode.classList.contains('hidden')))) {
                setTimeout(() => wishInput.focus(), 300);
              }
            }
            isPopping = false;
          }, 200);
        }
      });
    }

    // Save Wish Button Click (Jie seals her wish)
    if (saveBtn) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const text = wishInput ? wishInput.value.trim() : '';

        if (!text) {
          // Empty check: gentle shake on textarea
          if (wishInput) {
            wishInput.classList.remove('shake');
            void wishInput.offsetWidth;
            wishInput.classList.add('shake');
            wishInput.placeholder = 'Please write your wish before sealing, Jie!';
            wishInput.focus();
          }
          playSound('pop');
          return;
        }

        // Save to localStorage
        try {
          localStorage.setItem(storageKey, text);
          savedWish = text;
        } catch (e) {
          console.warn('localStorage note:', e);
        }

        // Switch to Sealed Display Mode
        if (sealedText) sealedText.textContent = text;
        if (writeMode) writeMode.classList.add('hidden');
        if (sealedMode) sealedMode.classList.remove('hidden');

        if (balloonStatus) balloonStatus.textContent = 'x4 POP!';

        // Celebratory sound and confetti
        playSound('chime');
        const rect = saveBtn.getBoundingClientRect();
        fireBurstConfetti(rect.left + rect.width / 2, rect.top, 40);
      });
    }

    // Edit Wish Button Click (Jie modifies her wish)
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        playSound('sparkle');
        if (sealedMode) sealedMode.classList.add('hidden');
        if (writeMode) writeMode.classList.remove('hidden');
        if (wishInput) {
          wishInput.focus();
          wishInput.setSelectionRange(wishInput.value.length, wishInput.value.length);
        }
      });
    }

    // Reset Balloon Button Click (Re-pop the balloon)
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        playSound('sparkle');

        // Reset balloon state
        clicks = 0;
        isPopping = false;

        if (balloonGraphic) {
          balloonGraphic.style.removeProperty('--balloon-scale');
          balloonGraphic.style.transform = '';
          balloonGraphic.classList.remove('popped', 'pumping');
          balloonGraphic.classList.add('respawning');

          setTimeout(() => {
            balloonGraphic.classList.remove('respawning');
          }, 700);
        }

        if (balloonStatus) {
          balloonStatus.textContent = 'x0';
          balloonStatus.classList.remove('popped', 'combo');
        }

        // Hide paper slip
        if (paperSlip) paperSlip.classList.add('hidden');

        // If no slips are visible, show the hint again
        const visibleSlips = document.querySelectorAll('.paper-wish-slip:not(.hidden)');
        if (visibleSlips.length === 0 && balloonsHint) {
          balloonsHint.classList.remove('hidden');
        }
      });
    }
  });
}


/* ====================================================================
   7. TAGLISH BIRTHDAY LETTER ENVELOPE
   ==================================================================== */
function initLetterEnvelope() {
  const envelope = document.getElementById('interactiveEnvelope');
  const wrapper = document.getElementById('envelopeWrapper');
  const toggleBtn = document.getElementById('toggleLetterBtn');

  let isOpen = false;

  function toggleEnvelope() {
    isOpen = !isOpen;
    playSound(isOpen ? 'box-open' : 'sparkle');

    if (envelope) envelope.classList.toggle('open', isOpen);
    if (wrapper) wrapper.classList.toggle('expanded', isOpen);

    if (toggleBtn) {
      toggleBtn.textContent = isOpen ? 'Close Envelope' : 'Open Envelope';
      toggleBtn.className = isOpen ? 'cute-btn outline-btn' : 'cute-btn primary-btn';
    }

    if (isOpen) {
      setTimeout(() => {
        const rect = envelope ? envelope.getBoundingClientRect() : null;
        if (rect) fireBurstConfetti(rect.left + rect.width / 2, rect.top, 35);
      }, 500);
    }
  }

  if (envelope) {
    envelope.addEventListener('click', (e) => {
      // Don't close if user is selecting/reading text in the letter
      if (e.target.closest('.paper-letter') && isOpen) return;
      toggleEnvelope();
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleEnvelope);
  }
}


/* ====================================================================
   8. EXTRA CONFETTI SHOWER
   ==================================================================== */
function initExtraFeatures() {
  const extraBtn = document.getElementById('extraConfettiBtn');
  if (extraBtn) {
    extraBtn.addEventListener('click', () => {
      playSound('chime');
      fireCelebrationShower();
    });
  }
}


/* ====================================================================
   9. MONOCHROME CANVAS CONFETTI ENGINE
   ==================================================================== */
const confettiParticles = [];
let confettiCanvas = null;
let confettiCtx = null;
let isConfettiLoopRunning = false;

function ensureConfettiCanvas() {
  if (!confettiCanvas) {
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'activeConfettiCanvas';
    confettiCanvas.style.position = 'fixed';
    confettiCanvas.style.inset = '0';
    confettiCanvas.style.width = '100%';
    confettiCanvas.style.height = '100%';
    confettiCanvas.style.pointerEvents = 'none';
    confettiCanvas.style.zIndex = '1500';
    document.body.appendChild(confettiCanvas);

    confettiCtx = confettiCanvas.getContext('2d');
    resizeConfettiCanvas();
    window.addEventListener('resize', resizeConfettiCanvas);
  }
}

function resizeConfettiCanvas() {
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth * window.devicePixelRatio;
    confettiCanvas.height = window.innerHeight * window.devicePixelRatio;
    confettiCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
}

// Sophisticated Black & White Minimalist Confetti Palette
const MONOCHROME_CONFETTI_COLORS = [
  '#000000', '#1C1C1C', '#333333', '#525252',
  '#737373', '#A3A3A3', '#D4D4D4', '#EAEAEA', '#FFFFFF'
];

function fireBurstConfetti(originX, originY, count = 45) {
  ensureConfettiCanvas();
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    confettiParticles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      color: MONOCHROME_CONFETTI_COLORS[Math.floor(Math.random() * MONOCHROME_CONFETTI_COLORS.length)],
      size: Math.random() * 8 + 5,
      tilt: Math.random() * 10,
      tiltSpeed: Math.random() * 0.1 + 0.05,
      alpha: 1,
      gravity: 0.18,
      drag: 0.98,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 8
    });
  }
  if (!isConfettiLoopRunning) runConfettiLoop();
}

function fireCelebrationShower() {
  ensureConfettiCanvas();
  const width = window.innerWidth;
  for (let i = 0; i < 75; i++) {
    confettiParticles.push({
      x: Math.random() * width,
      y: -20 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      color: MONOCHROME_CONFETTI_COLORS[Math.floor(Math.random() * MONOCHROME_CONFETTI_COLORS.length)],
      size: Math.random() * 9 + 5,
      tilt: Math.random() * 10,
      tiltSpeed: Math.random() * 0.08 + 0.04,
      alpha: 1,
      gravity: 0.12,
      drag: 0.99,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6
    });
  }
  if (!isConfettiLoopRunning) runConfettiLoop();
}

function runConfettiLoop() {
  if (confettiParticles.length === 0) {
    if (confettiCtx && confettiCanvas) {
      confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    isConfettiLoopRunning = false;
    return;
  }

  isConfettiLoopRunning = true;
  confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = confettiParticles.length - 1; i >= 0; i--) {
    const p = confettiParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.vx *= p.drag;
    p.rotation += p.rotSpeed;
    p.tilt += p.tiltSpeed;

    if (p.y > window.innerHeight - 100) p.alpha -= 0.025;

    if (p.alpha <= 0 || p.y > window.innerHeight + 50) {
      confettiParticles.splice(i, 1);
      continue;
    }

    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate((p.rotation * Math.PI) / 180);
    confettiCtx.globalAlpha = Math.max(0, p.alpha);
    confettiCtx.fillStyle = p.color;

    const w = p.size;
    const h = p.size * Math.cos(p.tilt);
    confettiCtx.fillRect(-w / 2, -h / 2, w, Math.abs(h));
    confettiCtx.restore();
  }

  requestAnimationFrame(runConfettiLoop);
}


/* ====================================================================
   10. AMBIENT MONOCHROME SPARKLES CANVAS
   ==================================================================== */
function initSparklesCanvas() {
  const canvas = document.getElementById('sparklesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  const stars = [];
  const starCount = 28;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const starColors = ['#1C1C1C', '#555555', '#888888', '#B0B0B0', '#FFFFFF'];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 1,
      speedY: -(Math.random() * 0.25 + 0.08),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.6 + 0.25,
      pulse: Math.random() * 0.03 + 0.015,
      color: starColors[Math.floor(Math.random() * starColors.length)]
    });
  }

  function drawSparkle(x, y, size, opacity, color) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    if (size > 1.8) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x - size * 2, y);
      ctx.lineTo(x + size * 2, y);
      ctx.moveTo(x, y - size * 2);
      ctx.lineTo(x, y + size * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function animateStars() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(s => {
      s.y += s.speedY;
      s.x += s.speedX;
      s.opacity += s.pulse;

      if (s.opacity > 0.85 || s.opacity < 0.2) s.pulse = -s.pulse;
      if (s.y < -10) s.y = height + 10;
      if (s.x < -10) s.x = width + 10;
      if (s.x > width + 10) s.x = -10;

      drawSparkle(s.x, s.y, s.size, s.opacity, s.color);
    });

    requestAnimationFrame(animateStars);
  }

  animateStars();
}
