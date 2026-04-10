/* ============================================================
   TELEGRAM BIRTHDAY — SCRIPT
   Cinematic message sequencer · YouTube music · Transitions
   ============================================================ */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════
     ① CONFIGURATION — Customize everything here
  ════════════════════════════════════════════════════ */
  const CONFIG = {
    herName: 'Tapswi',
    herInitial: 'T',
    ytVideoId: '1kcCk4YRJdo',   // YouTube video/song ID
    musicVolume: 40,               // 0–100

    /*
      PHOTOS: Replace these with your actual image URLs.
      Options:
        - Google Photos: right-click photo → "Copy image address"
        - Any direct image URL
        - Local files: put them in this folder e.g. 'photo1.jpg'
      Leave src: '' to keep the beautiful gradient placeholder.
    */
    photos: [
      { src: '', emoji: '☀️', gradient: 'photo-grad-1', caption: 'This one made me smile for hours ☀️' },
      { src: '', emoji: '🌙', gradient: 'photo-grad-2', caption: 'My favorite picture of us 🌅' },
      { src: '', emoji: '🌸', gradient: 'photo-grad-3', caption: 'Couldn\'t stop looking at this one 💕' },
      { src: '', emoji: '❤️', gradient: 'photo-grad-4', caption: 'This is us. Always 🥹' },
    ],
  };

  /* ════════════════════════════════════════════════════
     ② MESSAGES — The conversation that changed everything
         Edit/replace these messages with your real ones!
  ════════════════════════════════════════════════════ */
  const MESSAGES = [
    { type: 'date-divider', text: '6 Years ago…' },

    { type: 'recv', text: 'Hi', time: '2:47 PM', gap: 600 },
    { type: 'typing', ms: 1100 },
    { type: 'sent', text: 'Hello', time: '2:47 PM' },
    { type: 'typing', ms: 1600 },
    { type: 'recv', text: 'Kya chal rha hai?', time: '2:48 PM' },
    { type: 'typing', ms: 1000 },
    { type: 'sent', text: 'Bas wahi same study, tum batao', time: '2:48 PM' },
    { type: 'typing', ms: 1900 },
    { type: 'recv', text: 'Kuch nahi, brtn dhoyi kpde saaf kiye room me pochha lga kr abhi khali huyi', time: '2:49 PM' },
    { type: 'typing', ms: 1100 },
    { type: 'sent', text: 'Ha Din bhr time nhi milta na', time: '2:49 PM' },
    { type: 'typing', ms: 1800 },
    { type: 'recv', text: 'Jldi Jldi krke time nikali baat krne ke liye', time: '2:49 PM' },
    { type: 'typing', ms: 700 },
    { type: 'sent', text: 'Achha', time: '2:50 PM' },

    { type: 'date-divider', text: 'A few days later…' },

    { type: 'recv', text: 'Suno', time: '8:21 PM', gap: 800 },
    { type: 'sent', text: 'Haan bolo', time: '8:22 PM' },
    { type: 'typing', ms: 1400 },
    { type: 'recv', text: 'Videocall kare?', time: '8:22 PM' },
    { type: 'sent', text: 'Abhi baahar hu, thodi der me karu?', time: '8:22 PM' },
    { type: 'typing', ms: 2200 },
    { type: 'recv', text: 'Hamesha ka to yhi hai, mat kro jao', time: '8:23 PM' },
    { type: 'sent', text: '😂 Arey gussa mat ho karta hu 5 min me', time: '8:23 PM' },
    { type: 'typing', ms: 2800 },
    { type: 'recv', text: 'Thik', time: '8:24 PM' },

    // { type: 'date-divider', text: 'Some memories…' },

    // { type: 'photo', photoIndex: 0, time: '4:13 PM', gap: 1000 },
    // { type: 'photo', photoIndex: 1, time: '4:14 PM', gap: 700 },

    // { type: 'date-divider', text: 'Our song…' },

    // { type: 'voice', time: '9:30 PM', gap: 900 },

    { type: 'date-divider', text: 'Today…' },

    { type: 'sent', text: 'Oyee', time: '11:57 PM', gap: 1200 },
    { type: 'sent', text: 'So gayi kya?', time: '11:58 PM' },
    { type: 'sent', text: 'Wese hi soch rha tha', time: '11:58 PM' },
    { type: 'typing', ms: 2800 },
    { type: 'recv', text: 'Kya', time: '11:58 PM' },
    { type: 'sent', text: 'New me abhi AI se website bnana sikha hai dikhata hu', time: '11:59 PM' },
    { type: 'typing', ms: 1600 },
    { type: 'recv', text: 'Kya', time: '11:59 PM' },
    { type: 'sent', text: 'Ak Surprise hai Dekho', time: '11:59 PM', isKey: true },

    // This triggers the cinematic transition
    { type: 'transition-trigger' },
  ];

  /* ════════════════════════════════════════════════════
     ③ STATE
  ════════════════════════════════════════════════════ */
  let currentScreen = 'screenNotif';
  let sequenceIndex = 0;
  let sequenceRunning = false;
  let ytPlayer = null;
  let ytReady = false;
  let musicPlaying = false;
  let pendingPlay = false;
  let totalMessages = 0;
  let messagesShown = 0;

  // Count real message steps for progress tracking
  MESSAGES.forEach(m => {
    if (m.type !== 'typing' && m.type !== 'transition-trigger') totalMessages++;
  });

  /* ════════════════════════════════════════════════════
     ④ DOM REFS
  ════════════════════════════════════════════════════ */
  const $ = id => document.getElementById(id);
  const screenNotif = $('screenNotif');
  const screenChat = $('screenChat');
  const screenTransition = $('screenTransition');
  const screenFinal = $('screenFinal');
  const chatMessages = $('chatMessages');
  const chatStatus = $('chatStatus');
  const onlineDot = $('onlineDot');
  const progressBar = $('progressBar');
  const progressFill = $('progressFill');
  const musicToggle = $('musicToggle');
  const musicIcon = $('musicIcon');
  const tgNotifCard = $('tgNotifCard');
  const lightbox = $('lightbox');
  const lbClose = $('lbClose');
  const lbImgWrap = $('lbImgWrap');
  const lbCaption = $('lbCaption');
  const heartSparkleCanvas = $('heartSparkleCanvas');

  /* ════════════════════════════════════════════════════
     ⑤ SCREEN TRANSITIONS
  ════════════════════════════════════════════════════ */
  function goTo(nextId, delay = 0, isSlow = false) {
    setTimeout(() => {
      const prev = document.querySelector('.screen.active');
      const next = $(nextId);
      if (!next || !prev) return;

      const exitClass = isSlow ? 'exiting-slow' : 'exiting';
      const exitTime = isSlow ? 2500 : 600;

      prev.classList.add(exitClass);
      prev.classList.remove('active');
      setTimeout(() => {
        prev.classList.remove(exitClass);
        prev.classList.add('hidden');
      }, exitTime);

      const enterClass = isSlow ? 'entering-slow' : 'entering';
      next.classList.remove('hidden');
      next.classList.add(enterClass);

      setTimeout(() => {
        next.classList.add('active');
        next.classList.remove(enterClass);
      }, 50);

      currentScreen = nextId;
    }, delay);
  }

  /* ════════════════════════════════════════════════════
     ⑥ NOTIFICATION SCREEN → CHAT
  ════════════════════════════════════════════════════ */
  function openChat() {
    if (currentScreen !== 'screenNotif') return;
    screenNotif.style.transform = 'scale(0.97)';
    screenNotif.style.transition = 'transform 0.2s';
    setTimeout(() => {
      goTo('screenChat');
      setTimeout(() => startChatSequence(), 500);
    }, 160);
  }

  tgNotifCard.addEventListener('click', openChat);
  tgNotifCard.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openChat(); }
  });

  /* ════════════════════════════════════════════════════
     ⑦ MESSAGE RENDERER
  ════════════════════════════════════════════════════ */
  function createTicks() {
    return `<span class="bubble-ticks" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
      <svg viewBox="0 0 24 24" fill="currentColor" style="margin-left:-8px"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
    </span>`;
  }

  function createMeta(time, withTicks = false) {
    return `<div class="bubble-meta">
      <span class="bubble-time">${time}</span>
      ${withTicks ? createTicks() : ''}
    </div>`;
  }

  function renderMessage(msg) {
    const area = chatMessages;
    let el;

    if (msg.type === 'date-divider') {
      const div = document.createElement('div');
      div.className = 'date-divider';
      div.innerHTML = `<span class="date-divider-pill">${msg.text}</span>`;
      area.appendChild(div);
      scrollToBottom();
      messagesShown++;
      updateProgress();
      return;
    }

    if (msg.type === 'recv' || msg.type === 'sent') {
      const row = document.createElement('div');
      row.className = `msg-row ${msg.type === 'recv' ? 'received' : 'sent'}`;

      const isSent = msg.type === 'sent';
      const isEmoji = msg.emojiOnly;
      const isKey = msg.isKey;

      let avatarHtml = '';
      if (!isSent) {
        avatarHtml = `<div class="msg-avatar">${CONFIG.herInitial}</div>`;
      }

      row.innerHTML = `
        ${avatarHtml}
        <div class="bubble${isEmoji ? ' emoji-only' : ''}${isKey ? ' key-message' : ''}">
          ${msg.text}
          ${!isEmoji ? createMeta(msg.time, isSent) : `<div class="bubble-meta"><span class="bubble-time">${msg.time}</span>${isSent ? createTicks() : ''}</div>`}
        </div>
      `;
      area.appendChild(row);
      scrollToBottom();
      messagesShown++;
      updateProgress();
      return;
    }

    if (msg.type === 'photo') {
      const photo = CONFIG.photos[msg.photoIndex];
      const isSent = false; // photos received from her
      const div = document.createElement('div');
      div.className = `msg-image-bubble ${isSent ? 'sent' : 'received'}`;
      div.style.animationDelay = '0s';
      div.setAttribute('role', 'button');
      div.setAttribute('tabindex', '0');
      div.setAttribute('aria-label', `Open photo: ${photo.caption}`);

      const hasRealSrc = photo.src && photo.src.trim() !== '';
      const innerContent = hasRealSrc
        ? `<img src="${photo.src}" alt="${photo.caption}" style="width:100%;height:100%;object-fit:cover;" loading="lazy" />`
        : `<div class="msg-img ${photo.gradient}">
             <span class="memory-emoji" style="font-size:3.5rem;pointer-events:none;">${photo.emoji}</span>
             <div class="msg-img-hover">🔍</div>
           </div>`;

      div.innerHTML = `
        ${innerContent}
        <div class="msg-img-caption">${photo.caption}</div>
        <div class="msg-img-meta">${msg.time}</div>
      `;

      div.addEventListener('click', () => openLightbox(photo));
      div.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(photo); }
      });

      area.appendChild(div);
      scrollToBottom();
      messagesShown++;
      updateProgress();
      return;
    }

    if (msg.type === 'voice') {
      const div = document.createElement('div');
      div.className = 'msg-row received';
      // Generate waveform bars
      const barCount = 28;
      const heights = Array.from({ length: barCount }, (_, i) => {
        const h = Math.max(4, Math.round(8 + 14 * Math.abs(Math.sin(i * 0.65 + 1.2))));
        return `<div class="vw-bar" style="height:${h}px;"></div>`;
      }).join('');

      div.innerHTML = `
        <div class="msg-avatar">${CONFIG.herInitial}</div>
        <div class="voice-note-bubble" id="voiceBubble" role="button" tabindex="0" aria-label="Play our song">
          <button class="voice-play-btn" id="voicePlayBtn" aria-label="Play">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/>
            </svg>
          </button>
          <div class="voice-waveform">${barCount > 0 ? heights : ''}</div>
          <span class="voice-duration">3:47</span>
        </div>
      `;
      area.appendChild(div);
      scrollToBottom();

      const bubble = div.querySelector('#voiceBubble');
      const playBtn = div.querySelector('#voicePlayBtn');

      function toggleVoice() {
        if (!bubble.classList.contains('playing')) {
          bubble.classList.add('playing');
          playBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
          startMusic();
        } else {
          bubble.classList.remove('playing');
          playBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
          if (ytPlayer && ytReady) ytPlayer.pauseVideo();
          musicPlaying = false;
          musicToggle.classList.remove('playing');
          musicIcon.textContent = '🎵';
        }
      }

      bubble.addEventListener('click', toggleVoice);
      bubble.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleVoice(); } });

      messagesShown++;
      updateProgress();
      return;
    }
  }

  /* ════════════════════════════════════════════════════
     ⑧ TYPING INDICATOR
  ════════════════════════════════════════════════════ */
  function showTyping() {
    hideTyping();
    chatStatus.classList.add('typing-status');
    chatStatus.textContent = 'typing…';
    onlineDot.classList.add('visible');

    const row = document.createElement('div');
    row.className = 'typing-row';
    row.id = 'typingIndicator';
    row.innerHTML = `
      <div class="msg-avatar">${CONFIG.herInitial}</div>
      <div class="typing-bubble">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatMessages.appendChild(row);
    scrollToBottom();
  }

  function hideTyping() {
    const existing = $('typingIndicator');
    if (existing) existing.remove();
    chatStatus.classList.remove('typing-status');
    chatStatus.textContent = 'last seen recently';
  }

  /* ════════════════════════════════════════════════════
     ⑨ MESSAGE SEQUENCER — auto-plays the conversation
  ════════════════════════════════════════════════════ */
  function scrollToBottom() {
    requestAnimationFrame(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }

  function updateProgress() {
    const pct = Math.min(100, (messagesShown / totalMessages) * 100);
    progressFill.style.width = pct + '%';
  }

  async function processMessage(msg) {
    // Inter-message gap
    const gap = msg.gap || 300;
    await sleep(gap);

    if (msg.type === 'typing') {
      showTyping();
      await sleep(msg.ms);
      hideTyping();
      return;
    }

    if (msg.type === 'transition-trigger') {
      // Pause longer to let the surprise message sink in, then transition slowly
      await sleep(3500);
      triggerTransition();
      return;
    }

    hideTyping();
    renderMessage(msg);
  }

  async function startChatSequence() {
    if (sequenceRunning) return;
    sequenceRunning = true;
    progressBar.classList.add('visible');
    musicToggle.classList.add('visible');

    // Show as online briefly
    await sleep(600);
    onlineDot.classList.add('visible');
    chatStatus.textContent = 'online';
    await sleep(1200);
    chatStatus.textContent = 'last seen recently';
    onlineDot.classList.remove('visible');

    for (let i = 0; i < MESSAGES.length; i++) {
      await processMessage(MESSAGES[i]);
      if (currentScreen !== 'screenChat') break;
    }
    sequenceRunning = false;
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  /* ════════════════════════════════════════════════════
     ⑩ CINEMATIC TRANSITION
  ════════════════════════════════════════════════════ */
  function triggerTransition() {
    // Get position of key message for bloom origin
    const keyBubble = chatMessages.querySelector('.bubble.key-message');
    const bloomEl = $('bloomOrigin');

    if (keyBubble && bloomEl) {
      const rect = keyBubble.getBoundingClientRect();
      bloomEl.style.left = (rect.left + rect.width / 2) + 'px';
      bloomEl.style.top = (rect.top + rect.height / 2) + 'px';
      bloomEl.style.animationDuration = '3.5s'; // Slower bloom
    }

    // Transition to screen 3 very slowly
    goTo('screenTransition', 0, true);

    // Stagger the quote lines slower
    const lines = ['tl1', 'tl2', 'tl3', 'tHeart'];
    lines.forEach((id, i) => {
      setTimeout(() => {
        const el = $(id);
        if (el) el.classList.add('show');
      }, 1500 + i * 800); // 1.5s start, 800ms gap
    });

    // Then go to final (wait longer for slow quote reads)
    setTimeout(() => {
      goTo('screenFinal', 0, true); // also transition slowly into final
      setTimeout(() => {
        startFinalSequence();
      }, 2000); // wait longer for the entering transition
    }, 6500);
  }

  /* ════════════════════════════════════════════════════
     ⑪ FINAL SCREEN ANIMATIONS
  ════════════════════════════════════════════════════ */
  function startFinalSequence() {
    // Animate letter paragraphs
    const paras = screenFinal.querySelectorAll('.letter-para');
    paras.forEach(p => p.classList.add('visible'));

    progressBar.classList.remove('visible');
  }

  /* ════════════════════════════════════════════════════
     ⑫ HEART SPARKLE CANVAS
  ════════════════════════════════════════════════════ */
  function initHeartSparkles(canvas) {
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const particles = [];
    // Dark red palette
    const colors = ['#8b0000', '#a00010', '#6b0000', '#b01020', '#900015', '#7a0008'];

    // Color helpers for 3D shading
    function lighten(hex, amt) {
      const n = parseInt(hex.replace('#', ''), 16);
      let r = Math.min(255, ((n >> 16) & 0xff) + Math.round(amt * 255));
      let g = Math.min(255, ((n >> 8) & 0xff) + Math.round(amt * 255));
      let b = Math.min(255, ((n) & 0xff) + Math.round(amt * 255));
      return `rgb(${r},${g},${b})`;
    }
    function darken(hex, amt) {
      const n = parseInt(hex.replace('#', ''), 16);
      let r = Math.max(0, ((n >> 16) & 0xff) - Math.round(amt * 255));
      let g = Math.max(0, ((n >> 8) & 0xff) - Math.round(amt * 255));
      let b = Math.max(0, ((n) & 0xff) - Math.round(amt * 255));
      return `rgb(${r},${g},${b})`;
    }

    // Draw a heart shape centered at (cx, cy) with given size
    function drawHeart(cx, cy, size) {
      const s = size;
      ctx.beginPath();
      ctx.moveTo(cx, cy + s * 0.3);
      // Left lobe
      ctx.bezierCurveTo(cx - s * 0.05, cy - s * 0.1, cx - s, cy - s * 0.1, cx - s, cy - s * 0.45);
      ctx.bezierCurveTo(cx - s, cy - s, cx, cy - s, cx, cy - s * 0.55);
      // Right lobe
      ctx.bezierCurveTo(cx, cy - s, cx + s, cy - s, cx + s, cy - s * 0.45);
      ctx.bezierCurveTo(cx + s, cy - s * 0.1, cx + s * 0.05, cy - s * 0.1, cx, cy + s * 0.3);
      ctx.closePath();
    }

    // 60 hearts — subtle glitter, not overwhelming
    for (let i = 0; i < 60; i++) {
      const startY = Math.random() * h * 1.5 - h * 0.5;
      particles.push({
        x: Math.random() * w,
        y: startY,
        vx: (Math.random() - 0.5) * 0.8,
        vy: Math.random() * 1.5 + 0.5,
        size: Math.random() * 7 + 3,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.03,
        alpha: Math.random() * 0.5 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;
        p.twinkle += 0.035;
        const alpha = p.alpha * (0.55 + 0.45 * Math.sin(p.twinkle));

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;

        // Solid dark red fill
        drawHeart(0, 0, p.size);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Tiny subtle highlight only
        const hGrad = ctx.createRadialGradient(
          -p.size * 0.28, -p.size * 0.4, 0,
          -p.size * 0.28, -p.size * 0.4, p.size * 0.4
        );
        hGrad.addColorStop(0, 'rgba(255,255,255,0.22)');
        hGrad.addColorStop(1, 'rgba(255,255,255,0)');
        drawHeart(0, 0, p.size);
        ctx.save(); ctx.clip();
        ctx.fillStyle = hGrad;
        ctx.fillRect(-p.size * 1.2, -p.size * 1.2, p.size * 2.4, p.size * 2.4);
        ctx.restore();

        ctx.restore();

        // Reset when it floats off the bottom
        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
          p.size = Math.random() * 6 + 3;
        }
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });
  }

  /* ════════════════════════════════════════════════════
     ⑬ LIGHTBOX
  ════════════════════════════════════════════════════ */
  function openLightbox(photo) {
    const hasRealSrc = photo.src && photo.src.trim() !== '';
    if (hasRealSrc) {
      lbImgWrap.innerHTML = `<img src="${photo.src}" alt="${photo.caption}" style="width:100%;height:100%;object-fit:cover;" />`;
    } else {
      lbImgWrap.className = `lb-img-wrap ${photo.gradient}`;
      lbImgWrap.innerHTML = `<span style="font-size:5rem;">${photo.emoji}</span>`;
    }
    lbCaption.textContent = photo.caption;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });

  /* ════════════════════════════════════════════════════
     ⑭ YOUTUBE MUSIC (IFrame API)
  ════════════════════════════════════════════════════ */
  function loadYTApi() {
    if ($('ytApiScript')) return;
    const s = document.createElement('script');
    s.id = 'ytApiScript';
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }

  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('ytPlayerContainer', {
      width: '1', height: '1',
      videoId: CONFIG.ytVideoId,
      playerVars: {
        autoplay: 0, controls: 0, disablekb: 1,
        fs: 0, iv_load_policy: 3, modestbranding: 1,
        rel: 0, loop: 1, playlist: CONFIG.ytVideoId,
      },
      events: {
        onReady(e) {
          ytReady = true;
          e.target.setVolume(CONFIG.musicVolume);
          if (pendingPlay) { e.target.playVideo(); pendingPlay = false; }
        },
        onStateChange(e) {
          if (e.data === YT.PlayerState.PLAYING) {
            musicPlaying = true;
            musicToggle.classList.add('playing');
            musicIcon.textContent = '🎶';
          } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
            musicPlaying = false;
            musicToggle.classList.remove('playing');
            musicIcon.textContent = '🎵';
            // Sync voice bubble if present
            const vb = $('voiceBubble');
            const vp = $('voicePlayBtn');
            if (vb) {
              vb.classList.remove('playing');
              if (vp) vp.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
            }
          }
        },
      },
    });
  };

  function startMusic() {
    if (!ytPlayer) {
      loadYTApi();
      pendingPlay = true;
      musicPlaying = true;
      musicToggle.classList.add('playing');
      musicIcon.textContent = '🎶';
      return;
    }
    if (!ytReady) { pendingPlay = true; return; }
    ytPlayer.playVideo();
  }

  musicToggle.addEventListener('click', () => {
    if (!ytPlayer) {
      startMusic();
    } else if (!ytReady) {
      pendingPlay = !pendingPlay;
    } else {
      musicPlaying ? ytPlayer.pauseVideo() : ytPlayer.playVideo();
    }
  });

  /* ════════════════════════════════════════════════════
     ⑮ INIT
  ════════════════════════════════════════════════════ */
  function init() {
    // Ensure initial screen states
    document.querySelectorAll('.screen').forEach(s => {
      if (!s.classList.contains('active')) s.classList.add('hidden');
    });
    screenNotif.classList.remove('hidden');
    screenNotif.classList.add('active');

    // Run global heart sparkles background overlay
    if (heartSparkleCanvas) initHeartSparkles(heartSparkleCanvas);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
