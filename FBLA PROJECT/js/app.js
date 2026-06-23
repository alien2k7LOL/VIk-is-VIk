/* ===================================================
   Prime Prep — Application Logic
   =================================================== */

const App = (() => {
  let state = {
    currentView: 'home',
    currentCourse: null,
    currentTopic: null,
    currentCourseId: null,
    progress: {},
    xp: 0,
    streak: 0,
    lastVisit: null,
    completedTopics: [],
    activityLog: [],
    apiKey: 'proxy',
    chatHistory: [],
    theme: 'dark',
    problemStates: {},
    sessions: [],
    weekOffset: 0,
    tutorBookings: [],
    downloadsCourseId: null,
    completedActivities: [],
    a11y: { scale: 1, highContrast: false, dyslexia: false },
    mistakes: []
  };

  function init() {
    loadState();
    playSplash();
    checkAuth();
    spawnAuthParticles();
  }

  // ===================== ACCESSIBILITY HELPERS =====================

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Makes non-native clickable elements (divs/spans with onclick) operable by
  // keyboard and announced as buttons to screen readers. Safe to call repeatedly.
  function enhanceA11y() {
    document.querySelectorAll('[onclick]').forEach(function(el) {
      var tag = el.tagName;
      if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (el.getAttribute('data-a11y') === '1') return;
      // Skip dismiss overlays — they'd become empty, unlabeled tab stops.
      // The dialogs/modals they back are already closable via Escape and a
      // labeled close button.
      if (el.classList.contains('modal-overlay') || el.classList.contains('ai-panel-overlay')) return;
      el.setAttribute('data-a11y', '1');
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
    });
  }

  function playSplash() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;
    const pc = document.getElementById('splash-particles');
    if (pc) {
      for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.className = 'splash-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = 40 + Math.random() * 50 + '%';
        p.style.animationDelay = Math.random() * 2 + 's';
        p.style.animationDuration = 2 + Math.random() * 2 + 's';
        p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
        pc.appendChild(p);
      }
    }
    setTimeout(() => {
      splash.classList.add('splash-exit');
      setTimeout(() => { splash.classList.add('hidden'); }, 800);
    }, 2400);
  }

  function dismissOnboarding(e) {
    if (e) e.stopPropagation();
    const cta = document.getElementById('onboarding-cta');
    if (cta) cta.classList.add('dismissed');
    localStorage.setItem('mathverse_onboarding_dismissed', '1');
  }

  function initOnboarding() {
    if (localStorage.getItem('mathverse_onboarding_dismissed') === '1') {
      const cta = document.getElementById('onboarding-cta');
      if (cta) cta.classList.add('dismissed');
    }
  }

  function initApp() {
    updateStreak();
    renderBgCanvas();
    bindEvents();
    renderFeaturedCourses();
    renderTestPrepSection('sat');
    renderAllCourses();
    renderFormulaSheets();
    renderSchedule();
    renderDownloads();
    renderVideoLibrary();
    renderFlashcards();
    renderPeerTutors();
    updateXPDisplay();
    renderAchievements();
    populateSessionSubjects();
    initScrollReveal();
    initCounterAnimations();
    initOnboarding();
    renderSidebarActivity();
    updateReviewBadge();
    enhanceA11y();
    applyA11yPrefs();
    maybeStartTour();

    if (state.theme !== 'dark') document.body.setAttribute('data-theme', state.theme);
    const cycleBtn = document.getElementById('theme-cycle-btn');
    if (cycleBtn) {
      cycleBtn.innerHTML = `<i class="fas ${THEME_ICONS[state.theme] || 'fa-palette'}"></i>`;
      cycleBtn.title = 'Theme: ' + state.theme.charAt(0).toUpperCase() + state.theme.slice(1);
    }
  }

  // ===================== AUTH =====================

  let firebaseAuth = null;

  function getFirebaseAuth() {
    if (typeof firebase === 'undefined' || !window.PRIMEPREP_FIREBASE_CONFIG) return null;
    if (firebaseAuth) return firebaseAuth;
    const cfg = window.PRIMEPREP_FIREBASE_CONFIG;
    if (!cfg || cfg.apiKey === 'YOUR_API_KEY') return null;
    try {
      firebase.initializeApp(cfg);
      firebaseAuth = firebase.auth();
      return firebaseAuth;
    } catch (e) {
      console.warn('Firebase init failed', e);
      return null;
    }
  }

  function showAuthError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.add('visible');
  }

  function clearAuthErrors() {
    ['auth-error', 'auth-signup-error'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.textContent = ''; el.classList.remove('visible'); }
    });
  }

  function checkAuth() {
    const auth = getFirebaseAuth();
    if (auth) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          const name = user.displayName || user.email.split('@')[0] || 'User';
          localStorage.setItem('mathverse_authed', JSON.stringify({ name, email: user.email, uid: user.uid }));
          dismissAuth();
        }
      });
      return;
    }
  }

  function switchAuthTab(tab) {
    clearAuthErrors();
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    if (tab === 'login') {
      document.querySelector('.auth-tab:first-child').classList.add('active');
      document.getElementById('login-form').classList.add('active');
    } else {
      document.querySelector('.auth-tab:last-child').classList.add('active');
      document.getElementById('signup-form').classList.add('active');
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    clearAuthErrors();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');
    const auth = getFirebaseAuth();

    if (!auth) {
      localLogin(email, password, btn);
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }
    try {
      await auth.signInWithEmailAndPassword(email, password);
      const user = auth.currentUser;
      const name = user.displayName || user.email.split('@')[0] || 'User';
      localStorage.setItem('mathverse_authed', JSON.stringify({ name, email: user.email, uid: user.uid }));
      dismissAuth();
    } catch (err) {
      let message = 'Something went wrong. Please try again.';
      if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email. Create an account to get started.';
        switchAuthTab('signup');
        document.getElementById('signup-email').value = email;
      } else if (err.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
        message = 'Invalid email or password. Check your details or create an account.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
      } else if (err.message) {
        message = err.message;
      }
      showAuthError('auth-error', message);
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-arrow-right"></i> Sign In'; }
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    clearAuthErrors();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const btn = document.getElementById('signup-btn');
    const auth = getFirebaseAuth();

    if (!auth) {
      localSignup(name, email, password, btn);
      return;
    }

    if (password.length < 6) {
      showAuthError('auth-signup-error', 'Password must be at least 6 characters.');
      return;
    }

    if (btn) { btn.disabled = true; btn.textContent = 'Creating account…'; }
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      if (cred.user && name) {
        await cred.user.updateProfile({ displayName: name });
      }
      localStorage.setItem('mathverse_authed', JSON.stringify({
        name: name || email.split('@')[0],
        email: cred.user.email,
        uid: cred.user.uid
      }));
      dismissAuth();
    } catch (err) {
      let message = 'Something went wrong. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Sign in instead.';
        switchAuthTab('login');
        document.getElementById('login-email').value = email;
      } else if (err.code === 'auth/weak-password') {
        message = 'Password must be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (err.message) {
        message = err.message;
      }
      showAuthError('auth-signup-error', message);
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-rocket"></i> Create Account'; }
    }
  }

  async function handleGoogleSignIn() {
    const auth = getFirebaseAuth();
    if (!auth) {
      // No backend configured: fall back to a local demo session so the button
      // isn't a dead end. Progress is saved in this browser.
      localStorage.setItem('mathverse_authed', JSON.stringify({ name: 'Google User', email: '', demo: true }));
      dismissAuth();
      setTimeout(() => showToast('Signed in (demo mode) — progress saves in this browser', 'info'), 900);
      return;
    }
    clearAuthErrors();
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      const name = user.displayName || user.email.split('@')[0] || 'User';
      localStorage.setItem('mathverse_authed', JSON.stringify({ name, email: user.email, uid: user.uid }));
      dismissAuth();
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') return;
      let message = 'Google sign in failed. Please try again.';
      if (err.code === 'auth/popup-blocked') message = 'Popup was blocked. Please allow popups and try again.';
      else if (err.message) message = err.message;
      showAuthError('auth-error', message);
      switchAuthTab('login');
    }
  }

  function continueAsGuest() {
    localStorage.setItem('mathverse_authed', JSON.stringify({ name: 'Guest', email: '', guest: true }));
    dismissAuth();
  }

  // ---- Local (no-backend) auth fallback --------------------------------
  // When Firebase isn't configured, accounts are stored in localStorage so the
  // sign in / sign up forms still work for this client-only demo. NOTE: this is
  // demo-grade only — passwords are not securely hashed and never leave the
  // browser. Swap in the Firebase config in index.html for real authentication.

  function getLocalUsers() {
    try { return JSON.parse(localStorage.getItem('primeprep_users') || '{}'); }
    catch (e) { return {}; }
  }

  function saveLocalUsers(users) {
    try { localStorage.setItem('primeprep_users', JSON.stringify(users)); } catch (e) {}
  }

  function localLogin(email, password, btn) {
    const users = getLocalUsers();
    const key = email.toLowerCase();
    if (!users[key]) {
      showAuthError('auth-error', 'No account found with this email. Create an account to get started.');
      switchAuthTab('signup');
      const se = document.getElementById('signup-email');
      if (se) se.value = email;
      return;
    }
    if (users[key].password !== password) {
      showAuthError('auth-error', 'Incorrect password. Please try again.');
      return;
    }
    if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }
    localStorage.setItem('mathverse_authed', JSON.stringify({ name: users[key].name, email: key }));
    dismissAuth();
  }

  function localSignup(name, email, password, btn) {
    const users = getLocalUsers();
    const key = email.toLowerCase();
    if (users[key]) {
      showAuthError('auth-signup-error', 'This email is already registered. Sign in instead.');
      switchAuthTab('login');
      const le = document.getElementById('login-email');
      if (le) le.value = email;
      return;
    }
    if (password.length < 6) {
      showAuthError('auth-signup-error', 'Password must be at least 6 characters.');
      return;
    }
    users[key] = { name: name || email.split('@')[0], password: password };
    saveLocalUsers(users);
    if (btn) { btn.disabled = true; btn.textContent = 'Creating account…'; }
    localStorage.setItem('mathverse_authed', JSON.stringify({ name: users[key].name, email: key }));
    dismissAuth();
  }

  function dismissAuth() {
    const screen = document.getElementById('auth-screen');
    if (screen) {
      screen.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      screen.style.opacity = '0';
      screen.style.transform = 'scale(1.05)';
      setTimeout(() => {
        screen.classList.add('hidden');
        initApp();
      }, 600);
    } else {
      initApp();
    }
  }

  function spawnAuthParticles() {
    const container = document.getElementById('auth-particles');
    if (!container) return;
    const colors = ['#22c55e', '#10b981', '#c8aa50', '#059669', '#34d399'];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'auth-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 4 + 's';
      p.style.animationDuration = (3 + Math.random() * 3) + 's';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.width = (2 + Math.random() * 3) + 'px';
      p.style.height = p.style.width;
      container.appendChild(p);
    }
  }

  // ===================== SCROLL REVEAL =====================

  function initScrollReveal() {
    const els = document.querySelectorAll('.feature-card, .course-card, .stat-card, .study-session-card, .peer-tutor-card, .download-card, .achievement-card, .metric-item');
    els.forEach((el, i) => {
      el.classList.add('reveal');
      el.classList.add('stagger-' + Math.min((i % 6) + 1, 6));
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      observer.observe(el);
    });
  }

  // ===================== COUNTER ANIMATIONS =====================

  function initCounterAnimations() {
    const counters = document.querySelectorAll('.hero-stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }

  function animateCounter(el) {
    const text = el.textContent;
    const num = parseInt(text);
    if (isNaN(num)) return;
    const suffix = text.replace(/[\d]/g, '');
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * num) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ===================== STATE MANAGEMENT =====================

  function loadState() {
    try {
      const saved = localStorage.getItem('mathverse_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
      }
    } catch(e) { console.warn('Failed to load state:', e); }
  }

  function saveState() {
    try {
      const toSave = {
        progress: state.progress,
        xp: state.xp,
        streak: state.streak,
        lastVisit: state.lastVisit,
        completedTopics: state.completedTopics,
        activityLog: state.activityLog.slice(-50),
        apiKey: state.apiKey,
        theme: state.theme,
        sessions: state.sessions.slice(-20),
        tutorBookings: state.tutorBookings || [],
        downloadsCourseId: state.downloadsCourseId,
        completedActivities: (state.completedActivities || []).slice(-100),
        a11y: state.a11y || { scale: 1, highContrast: false, dyslexia: false },
        mistakes: (state.mistakes || []).slice(-300)
      };
      localStorage.setItem('mathverse_state', JSON.stringify(toSave));
    } catch(e) { console.warn('Failed to save state:', e); }
  }

  function updateStreak() {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (state.lastVisit === today) return;
    if (state.lastVisit === yesterday) {
      state.streak++;
    } else if (state.lastVisit !== today) {
      state.streak = 1;
    }
    state.lastVisit = today;
    saveState();
  }

  // ===================== EVENT BINDING =====================

  function bindEvents() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigate(link.dataset.view);
      });
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navigate(link.dataset.view);
      });
    });

    document.getElementById('sidebar-toggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('collapsed');
    });

    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('mobile-open');
    });

    const searchInput = document.getElementById('global-search');
    searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim()) handleSearch(searchInput.value);
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        document.getElementById('search-results').classList.add('hidden');
      }
    });

    const chatInput = document.getElementById('chat-input');
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.getElementById('formula-search').addEventListener('input', (e) => {
      filterFormulas(e.target.value);
    });

    // Global keyboard shortcuts (ignored while typing in a field).
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const ov = document.getElementById('tour-overlay');
        if (ov && !ov.classList.contains('hidden')) { endTour(); return; }
      }
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '/') {
        e.preventDefault();
        const s = document.getElementById('global-search');
        if (s) s.focus();
      } else if (e.key === '?') {
        e.preventDefault();
        openShortcuts();
      } else if (e.key === 'g' || e.key === 'G') {
        toggleCalculator();
      }
    });

    // Keep the tour highlight aligned if the window resizes mid-tour.
    window.addEventListener('resize', () => {
      const ov = document.getElementById('tour-overlay');
      if (ov && !ov.classList.contains('hidden')) showTourStep();
    });

    // Flashcards: arrow keys to navigate the deck (when player is open).
    document.addEventListener('keydown', (e) => {
      const player = document.getElementById('flashcards-player');
      if (!player || player.classList.contains('hidden')) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (e.key === 'ArrowRight') { e.preventDefault(); fcNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); fcPrev(); }
    });

    // Notes Analyzer drag-and-drop.
    const dz = document.getElementById('notes-dropzone');
    if (dz) {
      ['dragenter', 'dragover'].forEach(function(ev) {
        dz.addEventListener(ev, function(e) { e.preventDefault(); e.stopPropagation(); dz.classList.add('dragover'); });
      });
      ['dragleave', 'drop'].forEach(function(ev) {
        dz.addEventListener(ev, function(e) { e.preventDefault(); e.stopPropagation(); dz.classList.remove('dragover'); });
      });
      dz.addEventListener('drop', function(e) {
        const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) setNotesFile(file);
      });
    }

    // Close the chat formula palette / accessibility menu when clicking outside.
    document.addEventListener('click', (e) => {
      const pal = document.getElementById('formula-palette');
      if (pal && !pal.classList.contains('hidden') &&
          !e.target.closest('#formula-palette') && !e.target.closest('#formula-picker-btn')) {
        pal.classList.add('hidden');
        const btn = document.getElementById('formula-picker-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
      const menu = document.getElementById('a11y-menu');
      if (menu && !menu.classList.contains('hidden') &&
          !e.target.closest('#a11y-menu') && !e.target.closest('#a11y-btn')) {
        menu.classList.add('hidden');
        const ab = document.getElementById('a11y-btn');
        if (ab) ab.setAttribute('aria-expanded', 'false');
      }
    });

    // Keyboard activation for non-native clickable elements (Enter / Space).
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
      const t = e.target;
      if (!t || t.getAttribute('data-a11y') !== '1') return;
      // If the element supplies its own Enter handler, let it handle Enter;
      // we still take over Space so the page doesn't scroll.
      if (t.hasAttribute('onkeydown') && e.key === 'Enter') return;
      e.preventDefault();
      t.click();
    });

    // Close the AI side panel / modals with Escape.
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      const panel = document.getElementById('ai-side-panel');
      if (panel && panel.classList.contains('open')) { closeAIPanel(); return; }
      document.querySelectorAll('.modal:not(.hidden)').forEach(m => m.classList.add('hidden'));
    });
  }

  // ===================== NAVIGATION =====================

  function navigate(view, data) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(l => l.classList.remove('active'));

    state.currentView = view;
    let targetView = view;

    if (view === 'course' && data) {
      state.currentCourseId = data;
      renderCourseDetail(data);
      targetView = 'course';
    } else if (view === 'topic' && data) {
      state.currentTopic = data;
      renderTopicView(data.courseId, data.topicId);
      targetView = 'topic';
    } else if (view === 'home') {
      renderFeaturedCourses();
    } else if (view === 'dashboard') {
      renderProgressView();
    } else if (view === 'courses') {
      view = 'home';
      targetView = 'home';
      state.currentView = 'home';
    } else if (view === 'schedule') {
      renderSchedule();
      renderPeerTutors();
      renderTutorBookings();
      populateSessionSubjects();
    } else if (view === 'mistakes') {
      renderMistakesView();
    }

    const viewEl = document.getElementById(view + '-view');
    if (viewEl) viewEl.classList.add('active');

    document.querySelectorAll(`.nav-link[data-view="${view}"], .mobile-nav-link[data-view="${view}"]`).forEach(l => l.classList.add('active'));

    document.getElementById('sidebar').classList.remove('mobile-open');
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    enhanceA11y();
  }

  // ===================== SEARCH =====================

  function handleSearch(query) {
    const dropdown = document.getElementById('search-results');
    if (!query.trim()) { dropdown.classList.add('hidden'); return; }

    const q = query.toLowerCase();
    const results = [];
    COURSES.forEach(course => {
      course.units.forEach(unit => {
        unit.topics.forEach(topic => {
          const searchText = `${topic.title} ${unit.title} ${course.title}`.toLowerCase();
          if (searchText.includes(q)) {
            results.push({ topic, unit, course });
          }
        });
      });
    });

    if (results.length === 0) {
      dropdown.innerHTML = '<div class="search-result-item"><div class="result-title">No results found</div></div>';
    } else {
      dropdown.innerHTML = results.slice(0, 8).map(r => `
        <div class="search-result-item" onclick="App.navigate('topic', {courseId:'${r.course.id}', topicId:'${r.topic.id}'})">
          <div class="result-title">${r.topic.title}</div>
          <div class="result-path">${r.course.title} → ${r.unit.title}</div>
        </div>
      `).join('');
    }
    dropdown.classList.remove('hidden');
  }

  // ===================== RENDERING =====================

  function getCourseProgress(courseId) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return 0;
    let total = 0, completed = 0;
    course.units.forEach(u => u.topics.forEach(t => {
      total++;
      if (state.completedTopics.includes(t.id)) completed++;
    }));
    return total ? Math.round((completed / total) * 100) : 0;
  }

  function getTotalTopics() {
    let count = 0;
    COURSES.forEach(c => c.units.forEach(u => count += u.topics.length));
    return count;
  }

  function getTotalProblems() {
    let count = 0;
    COURSES.forEach(c => c.units.forEach(u => u.topics.forEach(t => count += t.problems.length)));
    return count;
  }

  function getTotalVideos() {
    let count = 0;
    COURSES.forEach(c => c.units.forEach(u => u.topics.forEach(t => count += t.videos.length)));
    return count;
  }

  function renderFeaturedCourses() {
    const container = document.getElementById('featured-courses');
    container.innerHTML = COURSES.map((c, i) => courseCardHTML(c, i)).join('');

    document.getElementById('stat-topics').textContent = getTotalTopics() + '+';
    document.getElementById('stat-problems').textContent = getTotalProblems() + '+';
    document.getElementById('stat-videos').textContent = getTotalVideos() + '+';
    document.getElementById('stat-courses').textContent = COURSES.length;
  }

  const TEST_PREP_DATA = {
    sat: [
      { title: 'Heart of Algebra', subtitle: 'Linear equations, systems, inequalities', icon: 'fa-superscript', color: '#6366f1',
        problems: [
          {question:'If \\(3x + 5 = 20\\), what is \\(x\\)?',options:['\\(5\\)','\\(3\\)','\\(15\\)','\\(7\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(7x - 4 = 10\\)',options:['\\(2\\)','\\(1\\)','\\(3\\)','\\(7\\)'],correct:0,difficulty:'easy'},
          {question:'If \\(x + 9 = 15\\), what is \\(x\\)?',options:['\\(6\\)','\\(9\\)','\\(15\\)','\\(24\\)'],correct:0,difficulty:'easy'},
          {question:'Solve for \\(y\\): \\(2y = 18\\)',options:['\\(9\\)','\\(18\\)','\\(36\\)','\\(6\\)'],correct:0,difficulty:'easy'},
          {question:'What is \\(x\\) if \\(x - 7 = 3\\)?',options:['\\(10\\)','\\(4\\)','\\(-4\\)','\\(7\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(5x = 35\\)',options:['\\(7\\)','\\(5\\)','\\(30\\)','\\(40\\)'],correct:0,difficulty:'easy'},
          {question:'If \\(2x + 1 = 9\\), find \\(x\\).',options:['\\(4\\)','\\(5\\)','\\(3\\)','\\(8\\)'],correct:0,difficulty:'easy'},
          {question:'What is \\(x\\) if \\(\\frac{x}{3} = 4\\)?',options:['\\(12\\)','\\(7\\)','\\(1\\)','\\(3\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(-3x = 21\\)',options:['\\(-7\\)','\\(7\\)','\\(-21\\)','\\(24\\)'],correct:0,difficulty:'easy'},
          {question:'If \\(4x - 8 = 0\\), then \\(x =\\)',options:['\\(2\\)','\\(4\\)','\\(-2\\)','\\(8\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(3(x + 2) = 15\\)',options:['\\(3\\)','\\(5\\)','\\(1\\)','\\(7\\)'],correct:0,difficulty:'easy'},
          {question:'If \\(x/5 + 1 = 3\\), find \\(x\\).',options:['\\(10\\)','\\(15\\)','\\(5\\)','\\(2\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(6x - 3 = 9\\)',options:['\\(2\\)','\\(3\\)','\\(1\\)','\\(6\\)'],correct:0,difficulty:'easy'},
          {question:'If \\(8 - x = 5\\), what is \\(x\\)?',options:['\\(3\\)','\\(5\\)','\\(13\\)','\\(-3\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(2(x - 4) = 6\\)',options:['\\(7\\)','\\(5\\)','\\(3\\)','\\(10\\)'],correct:0,difficulty:'easy'},
          {question:'What value of \\(x\\) makes \\(x + x = 14\\) true?',options:['\\(7\\)','\\(14\\)','\\(28\\)','\\(0\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(9x + 3 = 30\\)',options:['\\(3\\)','\\(4\\)','\\(27\\)','\\(2\\)'],correct:0,difficulty:'easy'},
          {question:'Solve the system: \\(x + y = 10,\\; x - y = 2\\)',options:['\\((6, 4)\\)','\\((4, 6)\\)','\\((5, 5)\\)','\\((8, 2)\\)'],correct:0,difficulty:'medium'},
          {question:'If \\(4(x - 3) = 2x + 6\\), what is \\(x\\)?',options:['\\(9\\)','\\(6\\)','\\(3\\)','\\(12\\)'],correct:0,difficulty:'medium'},
          {question:'Solve: \\(2x + 3y = 12\\) and \\(x = 3\\). Find \\(y\\).',options:['\\(2\\)','\\(3\\)','\\(4\\)','\\(1\\)'],correct:0,difficulty:'medium'},
          {question:'A line has slope \\(2\\) and passes through \\((1, 5)\\). What is the y-intercept?',options:['\\(3\\)','\\(5\\)','\\(7\\)','\\(1\\)'],correct:0,difficulty:'medium'},
          {question:'Solve: \\(\\frac{2x+1}{3} = 5\\)',options:['\\(7\\)','\\(8\\)','\\(5\\)','\\(14\\)'],correct:0,difficulty:'medium'},
          {question:'If \\(3x - 2y = 8\\) and \\(y = 1\\), what is \\(x\\)?',options:['\\(\\frac{10}{3}\\)','\\(2\\)','\\(3\\)','\\(4\\)'],correct:0,difficulty:'medium'},
          {question:'Solve the system: \\(2x + y = 7,\\; x + 3y = 11\\)',options:['\\((2, 3)\\)','\\((3, 1)\\)','\\((1, 5)\\)','\\((4, -1)\\)'],correct:0,difficulty:'medium'},
          {question:'What is the slope of \\(3x + 6y = 18\\)?',options:['\\(-\\frac{1}{2}\\)','\\(3\\)','\\(\\frac{1}{2}\\)','\\(-3\\)'],correct:0,difficulty:'medium'},
          {question:'Solve: \\(|x - 5| = 3\\)',options:['\\(8\\) or \\(2\\)','\\(5\\) or \\(3\\)','\\(3\\) only','\\(8\\) only'],correct:0,difficulty:'medium'},
          {question:'If \\(y = 2x + 1\\) and \\(y = -x + 7\\), find the intersection.',options:['\\((2, 5)\\)','\\((3, 4)\\)','\\((1, 3)\\)','\\((4, 3)\\)'],correct:0,difficulty:'medium'},
          {question:'Solve: \\(5(2x - 1) = 3(x + 4)\\)',options:['\\(\\frac{17}{7}\\)','\\(3\\)','\\(2\\)','\\(1\\)'],correct:0,difficulty:'medium'},
          {question:'Which inequality represents "\\(x\\) is at least 5"?',options:['\\(x \\geq 5\\)','\\(x > 5\\)','\\(x \\leq 5\\)','\\(x = 5\\)'],correct:0,difficulty:'medium'},
          {question:'Solve for \\(x\\): \\(2x + 3 > 11\\)',options:['\\(x > 4\\)','\\(x > 7\\)','\\(x < 4\\)','\\(x > 5\\)'],correct:0,difficulty:'medium'},
          {question:'The sum of two consecutive integers is 37. What are they?',options:['\\(18\\) and \\(19\\)','\\(17\\) and \\(20\\)','\\(16\\) and \\(21\\)','\\(19\\) and \\(20\\)'],correct:0,difficulty:'medium'},
          {question:'Write in slope-intercept form: \\(4x - 2y = 10\\)',options:['\\(y = 2x - 5\\)','\\(y = -2x + 5\\)','\\(y = 4x - 10\\)','\\(y = 2x + 5\\)'],correct:0,difficulty:'medium'},
          {question:'Solve: \\(\\frac{x}{2} - \\frac{x}{3} = 1\\)',options:['\\(6\\)','\\(3\\)','\\(5\\)','\\(2\\)'],correct:0,difficulty:'medium'},
          {question:'Which value of \\(x\\) satisfies \\(|2x - 6| = 10\\)?',options:['\\(8\\) or \\(-2\\)','\\(5\\) or \\(1\\)','\\(3\\) or \\(-3\\)','\\(10\\) or \\(-4\\)'],correct:0,difficulty:'hard'},
          {question:'Solve the system: \\(3x + 2y = 1,\\; 5x - 4y = 23\\)',options:['\\((3, -4)\\)','\\((1, -1)\\)','\\((-3, 5)\\)','\\((5, -7)\\)'],correct:0,difficulty:'hard'},
          {question:'If \\(f(x) = 3x + 2\\) and \\(g(x) = x - 4\\), for what \\(x\\) does \\(f(x) = g(x)\\)?',options:['\\(-3\\)','\\(3\\)','\\(-1\\)','\\(1\\)'],correct:0,difficulty:'hard'},
          {question:'Solve: \\(\\frac{3}{x-1} = \\frac{6}{x+2}\\)',options:['\\(4\\)','\\(-4\\)','\\(2\\)','\\(0\\)'],correct:0,difficulty:'hard'},
          {question:'The graphs of \\(y = ax + 3\\) and \\(y = -2x + b\\) intersect at \\((1, 5)\\). Find \\(a\\) and \\(b\\).',options:['\\(a=2, b=7\\)','\\(a=3, b=5\\)','\\(a=5, b=2\\)','\\(a=1, b=3\\)'],correct:0,difficulty:'hard'},
          {question:'Solve for \\(x\\): \\(|3x + 1| \\leq 7\\)',options:['\\(-\\frac{8}{3} \\leq x \\leq 2\\)','\\(x \\leq 2\\)','\\(x \\geq -3\\)','\\(-2 \\leq x \\leq 3\\)'],correct:0,difficulty:'hard'},
          {question:'How many solutions does \\(|2x - 5| = -3\\) have?',options:['\\(0\\)','\\(1\\)','\\(2\\)','Infinitely many'],correct:0,difficulty:'hard'},
          {question:'If \\(2x - 3y = 6\\) and \\(4x - 6y = k\\), for what \\(k\\) are there infinitely many solutions?',options:['\\(12\\)','\\(6\\)','\\(0\\)','\\(3\\)'],correct:0,difficulty:'hard'},
          {question:'Solve: \\(x + 2y - z = 3,\\; 2x - y + z = 1\\). If \\(z = 2\\), find \\(x\\) and \\(y\\).',options:['\\(x=1, y=1)\\)','\\(x=0, y=2\\)','\\(x=2, y=0\\)','\\(x=-1, y=3\\)'],correct:0,difficulty:'hard'},
          {question:'Which ordered pair is a solution to \\(3x - y \\geq 5\\) AND \\(x + y < 7\\)?',options:['\\((3, 2)\\)','\\((1, 1)\\)','\\((0, 6)\\)','\\((2, 5)\\)'],correct:0,difficulty:'hard'},
          {question:'A system of two linear equations has no solution. The lines must be:',options:['Parallel','Perpendicular','Identical','Intersecting'],correct:0,difficulty:'hard'},
          {question:'Solve: \\(\\frac{x+3}{2} - \\frac{x-1}{4} = 3\\)',options:['\\(5\\)','\\(7\\)','\\(3\\)','\\(9\\)'],correct:0,difficulty:'hard'},
          {question:'If \\(f(x) = -2x + b\\) passes through \\((3, -1)\\), what is \\(b\\)?',options:['\\(5\\)','\\(-5\\)','\\(7\\)','\\(-7\\)'],correct:0,difficulty:'hard'},
          {question:'For what value of \\(k\\) does \\(kx + 4 = 2x + k\\) have no solution?',options:['\\(2\\)','\\(4\\)','\\(0\\)','\\(-2\\)'],correct:0,difficulty:'hard'},
          {question:'Solve the system: \\(y = x^2 - 4,\\; y = 2x - 1\\). How many solutions?',options:['\\(2\\)','\\(0\\)','\\(1\\)','\\(3\\)'],correct:0,difficulty:'hard'}
        ]},
      { title: 'Passport to Advanced Math', subtitle: 'Quadratics, polynomials, exponentials', icon: 'fa-chart-line', color: '#059669',
        problems: [
          {question:'Factor: \\(x^2 - 9\\)',options:['\\((x-3)(x+3)\\)','\\((x-9)(x+1)\\)','\\((x-3)^2\\)','\\(x(x-9)\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(x^2 = 25\\)',options:['\\(\\pm 5\\)','\\(5\\)','\\(25\\)','\\(-5\\)'],correct:0,difficulty:'easy'},
          {question:'If \\(f(x) = x^2\\), what is \\(f(4)\\)?',options:['\\(16\\)','\\(8\\)','\\(4\\)','\\(2\\)'],correct:0,difficulty:'easy'},
          {question:'Simplify: \\(x^3 \\cdot x^2\\)',options:['\\(x^5\\)','\\(x^6\\)','\\(x^1\\)','\\(2x^5\\)'],correct:0,difficulty:'easy'},
          {question:'What is the degree of \\(3x^4 + 2x^2 - 1\\)?',options:['\\(4\\)','\\(3\\)','\\(2\\)','\\(7\\)'],correct:0,difficulty:'easy'},
          {question:'Evaluate: \\(2^5\\)',options:['\\(32\\)','\\(10\\)','\\(25\\)','\\(64\\)'],correct:0,difficulty:'easy'},
          {question:'Simplify: \\((x^2)^3\\)',options:['\\(x^6\\)','\\(x^5\\)','\\(x^8\\)','\\(3x^2\\)'],correct:0,difficulty:'easy'},
          {question:'Factor: \\(x^2 + 5x + 6\\)',options:['\\((x+2)(x+3)\\)','\\((x+1)(x+6)\\)','\\((x+5)(x+1)\\)','\\((x-2)(x-3)\\)'],correct:0,difficulty:'easy'},
          {question:'What is \\(3^0\\)?',options:['\\(1\\)','\\(0\\)','\\(3\\)','Undefined'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(x^2 - 4 = 0\\)',options:['\\(\\pm 2\\)','\\(4\\)','\\(2\\)','\\(-2\\)'],correct:0,difficulty:'easy'},
          {question:'If \\(g(x) = x^2 + 1\\), what is \\(g(-3)\\)?',options:['\\(10\\)','\\(8\\)','\\(-8\\)','\\(6\\)'],correct:0,difficulty:'easy'},
          {question:'Simplify: \\(\\frac{x^5}{x^2}\\)',options:['\\(x^3\\)','\\(x^7\\)','\\(x^{10}\\)','\\(x^{2.5}\\)'],correct:0,difficulty:'easy'},
          {question:'Expand: \\((x+1)^2\\)',options:['\\(x^2 + 2x + 1\\)','\\(x^2 + 1\\)','\\(2x + 1\\)','\\(x^2 + x + 1\\)'],correct:0,difficulty:'easy'},
          {question:'What is \\((-2)^3\\)?',options:['\\(-8\\)','\\(8\\)','\\(-6\\)','\\(6\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(x^2 - 5x + 6 = 0\\)',options:['\\(x=2\\) or \\(x=3\\)','\\(x=1\\) or \\(x=6\\)','\\(x=-2\\) or \\(x=-3\\)','\\(x=5\\) or \\(x=1\\)'],correct:0,difficulty:'easy'},
          {question:'Factor: \\(x^2 - 5x + 6\\)',options:['\\((x-2)(x-3)\\)','\\((x-1)(x-6)\\)','\\((x+2)(x+3)\\)','\\((x-5)(x+1)\\)'],correct:0,difficulty:'medium'},
          {question:'Solve: \\(x^2 + 4x - 12 = 0\\)',options:['\\(x=2\\) or \\(x=-6\\)','\\(x=3\\) or \\(x=-4\\)','\\(x=6\\) or \\(x=-2\\)','\\(x=4\\) or \\(x=-3\\)'],correct:0,difficulty:'medium'},
          {question:'If \\(f(x) = 2x^2 - 8\\), what is \\(f(3)\\)?',options:['\\(10\\)','\\(18\\)','\\(6\\)','\\(14\\)'],correct:0,difficulty:'medium'},
          {question:'What is the vertex of \\(y = (x-3)^2 + 5\\)?',options:['\\((3, 5)\\)','\\((-3, 5)\\)','\\((3, -5)\\)','\\((5, 3)\\)'],correct:0,difficulty:'medium'},
          {question:'A population doubles every 5 years from 100. What is it after 15 years?',options:['\\(800\\)','\\(400\\)','\\(600\\)','\\(1200\\)'],correct:0,difficulty:'medium'},
          {question:'Solve using the quadratic formula: \\(x^2 - 6x + 8 = 0\\)',options:['\\(x=2\\) or \\(x=4\\)','\\(x=3\\) or \\(x=5\\)','\\(x=1\\) or \\(x=8\\)','\\(x=-2\\) or \\(x=-4\\)'],correct:0,difficulty:'medium'},
          {question:'What is the axis of symmetry of \\(y = x^2 - 4x + 3\\)?',options:['\\(x = 2\\)','\\(x = -2\\)','\\(x = 4\\)','\\(x = 3\\)'],correct:0,difficulty:'medium'},
          {question:'Simplify: \\((2x^2)(3x^3)\\)',options:['\\(6x^5\\)','\\(5x^5\\)','\\(6x^6\\)','\\(5x^6\\)'],correct:0,difficulty:'medium'},
          {question:'If \\(h(x) = x^3 - 1\\), find \\(h(2)\\).',options:['\\(7\\)','\\(8\\)','\\(3\\)','\\(9\\)'],correct:0,difficulty:'medium'},
          {question:'Complete the square: \\(x^2 + 6x + \\text{?} = (x + 3)^2\\)',options:['\\(9\\)','\\(6\\)','\\(3\\)','\\(36\\)'],correct:0,difficulty:'medium'},
          {question:'Solve: \\(3x^2 = 48\\)',options:['\\(\\pm 4\\)','\\(16\\)','\\(\\pm 16\\)','\\(4\\)'],correct:0,difficulty:'medium'},
          {question:'Factor completely: \\(2x^2 - 8\\)',options:['\\(2(x-2)(x+2)\\)','\\(2(x^2-4)\\)','\\((2x-4)(x+2)\\)','\\(2(x-4)\\)'],correct:0,difficulty:'medium'},
          {question:'What are the zeros of \\(f(x) = x^2 - x - 6\\)?',options:['\\(3\\) and \\(-2\\)','\\(6\\) and \\(-1\\)','\\(2\\) and \\(-3\\)','\\(1\\) and \\(-6\\)'],correct:0,difficulty:'medium'},
          {question:'If \\(f(x) = x^2 + bx + 9\\) has a double root, what is \\(b\\)?',options:['\\(\\pm 6\\)','\\(\\pm 3\\)','\\(9\\)','\\(\\pm 9\\)'],correct:0,difficulty:'hard'},
          {question:'Find all solutions: \\(x^4 - 5x^2 + 4 = 0\\)',options:['\\(\\pm 1, \\pm 2\\)','\\(\\pm 1, \\pm 4\\)','\\(1, 4\\)','\\(\\pm 2, \\pm 3\\)'],correct:0,difficulty:'hard'},
          {question:'If \\(p(x) = x^3 - 2x^2 - 5x + 6\\), is \\(x = 1\\) a root?',options:['Yes','No','Only if doubled','Cannot determine'],correct:0,difficulty:'hard'},
          {question:'Solve: \\(e^{2x} = e^5 \\cdot e^x\\)',options:['\\(x = 5\\)','\\(x = 2\\)','\\(x = 3\\)','\\(x = 7\\)'],correct:0,difficulty:'hard'},
          {question:'The function \\(f(x) = a \\cdot b^x\\) passes through \\((0, 3)\\) and \\((1, 6)\\). Find \\(b\\).',options:['\\(2\\)','\\(3\\)','\\(6\\)','\\(1/2\\)'],correct:0,difficulty:'hard'},
          {question:'If the discriminant of \\(ax^2 + bx + c = 0\\) is negative, how many real solutions?',options:['\\(0\\)','\\(1\\)','\\(2\\)','Infinite'],correct:0,difficulty:'hard'},
          {question:'Solve: \\(\\log_2(x) + \\log_2(x-2) = 3\\)',options:['\\(4\\)','\\(2\\)','\\(8\\)','\\(6\\)'],correct:0,difficulty:'hard'},
          {question:'Divide \\(x^3 + 2x^2 - x - 2\\) by \\((x + 2)\\). What is the quotient?',options:['\\(x^2 - 1\\)','\\(x^2 + 1\\)','\\(x^2 - 2x + 1\\)','\\(x^2 + 4x + 7\\)'],correct:0,difficulty:'hard'},
          {question:'What is the remainder when \\(x^3 - 4x + 2\\) is divided by \\((x - 1)\\)?',options:['\\(-1\\)','\\(0\\)','\\(1\\)','\\(2\\)'],correct:0,difficulty:'hard'},
          {question:'Solve: \\(x^3 - 6x^2 + 11x - 6 = 0\\)',options:['\\(1, 2, 3\\)','\\(1, 3, 5\\)','\\(2, 3, 4\\)','\\(-1, -2, -3\\)'],correct:0,difficulty:'hard'},
          {question:'If \\(f(x) = \\frac{x^2 - 4}{x - 2}\\), what is \\(\\lim_{x \\to 2} f(x)\\)?',options:['\\(4\\)','\\(2\\)','\\(0\\)','Undefined'],correct:0,difficulty:'hard'},
          {question:'What is the end behavior of \\(f(x) = -3x^5 + x\\)?',options:['As \\(x \\to \\infty, f \\to -\\infty\\)','As \\(x \\to \\infty, f \\to \\infty\\)','Constant','Oscillates'],correct:0,difficulty:'hard'},
          {question:'Solve: \\(2^{x+1} = 8^{x-1}\\)',options:['\\(2\\)','\\(1\\)','\\(3\\)','\\(4\\)'],correct:0,difficulty:'hard'}
        ]},
      { title: 'Problem Solving & Data', subtitle: 'Ratios, percentages, statistics, probability', icon: 'fa-chart-pie', color: '#d9a445',
        problems: [
          {question:'A shirt is $40 after a 20% discount. What was the original price?',options:['$50','$48','$60','$45'],correct:0,difficulty:'easy'},
          {question:'What is the mean of 2, 4, 6, 8, 10?',options:['\\(6\\)','\\(5\\)','\\(7\\)','\\(8\\)'],correct:0,difficulty:'easy'},
          {question:'A car travels 120 miles in 2 hours. What is its speed?',options:['60 mph','120 mph','30 mph','90 mph'],correct:0,difficulty:'easy'},
          {question:'What is 25% of 80?',options:['\\(20\\)','\\(25\\)','\\(40\\)','\\(16\\)'],correct:0,difficulty:'easy'},
          {question:'In a class of 30, 18 are girls. What fraction are boys?',options:['\\(\\frac{2}{5}\\)','\\(\\frac{3}{5}\\)','\\(\\frac{1}{2}\\)','\\(\\frac{1}{3}\\)'],correct:0,difficulty:'easy'},
          {question:'What is the median of 3, 7, 9, 12, 15?',options:['\\(9\\)','\\(7\\)','\\(12\\)','\\(10\\)'],correct:0,difficulty:'easy'},
          {question:'A bag has 4 red and 6 blue marbles. What is the probability of drawing red?',options:['\\(\\frac{2}{5}\\)','\\(\\frac{3}{5}\\)','\\(\\frac{1}{2}\\)','\\(\\frac{4}{6}\\)'],correct:0,difficulty:'easy'},
          {question:'If 3 pencils cost $1.50, how much do 10 pencils cost?',options:['$5.00','$4.50','$3.00','$15.00'],correct:0,difficulty:'easy'},
          {question:'What is 50% of 200?',options:['\\(100\\)','\\(50\\)','\\(150\\)','\\(250\\)'],correct:0,difficulty:'easy'},
          {question:'The ratio of cats to dogs is 2:3. If there are 15 dogs, how many cats?',options:['\\(10\\)','\\(6\\)','\\(12\\)','\\(9\\)'],correct:0,difficulty:'easy'},
          {question:'What is the range of 4, 8, 1, 9, 3?',options:['\\(8\\)','\\(5\\)','\\(9\\)','\\(7\\)'],correct:0,difficulty:'easy'},
          {question:'A test has 40 questions. You got 32 right. What percent?',options:['80%','75%','85%','90%'],correct:0,difficulty:'easy'},
          {question:'What is the mode of: 2, 3, 3, 4, 5, 3, 7?',options:['\\(3\\)','\\(4\\)','\\(5\\)','\\(2\\)'],correct:0,difficulty:'easy'},
          {question:'Convert 0.75 to a fraction.',options:['\\(\\frac{3}{4}\\)','\\(\\frac{7}{5}\\)','\\(\\frac{4}{3}\\)','\\(\\frac{1}{4}\\)'],correct:0,difficulty:'easy'},
          {question:'What is 10% of 350?',options:['\\(35\\)','\\(3.5\\)','\\(70\\)','\\(350\\)'],correct:0,difficulty:'easy'},
          {question:'The ratio of boys to girls is 3:5. If there are 40 students, how many boys?',options:['\\(15\\)','\\(20\\)','\\(24\\)','\\(12\\)'],correct:0,difficulty:'medium'},
          {question:'The mean of 5 numbers is 12. If four are 10, 14, 8, 16, what is the fifth?',options:['\\(12\\)','\\(10\\)','\\(15\\)','\\(8\\)'],correct:0,difficulty:'medium'},
          {question:'A car travels 150 miles in 2.5 hours. What is its average speed?',options:['60 mph','75 mph','50 mph','65 mph'],correct:0,difficulty:'medium'},
          {question:'What is the median of: 3, 7, 9, 12, 15, 18, 21?',options:['\\(12\\)','\\(9\\)','\\(15\\)','\\(11\\)'],correct:0,difficulty:'medium'},
          {question:'A price increases from $80 to $100. What is the percent increase?',options:['25%','20%','50%','15%'],correct:0,difficulty:'medium'},
          {question:'In a data set, the mean is 50 and std dev is 10. What % lies within 1 std dev (normal)?',options:['~68%','~50%','~95%','~99%'],correct:0,difficulty:'medium'},
          {question:'Two dice are rolled. What is the probability the sum is 7?',options:['\\(\\frac{1}{6}\\)','\\(\\frac{1}{12}\\)','\\(\\frac{7}{36}\\)','\\(\\frac{1}{7}\\)'],correct:0,difficulty:'medium'},
          {question:'A store marks up an item 40% over cost $50. What is the selling price?',options:['$70','$90','$60','$55'],correct:0,difficulty:'medium'},
          {question:'The interquartile range of 2, 4, 6, 8, 10, 12 is:',options:['\\(6\\)','\\(4\\)','\\(8\\)','\\(10\\)'],correct:0,difficulty:'medium'},
          {question:'If \\(P(A) = 0.3\\) and \\(P(B) = 0.5\\) and they are independent, what is \\(P(A \\text{ and } B)\\)?',options:['\\(0.15\\)','\\(0.8\\)','\\(0.35\\)','\\(0.2\\)'],correct:0,difficulty:'medium'},
          {question:'A survey of 200 people: 120 like pizza, 80 like burgers, 40 like both. How many like neither?',options:['\\(40\\)','\\(60\\)','\\(0\\)','\\(80\\)'],correct:0,difficulty:'hard'},
          {question:'The z-score of a value 75 with mean 60 and std dev 5 is:',options:['\\(3\\)','\\(15\\)','\\(2\\)','\\(-3\\)'],correct:0,difficulty:'hard'},
          {question:'In how many ways can 5 books be arranged on a shelf?',options:['\\(120\\)','\\(25\\)','\\(60\\)','\\(24\\)'],correct:0,difficulty:'hard'},
          {question:'A coin is flipped 4 times. Probability of exactly 2 heads?',options:['\\(\\frac{3}{8}\\)','\\(\\frac{1}{4}\\)','\\(\\frac{1}{2}\\)','\\(\\frac{1}{8}\\)'],correct:0,difficulty:'hard'},
          {question:'Data: 10, 12, 14, 14, 16, 18, 20. If 20 is removed, the mean:',options:['Decreases','Increases','Stays the same','Cannot tell'],correct:0,difficulty:'hard'},
          {question:'A company grows revenue 10% per year from $1M. Revenue after 3 years?',options:['$1.331M','$1.3M','$1.21M','$1.4M'],correct:0,difficulty:'hard'},
          {question:'If \\(P(A|B) = 0.6\\) and \\(P(B) = 0.5\\), what is \\(P(A \\cap B)\\)?',options:['\\(0.3\\)','\\(0.6\\)','\\(1.1\\)','\\(0.1\\)'],correct:0,difficulty:'hard'},
          {question:'The standard deviation of {5, 5, 5, 5} is:',options:['\\(0\\)','\\(5\\)','\\(1\\)','\\(20\\)'],correct:0,difficulty:'hard'},
          {question:'How many ways can you choose 3 items from 7?',options:['\\(35\\)','\\(21\\)','\\(210\\)','\\(42\\)'],correct:0,difficulty:'hard'},
          {question:'A weighted mean: 3 tests at 80 (weight 1) and 1 test at 100 (weight 2). Weighted mean?',options:['\\(92\\)','\\(85\\)','\\(90\\)','\\(88\\)'],correct:0,difficulty:'hard'}
        ]},
      { title: 'Geometry & Trigonometry', subtitle: 'Circles, triangles, trig ratios, radians', icon: 'fa-shapes', color: '#ef4444',
        problems: [
          {question:'What is the area of a rectangle with length 8 and width 5?',options:['\\(40\\)','\\(26\\)','\\(13\\)','\\(80\\)'],correct:0,difficulty:'easy'},
          {question:'A circle has radius 3. What is its circumference?',options:['\\(6\\pi\\)','\\(9\\pi\\)','\\(3\\pi\\)','\\(12\\pi\\)'],correct:0,difficulty:'easy'},
          {question:'What is the perimeter of a square with side length 7?',options:['\\(28\\)','\\(49\\)','\\(14\\)','\\(21\\)'],correct:0,difficulty:'easy'},
          {question:'Two angles of a triangle are 60° and 80°. What is the third?',options:['40°','50°','60°','30°'],correct:0,difficulty:'easy'},
          {question:'What is the area of a triangle with base 10 and height 4?',options:['\\(20\\)','\\(40\\)','\\(14\\)','\\(28\\)'],correct:0,difficulty:'easy'},
          {question:'A right triangle has legs 3 and 4. What is the hypotenuse?',options:['\\(5\\)','\\(7\\)','\\(6\\)','\\(12\\)'],correct:0,difficulty:'easy'},
          {question:'What is \\(\\sin 30°\\)?',options:['\\(\\frac{1}{2}\\)','\\(\\frac{\\sqrt{3}}{2}\\)','\\(1\\)','\\(0\\)'],correct:0,difficulty:'easy'},
          {question:'What is the area of a circle with radius 4?',options:['\\(16\\pi\\)','\\(8\\pi\\)','\\(4\\pi\\)','\\(32\\pi\\)'],correct:0,difficulty:'easy'},
          {question:'Convert 90° to radians.',options:['\\(\\frac{\\pi}{2}\\)','\\(\\pi\\)','\\(2\\pi\\)','\\(\\frac{\\pi}{4}\\)'],correct:0,difficulty:'easy'},
          {question:'What is \\(\\cos 0°\\)?',options:['\\(1\\)','\\(0\\)','\\(\\frac{1}{2}\\)','\\(-1\\)'],correct:0,difficulty:'easy'},
          {question:'What is the volume of a cube with side 3?',options:['\\(27\\)','\\(9\\)','\\(18\\)','\\(81\\)'],correct:0,difficulty:'easy'},
          {question:'Two complementary angles sum to:',options:['90°','180°','360°','45°'],correct:0,difficulty:'easy'},
          {question:'What is \\(\\tan 45°\\)?',options:['\\(1\\)','\\(0\\)','\\(\\frac{\\sqrt{2}}{2}\\)','Undefined'],correct:0,difficulty:'easy'},
          {question:'The diameter of a circle is 14. What is its radius?',options:['\\(7\\)','\\(14\\)','\\(28\\)','\\(3.5\\)'],correct:0,difficulty:'easy'},
          {question:'What is the supplement of a 110° angle?',options:['70°','80°','110°','90°'],correct:0,difficulty:'easy'},
          {question:'A circle has radius 5. What is its area?',options:['\\(25\\pi\\)','\\(10\\pi\\)','\\(50\\pi\\)','\\(5\\pi\\)'],correct:0,difficulty:'medium'},
          {question:'In a right triangle, opposite = 3 and hypotenuse = 5. What is \\(\\sin \\theta\\)?',options:['\\(\\frac{3}{5}\\)','\\(\\frac{4}{5}\\)','\\(\\frac{5}{3}\\)','\\(\\frac{3}{4}\\)'],correct:0,difficulty:'medium'},
          {question:'Convert 180° to radians.',options:['\\(\\pi\\)','\\(2\\pi\\)','\\(\\frac{\\pi}{2}\\)','\\(\\frac{3\\pi}{2}\\)'],correct:0,difficulty:'medium'},
          {question:'The volume of a cylinder with \\(r=3\\) and \\(h=7\\) is:',options:['\\(63\\pi\\)','\\(42\\pi\\)','\\(21\\pi\\)','\\(49\\pi\\)'],correct:0,difficulty:'medium'},
          {question:'Find the distance between \\((1,2)\\) and \\((4,6)\\).',options:['\\(5\\)','\\(7\\)','\\(\\sqrt{7}\\)','\\(25\\)'],correct:0,difficulty:'medium'},
          {question:'The midpoint of \\((2, 8)\\) and \\((6, 4)\\) is:',options:['\\((4, 6)\\)','\\((8, 12)\\)','\\((3, 5)\\)','\\((4, 4)\\)'],correct:0,difficulty:'medium'},
          {question:'A sector has central angle 90° and radius 6. What is the arc length?',options:['\\(3\\pi\\)','\\(6\\pi\\)','\\(9\\pi\\)','\\(12\\pi\\)'],correct:0,difficulty:'medium'},
          {question:'What is \\(\\cos 60°\\)?',options:['\\(\\frac{1}{2}\\)','\\(\\frac{\\sqrt{3}}{2}\\)','\\(0\\)','\\(1\\)'],correct:0,difficulty:'medium'},
          {question:'Two similar triangles have sides in ratio 2:3. If the smaller has perimeter 12, the larger has:',options:['\\(18\\)','\\(24\\)','\\(8\\)','\\(36\\)'],correct:0,difficulty:'medium'},
          {question:'What is \\(\\sin 90°\\)?',options:['\\(1\\)','\\(0\\)','\\(\\frac{1}{2}\\)','\\(-1\\)'],correct:0,difficulty:'medium'},
          {question:'Find the area of a sector with radius 10 and central angle \\(\\frac{\\pi}{3}\\).',options:['\\(\\frac{50\\pi}{3}\\)','\\(\\frac{100\\pi}{3}\\)','\\(50\\pi\\)','\\(\\frac{10\\pi}{3}\\)'],correct:0,difficulty:'hard'},
          {question:'In triangle ABC, \\(a=7, b=10, C=60°\\). Find \\(c\\) using the Law of Cosines.',options:['\\(\\sqrt{79}\\)','\\(\\sqrt{149}\\)','\\(\\sqrt{51}\\)','\\(17\\)'],correct:0,difficulty:'hard'},
          {question:'A cone has radius 4 and height 9. What is its volume?',options:['\\(48\\pi\\)','\\(144\\pi\\)','\\(36\\pi\\)','\\(108\\pi\\)'],correct:0,difficulty:'hard'},
          {question:'If \\(\\sin \\theta = \\frac{5}{13}\\), what is \\(\\cos \\theta\\)?',options:['\\(\\frac{12}{13}\\)','\\(\\frac{5}{12}\\)','\\(\\frac{13}{5}\\)','\\(\\frac{8}{13}\\)'],correct:0,difficulty:'hard'},
          {question:'Convert \\(\\frac{5\\pi}{6}\\) radians to degrees.',options:['150°','120°','210°','300°'],correct:0,difficulty:'hard'},
          {question:'What is \\(\\tan 60°\\)?',options:['\\(\\sqrt{3}\\)','\\(1\\)','\\(\\frac{1}{\\sqrt{3}}\\)','\\(2\\)'],correct:0,difficulty:'hard'},
          {question:'A sphere has radius 6. What is its surface area?',options:['\\(144\\pi\\)','\\(36\\pi\\)','\\(288\\pi\\)','\\(72\\pi\\)'],correct:0,difficulty:'hard'},
          {question:'The equation of a circle with center \\((3,-2)\\) and radius 5 is:',options:['\\((x-3)^2+(y+2)^2=25\\)','\\((x+3)^2+(y-2)^2=25\\)','\\((x-3)^2+(y-2)^2=5\\)','\\(x^2+y^2=25\\)'],correct:0,difficulty:'hard'},
          {question:'In a 30-60-90 triangle, the side opposite 30° is 5. What is the hypotenuse?',options:['\\(10\\)','\\(5\\sqrt{3}\\)','\\(5\\sqrt{2}\\)','\\(15\\)'],correct:0,difficulty:'hard'},
          {question:'What is the arc length of a circle with radius 8 and central angle \\(\\frac{3\\pi}{4}\\)?',options:['\\(6\\pi\\)','\\(8\\pi\\)','\\(3\\pi\\)','\\(12\\pi\\)'],correct:0,difficulty:'hard'}
        ]},
      { title: 'Desmos & Calculator Strategy', subtitle: 'Fast-solve with graphing technology', icon: 'fa-calculator', color: '#10a37f',
        problems: [
          {question:'Using Desmos, find where \\(y = x^2\\) and \\(y = 4\\) intersect.',options:['\\(x = \\pm 2\\)','\\(x = 4\\)','\\(x = 1\\)','\\(x = 0\\)'],correct:0,difficulty:'easy'},
          {question:'Graph \\(y = 2x + 1\\) in Desmos. What is the y-intercept?',options:['\\(1\\)','\\(2\\)','\\(3\\)','\\(0\\)'],correct:0,difficulty:'easy'},
          {question:'Type \\(y = x^2 - 4\\) in Desmos. Where does it cross the x-axis?',options:['\\(x = \\pm 2\\)','\\(x = 4\\)','\\(x = -4\\)','\\(x = 0\\)'],correct:0,difficulty:'easy'},
          {question:'In Desmos, what happens when you type \\(y > x\\)?',options:['Shades above the line \\(y=x\\)','Shows a point','Nothing','Error'],correct:0,difficulty:'easy'},
          {question:'Graph \\(y = |x|\\) in Desmos. What shape appears?',options:['V-shape','U-shape','Straight line','Circle'],correct:0,difficulty:'easy'},
          {question:'What is the Desmos shortcut for \\(\\pi\\)?',options:['Type "pi"','Type "3.14"','Press Alt+P','Type "PI"'],correct:0,difficulty:'easy'},
          {question:'Graph \\(y = 3\\) in Desmos. What kind of line is this?',options:['Horizontal','Vertical','Diagonal','Curved'],correct:0,difficulty:'easy'},
          {question:'In Desmos, how do you find the minimum of \\(y = x^2 + 2\\)?',options:['Click the lowest point on the graph','Type "min"','Press Ctrl+M','Use a table'],correct:0,difficulty:'easy'},
          {question:'Type \\(x = 5\\) in Desmos. What appears?',options:['A vertical line','A horizontal line','A point','Nothing'],correct:0,difficulty:'easy'},
          {question:'How do you graph a system in Desmos?',options:['Type each equation on a separate line','Use commas','Use AND','Type both on one line'],correct:0,difficulty:'easy'},
          {question:'What is \\(\\sqrt{50}\\) simplified? Use Desmos to check.',options:['\\(5\\sqrt{2}\\)','\\(25\\)','\\(\\sqrt{50}\\)','\\(10\\)'],correct:0,difficulty:'easy'},
          {question:'In Desmos, how do you type an exponent?',options:['Use ^ symbol','Use ** symbol','Use "exp"','Use superscript button'],correct:0,difficulty:'easy'},
          {question:'Graph \\(y = x^3 - 3x\\). How many x-intercepts?',options:['\\(3\\)','\\(1\\)','\\(2\\)','\\(0\\)'],correct:0,difficulty:'medium'},
          {question:'Use Desmos to solve: \\(2^x = 10\\). Which is closest?',options:['\\(3.32\\)','\\(3.5\\)','\\(2.5\\)','\\(4\\)'],correct:0,difficulty:'medium'},
          {question:'What is the minimum of \\(y = x^2 - 6x + 13\\)?',options:['\\(4\\)','\\(0\\)','\\(7\\)','\\(13\\)'],correct:0,difficulty:'medium'},
          {question:'Graph \\(y > 2x - 1\\) and \\(y < -x + 5\\). Boundary intersection is:',options:['\\((2, 3)\\)','\\((3, 5)\\)','\\((1, 1)\\)','\\((4, 1)\\)'],correct:0,difficulty:'medium'},
          {question:'Use Desmos to find the vertex of \\(y = -2x^2 + 8x - 3\\).',options:['\\((2, 5)\\)','\\((4, -3)\\)','\\((1, 3)\\)','\\((-2, 5)\\)'],correct:0,difficulty:'medium'},
          {question:'In Desmos, use a slider \\(a\\) to explore \\(y = ax^2\\). When \\(a < 0\\) the parabola:',options:['Opens downward','Opens upward','Is a line','Disappears'],correct:0,difficulty:'medium'},
          {question:'Graph \\(y = \\sin(x)\\). What is the period?',options:['\\(2\\pi\\)','\\(\\pi\\)','\\(1\\)','\\(360\\)'],correct:0,difficulty:'medium'},
          {question:'Use Desmos to find the intersection of \\(y = x^2\\) and \\(y = x + 2\\).',options:['\\((-1,1)\\) and \\((2,4)\\)','\\((0,0)\\) and \\((3,9)\\)','\\((1,1)\\) and \\((4,6)\\)','No intersection'],correct:0,difficulty:'hard'},
          {question:'Use regression in Desmos: fit \\(y = ax + b\\) to points (1,2), (2,5), (3,7). Approx slope?',options:['\\(2.5\\)','\\(1\\)','\\(3\\)','\\(5\\)'],correct:0,difficulty:'hard'},
          {question:'Graph \\(y = \\frac{1}{x-2}\\) in Desmos. Vertical asymptote at:',options:['\\(x=2\\)','\\(x=-2\\)','\\(x=0\\)','\\(y=0\\)'],correct:0,difficulty:'hard'},
          {question:'Use Desmos to solve \\(x^3 = 8x\\). How many real solutions?',options:['\\(3\\)','\\(1\\)','\\(2\\)','\\(0\\)'],correct:0,difficulty:'hard'},
          {question:'Using Desmos, approximate \\(\\log_3(50)\\).',options:['\\(\\approx 3.56\\)','\\(\\approx 4.2\\)','\\(\\approx 2.1\\)','\\(\\approx 5\\)'],correct:0,difficulty:'hard'}
        ]}
    ],
    act: [
      { title: 'Pre-Algebra & Elementary', subtitle: 'Fractions, decimals, basic equations', icon: 'fa-plus-minus', color: '#6366f1',
        problems: [
          {question:'What is \\(\\frac{3}{4} + \\frac{2}{3}\\)?',options:['\\(\\frac{17}{12}\\)','\\(\\frac{5}{7}\\)','\\(1\\)','\\(\\frac{11}{12}\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(5x - 3 = 22\\)',options:['\\(5\\)','\\(3\\)','\\(7\\)','\\(4\\)'],correct:0,difficulty:'easy'},
          {question:'What is 15% of 80?',options:['\\(12\\)','\\(15\\)','\\(8\\)','\\(10\\)'],correct:0,difficulty:'easy'},
          {question:'Simplify: \\(\\frac{12}{18}\\)',options:['\\(\\frac{2}{3}\\)','\\(\\frac{3}{4}\\)','\\(\\frac{4}{6}\\)','\\(\\frac{1}{2}\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(x + 7 = 15\\)',options:['\\(8\\)','\\(22\\)','\\(7\\)','\\(15\\)'],correct:0,difficulty:'easy'},
          {question:'What is \\((-5) \\times (-3)\\)?',options:['\\(15\\)','\\(-15\\)','\\(8\\)','\\(-8\\)'],correct:0,difficulty:'easy'},
          {question:'Convert \\(0.6\\) to a fraction.',options:['\\(\\frac{3}{5}\\)','\\(\\frac{6}{10}\\)','\\(\\frac{2}{3}\\)','\\(\\frac{1}{6}\\)'],correct:0,difficulty:'easy'},
          {question:'What is \\(2^4\\)?',options:['\\(16\\)','\\(8\\)','\\(6\\)','\\(32\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(3x = 27\\)',options:['\\(9\\)','\\(3\\)','\\(27\\)','\\(81\\)'],correct:0,difficulty:'easy'},
          {question:'What is the GCF of 12 and 18?',options:['\\(6\\)','\\(3\\)','\\(9\\)','\\(12\\)'],correct:0,difficulty:'easy'},
          {question:'Simplify: \\(\\frac{7}{14}\\)',options:['\\(\\frac{1}{2}\\)','\\(\\frac{7}{14}\\)','\\(2\\)','\\(\\frac{2}{7}\\)'],correct:0,difficulty:'easy'},
          {question:'What is the LCM of 4 and 6?',options:['\\(12\\)','\\(24\\)','\\(2\\)','\\(6\\)'],correct:0,difficulty:'easy'},
          {question:'Evaluate: \\(|-7|\\)',options:['\\(7\\)','\\(-7\\)','\\(0\\)','\\(49\\)'],correct:0,difficulty:'easy'},
          {question:'What is \\(\\frac{2}{5}\\) of 100?',options:['\\(40\\)','\\(20\\)','\\(50\\)','\\(25\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(x - 12 = -4\\)',options:['\\(8\\)','\\(-16\\)','\\(16\\)','\\(-8\\)'],correct:0,difficulty:'easy'},
          {question:'If \\(|x - 4| = 7\\), the possible values of \\(x\\) are:',options:['\\(11\\) or \\(-3\\)','\\(7\\) or \\(4\\)','\\(3\\) or \\(-7\\)','\\(11\\) or \\(3\\)'],correct:0,difficulty:'medium'},
          {question:'Simplify: \\(2^3 \\times 2^4\\)',options:['\\(2^7 = 128\\)','\\(2^{12}\\)','\\(16\\)','\\(48\\)'],correct:0,difficulty:'medium'},
          {question:'Solve: \\(\\frac{3x}{4} = 12\\)',options:['\\(16\\)','\\(9\\)','\\(48\\)','\\(3\\)'],correct:0,difficulty:'medium'},
          {question:'A recipe needs \\(\\frac{2}{3}\\) cup for 4 servings. How much for 6?',options:['\\(1\\) cup','\\(\\frac{4}{3}\\) cups','\\(\\frac{1}{2}\\) cup','\\(2\\) cups'],correct:0,difficulty:'medium'},
          {question:'What is \\((-2)^5\\)?',options:['\\(-32\\)','\\(32\\)','\\(-10\\)','\\(10\\)'],correct:0,difficulty:'medium'},
          {question:'Solve: \\(2(x + 3) - 4 = 10\\)',options:['\\(4\\)','\\(7\\)','\\(3\\)','\\(5\\)'],correct:0,difficulty:'medium'},
          {question:'What is \\(\\sqrt{144}\\)?',options:['\\(12\\)','\\(14\\)','\\(11\\)','\\(72\\)'],correct:0,difficulty:'medium'},
          {question:'If a price drops from $60 to $45, what is the percent decrease?',options:['25%','15%','33%','20%'],correct:0,difficulty:'medium'},
          {question:'Simplify: \\(\\frac{x^5}{x^2}\\)',options:['\\(x^3\\)','\\(x^7\\)','\\(x^{10}\\)','\\(x^{2.5}\\)'],correct:0,difficulty:'medium'},
          {question:'Solve: \\(|2x + 1| = 9\\)',options:['\\(4\\) or \\(-5\\)','\\(5\\) or \\(-4\\)','\\(9\\) or \\(-9\\)','\\(4\\) or \\(5\\)'],correct:0,difficulty:'medium'},
          {question:'Solve: \\(\\frac{2}{x} = \\frac{6}{9}\\)',options:['\\(3\\)','\\(6\\)','\\(9\\)','\\(27\\)'],correct:0,difficulty:'hard'},
          {question:'If \\(a^2 = 49\\) and \\(a < 0\\), what is \\(a^3\\)?',options:['\\(-343\\)','\\(343\\)','\\(-49\\)','\\(21\\)'],correct:0,difficulty:'hard'},
          {question:'Simplify: \\(\\frac{3^{-2} \\times 3^5}{3^2}\\)',options:['\\(3\\)','\\(9\\)','\\(27\\)','\\(1\\)'],correct:0,difficulty:'hard'},
          {question:'Solve: \\(\\frac{x+2}{3} = \\frac{x-1}{2}\\)',options:['\\(7\\)','\\(5\\)','\\(3\\)','\\(-7\\)'],correct:0,difficulty:'hard'},
          {question:'If \\(n!/(n-2)! = 30\\), find \\(n\\).',options:['\\(6\\)','\\(5\\)','\\(30\\)','\\(15\\)'],correct:0,difficulty:'hard'},
          {question:'What is \\(\\sqrt[3]{-27}\\)?',options:['\\(-3\\)','\\(3\\)','\\(-9\\)','Undefined'],correct:0,difficulty:'hard'}
        ]},
      { title: 'Intermediate Algebra & Coordinate', subtitle: 'Quadratics, functions, graphing', icon: 'fa-chart-line', color: '#059669',
        problems: [
          {question:'What is the slope of the line through \\((1,3)\\) and \\((4,9)\\)?',options:['\\(2\\)','\\(3\\)','\\(6\\)','\\(\\frac{1}{2}\\)'],correct:0,difficulty:'easy'},
          {question:'Find the midpoint of \\((2,6)\\) and \\((8,10)\\).',options:['\\((5,8)\\)','\\((6,8)\\)','\\((4,7)\\)','\\((3,5)\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(x^2 - 9 = 0\\)',options:['\\(x = \\pm 3\\)','\\(x = 9\\)','\\(x = 3\\)','\\(x = -9\\)'],correct:0,difficulty:'easy'},
          {question:'What is the y-intercept of \\(y = 3x - 7\\)?',options:['\\(-7\\)','\\(3\\)','\\(7\\)','\\(0\\)'],correct:0,difficulty:'easy'},
          {question:'What is \\(f(2)\\) if \\(f(x) = x^2 + 1\\)?',options:['\\(5\\)','\\(4\\)','\\(3\\)','\\(9\\)'],correct:0,difficulty:'easy'},
          {question:'The slope of a horizontal line is:',options:['\\(0\\)','Undefined','\\(1\\)','\\(-1\\)'],correct:0,difficulty:'easy'},
          {question:'What is the distance between \\((0,0)\\) and \\((3,4)\\)?',options:['\\(5\\)','\\(7\\)','\\(4\\)','\\(3.5\\)'],correct:0,difficulty:'easy'},
          {question:'Solve: \\(x^2 = 16\\)',options:['\\(\\pm 4\\)','\\(4\\)','\\(16\\)','\\(8\\)'],correct:0,difficulty:'easy'},
          {question:'If a line has slope \\(-2\\) and passes through \\((0,5)\\), the equation is:',options:['\\(y = -2x + 5\\)','\\(y = 2x + 5\\)','\\(y = -2x - 5\\)','\\(y = 5x - 2\\)'],correct:0,difficulty:'easy'},
          {question:'What type of function is \\(f(x) = 3x + 2\\)?',options:['Linear','Quadratic','Cubic','Exponential'],correct:0,difficulty:'easy'},
          {question:'The vertex of \\(y = (x-2)^2 + 3\\) is:',options:['\\((2, 3)\\)','\\((-2, 3)\\)','\\((2, -3)\\)','\\((3, 2)\\)'],correct:0,difficulty:'easy'},
          {question:'What is the slope of \\(y = -5\\)?',options:['\\(0\\)','\\(-5\\)','Undefined','\\(5\\)'],correct:0,difficulty:'easy'},
          {question:'In the sequence 2, 6, 18, 54, ..., the common ratio is:',options:['\\(3\\)','\\(4\\)','\\(2\\)','\\(6\\)'],correct:0,difficulty:'medium'},
          {question:'Solve the system: \\(x + y = 7,\\; 2x - y = 5\\)',options:['\\((4, 3)\\)','\\((3, 4)\\)','\\((5, 2)\\)','\\((2, 5)\\)'],correct:0,difficulty:'medium'},
          {question:'What is the vertex of \\(y = x^2 - 4x + 7\\)?',options:['\\((2, 3)\\)','\\((-2, 7)\\)','\\((4, 7)\\)','\\((2, 7)\\)'],correct:0,difficulty:'medium'},
          {question:'The distance between \\((-1, 2)\\) and \\((3, -1)\\) is:',options:['\\(5\\)','\\(\\sqrt{7}\\)','\\(25\\)','\\(7\\)'],correct:0,difficulty:'medium'},
          {question:'If \\(f(x) = 2x^2 - 3x + 1\\), what is \\(f(0)\\)?',options:['\\(1\\)','\\(0\\)','\\(-3\\)','\\(2\\)'],correct:0,difficulty:'medium'},
          {question:'Find the equation of the line through \\((1,4)\\) with slope \\(3\\).',options:['\\(y = 3x + 1\\)','\\(y = 3x + 4\\)','\\(y = x + 3\\)','\\(y = 4x + 1\\)'],correct:0,difficulty:'medium'},
          {question:'What is the 10th term of the arithmetic sequence: 3, 7, 11, 15, ...?',options:['\\(39\\)','\\(43\\)','\\(35\\)','\\(47\\)'],correct:0,difficulty:'medium'},
          {question:'Lines \\(y = 2x + 1\\) and \\(y = 2x - 3\\) are:',options:['Parallel','Perpendicular','Identical','Intersecting'],correct:0,difficulty:'medium'},
          {question:'What is the range of \\(f(x) = x^2 + 1\\)?',options:['\\([1, \\infty)\\)','\\((-\\infty, \\infty)\\)','\\([0, \\infty)\\)','\\((1, \\infty)\\)'],correct:0,difficulty:'medium'},
          {question:'If \\(f(x) = \\frac{1}{x-3}\\), the domain excludes:',options:['\\(x=3\\)','\\(x=0\\)','\\(x=-3\\)','\\(x=1\\)'],correct:0,difficulty:'hard'},
          {question:'Solve: \\(x^2 - 2x - 15 = 0\\)',options:['\\(x=5\\) or \\(x=-3\\)','\\(x=3\\) or \\(x=-5\\)','\\(x=15\\) or \\(x=-1\\)','\\(x=1\\) or \\(x=-15\\)'],correct:0,difficulty:'hard'},
          {question:'What is the equation of a line perpendicular to \\(y=3x+1\\) through \\((6,2)\\)?',options:['\\(y = -\\frac{1}{3}x + 4\\)','\\(y = 3x - 16\\)','\\(y = -3x + 20\\)','\\(y = \\frac{1}{3}x\\)'],correct:0,difficulty:'hard'},
          {question:'Find the sum of the first 20 terms of the arithmetic sequence: 5, 8, 11, ...',options:['\\(670\\)','\\(600\\)','\\(700\\)','\\(1140\\)'],correct:0,difficulty:'hard'},
          {question:'If \\(f(x) = x^3 - 3x\\), where is \\(f(x) = 0\\)?',options:['\\(x = 0, \\pm\\sqrt{3}\\)','\\(x = 0, 3\\)','\\(x = \\pm 3\\)','\\(x = 0, 1, -1\\)'],correct:0,difficulty:'hard'},
          {question:'What is the inverse of \\(f(x) = 2x + 6\\)?',options:['\\(f^{-1}(x) = \\frac{x-6}{2}\\)','\\(f^{-1}(x) = \\frac{x+6}{2}\\)','\\(f^{-1}(x) = 2x - 6\\)','\\(f^{-1}(x) = -2x - 6\\)'],correct:0,difficulty:'hard'},
          {question:'The asymptote of \\(y = \\frac{2x+1}{x-1}\\) is at:',options:['\\(x=1\\) and \\(y=2\\)','\\(x=-1\\) and \\(y=0\\)','\\(x=0\\) and \\(y=1\\)','\\(x=2\\) and \\(y=1\\)'],correct:0,difficulty:'hard'}
        ]},
      { title: 'Plane & Solid Geometry', subtitle: 'Angles, triangles, circles, 3D shapes', icon: 'fa-shapes', color: '#d9a445',
        problems: [
          {question:'Two angles of a triangle are 45° and 65°. What is the third?',options:['70°','80°','60°','90°'],correct:0,difficulty:'easy'},
          {question:'What is the area of a rectangle with length 12 and width 5?',options:['\\(60\\)','\\(34\\)','\\(17\\)','\\(120\\)'],correct:0,difficulty:'easy'},
          {question:'A circle has diameter 10. Its circumference is:',options:['\\(10\\pi\\)','\\(5\\pi\\)','\\(20\\pi\\)','\\(25\\pi\\)'],correct:0,difficulty:'easy'},
          {question:'What is the volume of a cube with side 4?',options:['\\(64\\)','\\(16\\)','\\(48\\)','\\(256\\)'],correct:0,difficulty:'easy'},
          {question:'The perimeter of a square with side 9 is:',options:['\\(36\\)','\\(81\\)','\\(18\\)','\\(27\\)'],correct:0,difficulty:'easy'},
          {question:'What is the area of a circle with radius 7?',options:['\\(49\\pi\\)','\\(14\\pi\\)','\\(7\\pi\\)','\\(98\\pi\\)'],correct:0,difficulty:'easy'},
          {question:'A right triangle has legs 5 and 12. Hypotenuse is:',options:['\\(13\\)','\\(17\\)','\\(7\\)','\\(60\\)'],correct:0,difficulty:'easy'},
          {question:'What is the area of a triangle with base 8 and height 6?',options:['\\(24\\)','\\(48\\)','\\(14\\)','\\(36\\)'],correct:0,difficulty:'easy'},
          {question:'Supplementary angles sum to:',options:['180°','90°','360°','270°'],correct:0,difficulty:'easy'},
          {question:'The volume of a rectangular prism 3×4×5 is:',options:['\\(60\\)','\\(12\\)','\\(47\\)','\\(120\\)'],correct:0,difficulty:'easy'},
          {question:'What is the surface area of a cube with side 2?',options:['\\(24\\)','\\(8\\)','\\(12\\)','\\(48\\)'],correct:0,difficulty:'easy'},
          {question:'An equilateral triangle has side 6. What is its perimeter?',options:['\\(18\\)','\\(36\\)','\\(12\\)','\\(9\\)'],correct:0,difficulty:'easy'},
          {question:'Two similar triangles have sides in ratio 2:5. Smaller area = 8. Larger area:',options:['\\(50\\)','\\(20\\)','\\(32\\)','\\(80\\)'],correct:0,difficulty:'medium'},
          {question:'A cylinder has \\(r=5\\) and \\(h=10\\). Volume is:',options:['\\(250\\pi\\)','\\(100\\pi\\)','\\(500\\pi\\)','\\(50\\pi\\)'],correct:0,difficulty:'medium'},
          {question:'An arc subtends 120° in a circle of radius 6. Arc length:',options:['\\(4\\pi\\)','\\(12\\pi\\)','\\(2\\pi\\)','\\(6\\pi\\)'],correct:0,difficulty:'medium'},
          {question:'A trapezoid has bases 8 and 12, height 5. Area is:',options:['\\(50\\)','\\(60\\)','\\(40\\)','\\(100\\)'],correct:0,difficulty:'medium'},
          {question:'The exterior angle of a regular hexagon is:',options:['60°','90°','120°','30°'],correct:0,difficulty:'medium'},
          {question:'What is the diagonal of a rectangle 6 × 8?',options:['\\(10\\)','\\(14\\)','\\(48\\)','\\(\\sqrt{48}\\)'],correct:0,difficulty:'medium'},
          {question:'A cone has \\(r=3\\) and slant height 5. Lateral surface area:',options:['\\(15\\pi\\)','\\(9\\pi\\)','\\(45\\pi\\)','\\(25\\pi\\)'],correct:0,difficulty:'hard'},
          {question:'A sphere has volume \\(\\frac{256}{3}\\pi\\). What is its radius?',options:['\\(4\\)','\\(8\\)','\\(16\\)','\\(2\\)'],correct:0,difficulty:'hard'},
          {question:'In triangle ABC, AB=13, BC=14, AC=15. What is the area?',options:['\\(84\\)','\\(91\\)','\\(105\\)','\\(42\\)'],correct:0,difficulty:'hard'},
          {question:'The sum of interior angles of a decagon (10 sides) is:',options:['1440°','1800°','1080°','3600°'],correct:0,difficulty:'hard'},
          {question:'A regular octagon has how many diagonals?',options:['\\(20\\)','\\(16\\)','\\(24\\)','\\(8\\)'],correct:0,difficulty:'hard'},
          {question:'Two circles have radii 3 and 5. Distance between centers is 8. How many common tangents?',options:['\\(3\\)','\\(2\\)','\\(4\\)','\\(1\\)'],correct:0,difficulty:'hard'}
        ]},
      { title: 'Trigonometry', subtitle: 'Trig functions, identities, law of sines/cosines', icon: 'fa-wave-square', color: '#ef4444',
        problems: [
          {question:'In a right triangle, opposite = 5 and adjacent = 12. \\(\\tan\\theta =\\)',options:['\\(\\frac{5}{12}\\)','\\(\\frac{12}{5}\\)','\\(\\frac{5}{13}\\)','\\(\\frac{12}{13}\\)'],correct:0,difficulty:'easy'},
          {question:'What is \\(\\cos 60°\\)?',options:['\\(\\frac{1}{2}\\)','\\(\\frac{\\sqrt{3}}{2}\\)','\\(\\frac{\\sqrt{2}}{2}\\)','\\(0\\)'],correct:0,difficulty:'easy'},
          {question:'\\(\\sin^2 x + \\cos^2 x = \\)',options:['\\(1\\)','\\(0\\)','\\(\\sin 2x\\)','\\(2\\)'],correct:0,difficulty:'easy'},
          {question:'What is \\(\\sin 0°\\)?',options:['\\(0\\)','\\(1\\)','\\(\\frac{1}{2}\\)','\\(-1\\)'],correct:0,difficulty:'easy'},
          {question:'Convert 90° to radians.',options:['\\(\\frac{\\pi}{2}\\)','\\(\\pi\\)','\\(2\\pi\\)','\\(\\frac{\\pi}{4}\\)'],correct:0,difficulty:'easy'},
          {question:'What is \\(\\tan 0°\\)?',options:['\\(0\\)','\\(1\\)','Undefined','\\(-1\\)'],correct:0,difficulty:'easy'},
          {question:'\\(\\cos 90° =\\)',options:['\\(0\\)','\\(1\\)','\\(-1\\)','\\(\\frac{1}{2}\\)'],correct:0,difficulty:'easy'},
          {question:'SOH-CAH-TOA: \\(\\sin =\\)',options:['Opposite/Hypotenuse','Adjacent/Hypotenuse','Opposite/Adjacent','Hypotenuse/Opposite'],correct:0,difficulty:'easy'},
          {question:'What is \\(\\sin 45°\\)?',options:['\\(\\frac{\\sqrt{2}}{2}\\)','\\(\\frac{1}{2}\\)','\\(1\\)','\\(\\frac{\\sqrt{3}}{2}\\)'],correct:0,difficulty:'easy'},
          {question:'Convert 180° to radians.',options:['\\(\\pi\\)','\\(2\\pi\\)','\\(\\frac{\\pi}{2}\\)','\\(\\frac{3\\pi}{2}\\)'],correct:0,difficulty:'easy'},
          {question:'If \\(\\sin A = \\frac{3}{5}\\), what is \\(\\cos A\\) in a right triangle?',options:['\\(\\frac{4}{5}\\)','\\(\\frac{3}{4}\\)','\\(\\frac{5}{3}\\)','\\(\\frac{2}{5}\\)'],correct:0,difficulty:'medium'},
          {question:'What is \\(\\sin 120°\\)?',options:['\\(\\frac{\\sqrt{3}}{2}\\)','\\(\\frac{1}{2}\\)','\\(-\\frac{\\sqrt{3}}{2}\\)','\\(-\\frac{1}{2}\\)'],correct:0,difficulty:'medium'},
          {question:'Convert \\(\\frac{2\\pi}{3}\\) radians to degrees.',options:['120°','60°','240°','90°'],correct:0,difficulty:'medium'},
          {question:'If \\(\\tan\\theta = 1\\), what is \\(\\theta\\) in the first quadrant?',options:['45°','30°','60°','90°'],correct:0,difficulty:'medium'},
          {question:'What is \\(\\cos 180°\\)?',options:['\\(-1\\)','\\(0\\)','\\(1\\)','\\(\\frac{1}{2}\\)'],correct:0,difficulty:'medium'},
          {question:'Using Law of Sines: if \\(A=30°, a=5, B=60°\\), find \\(b\\).',options:['\\(5\\sqrt{3}\\)','\\(10\\)','\\(\\frac{5}{2}\\)','\\(\\frac{5\\sqrt{3}}{3}\\)'],correct:0,difficulty:'hard'},
          {question:'Using Law of Cosines: \\(a=7, b=8, C=60°\\). Find \\(c\\).',options:['\\(\\sqrt{57}\\)','\\(\\sqrt{113}\\)','\\(15\\)','\\(\\sqrt{169}\\)'],correct:0,difficulty:'hard'},
          {question:'What is the period of \\(y = 3\\sin(2x)\\)?',options:['\\(\\pi\\)','\\(2\\pi\\)','\\(\\frac{\\pi}{2}\\)','\\(3\\pi\\)'],correct:0,difficulty:'hard'},
          {question:'Simplify: \\(\\frac{\\sin x}{\\cos x}\\)',options:['\\(\\tan x\\)','\\(\\cot x\\)','\\(\\sec x\\)','\\(\\csc x\\)'],correct:0,difficulty:'hard'},
          {question:'What is the amplitude of \\(y = -4\\cos(x) + 1\\)?',options:['\\(4\\)','\\(1\\)','\\(-4\\)','\\(5\\)'],correct:0,difficulty:'hard'},
          {question:'In which quadrant is \\(\\sin > 0\\) and \\(\\cos < 0\\)?',options:['Quadrant II','Quadrant I','Quadrant III','Quadrant IV'],correct:0,difficulty:'hard'}
        ]},
      { title: 'ACT Speed & Strategy', subtitle: 'Pacing, elimination, and fast methods', icon: 'fa-bolt', color: '#f97316',
        problems: [
          {question:'ACT math gives you 60 min for 60 questions. Time per question?',options:['60 seconds','90 seconds','45 seconds','120 seconds'],correct:0,difficulty:'easy'},
          {question:'Is there a penalty for wrong answers on the ACT?',options:['No','Yes','Only on hard questions','Only in math'],correct:0,difficulty:'easy'},
          {question:'What should you do if stuck on a hard problem?',options:['Skip and come back','Spend 5 min on it','Guess randomly','Leave blank'],correct:0,difficulty:'easy'},
          {question:'Backsolving means:',options:['Plugging in answer choices','Working backwards from the question','Guessing the last answer','Skipping the problem'],correct:0,difficulty:'easy'},
          {question:'If you can eliminate 2 of 5 choices, your guess probability is:',options:['\\(\\frac{1}{3}\\)','\\(\\frac{1}{5}\\)','\\(\\frac{2}{5}\\)','\\(\\frac{1}{2}\\)'],correct:0,difficulty:'easy'},
          {question:'"Picking numbers" means:',options:['Substituting easy values','Choosing random answers','Counting digits','Memorizing formulas'],correct:0,difficulty:'easy'},
          {question:'On the ACT, which questions are hardest?',options:['The last ones in each section','The first ones','Middle ones','They are random'],correct:0,difficulty:'easy'},
          {question:'Should you answer every question on the ACT?',options:['Yes — no guessing penalty','No — wrong answers penalize','Only if sure','Only the easy ones'],correct:0,difficulty:'easy'},
          {question:'If \\(2x + 1 = 9\\), backsolve with \\(x=4\\). Does \\(2(4)+1=9\\)?',options:['Yes','No, try \\(x=3\\)','No, try \\(x=5\\)','Cannot determine'],correct:0,difficulty:'medium'},
          {question:'Pick numbers: if "\\(x\\)% of \\(y\\) = \\(z\\)" and \\(x=10, y=50\\), then \\(z=\\)',options:['\\(5\\)','\\(10\\)','\\(50\\)','\\(500\\)'],correct:0,difficulty:'medium'},
          {question:'You have 10 min left and 8 questions. Best strategy?',options:['Answer quickly, guess the rest','Skip all','Spend 5 min on 1','Leave blank'],correct:0,difficulty:'medium'},
          {question:'If \\(x + y = 10\\) and \\(x = 7\\), what is \\(y\\)? (fastest method)',options:['\\(3\\) — mental subtraction','Solve system','Graph both','Use quadratic formula'],correct:0,difficulty:'medium'},
          {question:'On the ACT, "Cannot be determined" is usually:',options:['Wrong','Right','Only right 50% of the time','Always right for geometry'],correct:0,difficulty:'medium'},
          {question:'To estimate \\(\\sqrt{50}\\) quickly, note it is between:',options:['\\(7\\) and \\(8\\)','\\(6\\) and \\(7\\)','\\(5\\) and \\(6\\)','\\(8\\) and \\(9\\)'],correct:0,difficulty:'medium'},
          {question:'If you have 35 min for 20 questions, about how long per question?',options:['1 min 45 sec','2 min','1 min 30 sec','1 min'],correct:0,difficulty:'medium'},
          {question:'You can eliminate 2 of 4 choices. Probability of guessing correctly?',options:['50%','25%','33%','75%'],correct:0,difficulty:'hard'},
          {question:'On a 60-question section, skip the hardest 5 and get the rest right. Score?',options:['~92%','~80%','~95%','~85%'],correct:0,difficulty:'hard'},
          {question:'When is estimation better than solving exactly?',options:['When answer choices are far apart','Always','Never','Only on geometry'],correct:0,difficulty:'hard'},
          {question:'If a problem has fractions, multiplying everything by the LCD is called:',options:['Clearing fractions','Cross-multiplying','Simplifying','Reducing'],correct:0,difficulty:'hard'},
          {question:'For "which must be true" questions, the best strategy is:',options:['Test a counterexample for each choice','Solve algebraically','Guess C','Skip it'],correct:0,difficulty:'hard'}
        ]}
    ]
  };

  function renderTestPrepSection(tab) {
    var container = document.getElementById('test-prep-content');
    if (!container) return;
    var data = TEST_PREP_DATA[tab] || TEST_PREP_DATA.sat;
    state._tpTab = tab;
    state._tpDifficulty = null;
    state._tpTopic = null;
    state._tpStates = {};
    var poolCount = data.reduce(function(n, c) { return n + ((c.problems || []).length); }, 0);
    var mockBanner = '<div class="mock-cta">' +
      '<div class="mock-cta-text">' +
        '<h3><i class="fas fa-stopwatch"></i> Timed ' + tab.toUpperCase() + ' Mock Test</h3>' +
        '<p>A full timed run under real test conditions — no peeking at answers until you submit. Get a score report and add anything you miss to your Review notebook.</p>' +
      '</div>' +
      '<button class="btn btn-primary btn-lg" onclick="App.startMockTest(\'' + tab + '\')"><i class="fas fa-play"></i> Start Mock Test</button>' +
    '</div>';
    container.innerHTML = mockBanner + '<div class="tp-tiles">' + data.map(function(card, ci) {
      return '<div class="tp-tile" onclick="App.openTestPrepTopic(\'' + tab + '\',' + ci + ')" style="border-top:4px solid ' + card.color + '">' +
        '<div class="tp-tile-icon" style="background:' + card.color + '"><i class="fas ' + card.icon + '"></i></div>' +
        '<div class="tp-tile-title">' + card.title + '</div>' +
        '<div class="tp-tile-sub">' + card.subtitle + '</div>' +
        '<div class="tp-tile-action"><i class="fas fa-pencil-alt"></i> Practice Questions</div>' +
      '</div>';
    }).join('') + '</div>';
  }

  function openTestPrepTopic(tab, idx) {
    var data = TEST_PREP_DATA[tab] || TEST_PREP_DATA.sat;
    var card = data[idx];
    if (!card) return;
    state._tpTab = tab;
    state._tpTopic = idx;
    state._tpDifficulty = null;
    state._tpStates = {};
    var container = document.getElementById('test-prep-content');
    container.innerHTML =
      '<div class="tp-practice-view">' +
        '<button class="tp-back-btn" onclick="App.renderTestPrepSection(\'' + tab + '\')"><i class="fas fa-arrow-left"></i> Back to topics</button>' +
        '<h2 class="tp-practice-title" style="color:' + card.color + '"><i class="fas ' + card.icon + '"></i> ' + card.title + '</h2>' +
        '<p class="tp-practice-sub">' + card.subtitle + '</p>' +
        '<div class="tp-difficulty-select">' +
          '<p>Choose a difficulty level:</p>' +
          '<div class="difficulty-options">' +
            '<button type="button" class="difficulty-btn difficulty-easy" onclick="App.setTestPrepDifficulty(\'easy\')">' +
              '<i class="fas fa-leaf"></i> Easy</button>' +
            '<button type="button" class="difficulty-btn difficulty-medium" onclick="App.setTestPrepDifficulty(\'medium\')">' +
              '<i class="fas fa-balance-scale"></i> Medium</button>' +
            '<button type="button" class="difficulty-btn difficulty-hard" onclick="App.setTestPrepDifficulty(\'hard\')">' +
              '<i class="fas fa-fire"></i> Hard</button>' +
          '</div>' +
          '<div class="generate-quiz-divider"><span>or</span></div>' +
          '<button type="button" class="btn btn-accent generate-quiz-btn" onclick="App.generateTestPrepQuiz()">' +
            '<i class="fas fa-shuffle"></i> Generate Quiz' +
            '<span class="generate-quiz-sub">15 random questions &bull; all difficulties</span>' +
          '</button>' +
        '</div>' +
        '<div id="tp-questions-area"></div>' +
      '</div>';
  }

  function setTestPrepDifficulty(level) {
    state._tpDifficulty = level;
    state._tpStates = {};
    var tab = state._tpTab;
    var idx = state._tpTopic;
    var data = TEST_PREP_DATA[tab] || TEST_PREP_DATA.sat;
    var card = data[idx];
    if (!card) return;
    var filtered = (card.problems || []).filter(function(p) { return p.difficulty === level; }).map(shuffleOptions);
    for (var i = filtered.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = filtered[i]; filtered[i] = filtered[j]; filtered[j] = tmp;
    }
    state._tpFilteredBank = filtered;
    state._tpCardTitle = card.title || '';
    var area = document.getElementById('tp-questions-area');
    var diffSelect = document.querySelector('.tp-difficulty-select');
    if (diffSelect) diffSelect.style.display = 'none';
    area.innerHTML =
      '<div class="practice-header-row">' +
        '<h3>Practice — ' + level.charAt(0).toUpperCase() + level.slice(1) + '</h3>' +
        '<button type="button" class="btn btn-ghost btn-sm practice-switch-difficulty" onclick="App.openTestPrepTopic(\'' + tab + '\',' + idx + ')">' +
          '<i class="fas fa-exchange-alt"></i> Switch difficulty</button>' +
      '</div>' +
      '<p style="color:var(--text-secondary);margin-bottom:16px;">' + filtered.length + ' questions</p>' +
      filtered.map(function(p, qi) {
        return '<div class="problem-card" id="tp-prob-' + qi + '">' +
          '<div class="problem-meta">' + (qi + 1) + ' — ' + card.title + '</div>' +
          '<div class="problem-question">' + p.question + '</div>' +
          '<div class="problem-options">' +
            (p.options || []).map(function(opt, oi) {
              return '<button class="option-btn" onclick="App.selectTestPrepAnswer(' + qi + ',' + oi + ',' + p.correct + ')">' +
                '<span class="option-letter">' + String.fromCharCode(65 + oi) + '</span><span>' + opt + '</span></button>';
            }).join('') +
          '</div>' +
        '</div>';
      }).join('');
    renderMath(area);
  }

  function selectTestPrepAnswer(qi, selected, correct) {
    if (state._tpStates[qi] !== undefined) return;
    state._tpStates[qi] = selected;
    var card = document.getElementById('tp-prob-' + qi);
    if (!card) return;
    var btns = card.querySelectorAll('.option-btn');
    btns.forEach(function(b, i) {
      b.disabled = true;
      b.classList.add('disabled');
      if (i === correct) b.classList.add('correct');
      else if (i === selected && selected !== correct) b.classList.add('wrong');
    });

    if (selected === correct) {
      addXP(10);
    } else {
      var tpBank = state._tpFilteredBank || [];
      if (tpBank[qi]) recordMistake(tpBank[qi], selected, ((state._tpTab || 'sat').toUpperCase()) + ' Prep — ' + (state._tpCardTitle || ''));
      if (!card.querySelector('.ai-wrong-prompt')) {
        var prompt = document.createElement('div');
        prompt.className = 'ai-wrong-prompt';
        prompt.innerHTML = '<p>Don\'t understand what you did wrong?</p>' +
          '<button class="btn btn-glass btn-sm ai-wrong-btn" onclick="App.explainWrongTP(' + qi + ')">' +
            '<i class="fas fa-robot"></i> Send to AI Tutor</button>';
        card.appendChild(prompt);
      }
    }

    var bank = state._tpFilteredBank || [];
    if (bank.length > 0 && Object.keys(state._tpStates).length >= bank.length) {
      var correctCount = 0;
      for (var key in state._tpStates) {
        if (bank[key] && state._tpStates[key] === bank[key].correct) correctCount++;
      }
      var pct = Math.round((correctCount / bank.length) * 100);
      var tabLabel = (state._tpTab || 'sat').toUpperCase();
      if (!state.completedActivities) state.completedActivities = [];
      state.completedActivities.push({
        type: 'test-prep',
        course: tabLabel + ' Prep',
        unit: '',
        topic: state._tpCardTitle || '',
        difficulty: state._tpDifficulty || 'mixed',
        score: pct,
        correct: correctCount,
        total: bank.length,
        date: new Date().toISOString()
      });
      saveState();
      renderSidebarActivity();

      // Show a visible score summary (parity with course practice).
      var area = document.getElementById('tp-questions-area');
      if (area && !document.getElementById('tp-results')) {
        var color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
        var msg = pct === 100 ? 'Perfect score! Outstanding!' : pct >= 70 ? 'Great job! Keep practicing!' : 'Keep studying. You\'ll get there!';
        var results = document.createElement('div');
        results.id = 'tp-results';
        results.className = 'practice-results';
        results.setAttribute('role', 'status');
        results.setAttribute('aria-live', 'polite');
        results.innerHTML =
          '<div class="results-score" style="color:' + color + '">' + pct + '%</div>' +
          '<div class="results-message">' + correctCount + '/' + bank.length + ' correct — ' + msg + '</div>' +
          '<div class="practice-actions">' +
            '<button class="btn btn-glass" onclick="App.openTestPrepTopic(\'' + (state._tpTab || 'sat') + '\',' + state._tpTopic + ')"><i class="fas fa-redo"></i> Try Again</button>' +
            '<button class="btn btn-primary" onclick="App.navigate(\'tutor\')"><i class="fas fa-robot"></i> Ask AI Tutor</button>' +
          '</div>';
        area.appendChild(results);
        enhanceA11y();
        results.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
      }
    }
  }

  function switchTestPrepTab(tab, btn) {
    document.querySelectorAll('.test-prep-tab').forEach(function(t) { t.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    renderTestPrepSection(tab);
  }

  function renderAllCourses() {
    const container = document.getElementById('all-courses');
    container.innerHTML = COURSES.map((c, i) => courseCardHTML(c, i)).join('');
  }

  function courseCardHTML(course, index) {
    const progress = getCourseProgress(course.id);
    let topicCount = 0, unitCount = course.units.length;
    course.units.forEach(u => topicCount += u.topics.length);
    const delay = (index || 0) * 0.08;
    return `
      <div class="course-card" style="--course-color:${course.color};animation-delay:${delay}s" onclick="App.navigate('course','${course.id}')">
        <div class="course-card-header">
          <div class="course-icon" style="background:${course.color}20">${course.icon}</div>
          <h3>${course.title}</h3>
        </div>
        <p>${course.description}</p>
        <div class="course-meta">
          <span><i class="fas fa-layer-group"></i> ${unitCount} units</span>
          <span><i class="fas fa-book"></i> ${topicCount} topics</span>
        </div>
        <div class="course-progress-bar">
          <div class="course-progress-fill" style="width:${progress}%;background:${course.color}"></div>
        </div>
      </div>
    `;
  }

  // ===================== COURSE DETAIL =====================

  function renderCourseDetail(courseId) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;
    state.currentCourseId = courseId;

    let topicCount = 0;
    course.units.forEach(u => topicCount += u.topics.length);
    const progress = getCourseProgress(courseId);

    document.getElementById('course-header').innerHTML = `
      <div class="course-detail-icon" style="background:${course.color}20;color:${course.color}">${course.icon}</div>
      <div class="course-detail-info">
        <h1 style="color:${course.color}">${course.title}</h1>
        <p>${course.description}</p>
        <div class="course-detail-stats">
          <span><i class="fas fa-layer-group"></i> ${course.units.length} units</span>
          <span><i class="fas fa-book"></i> ${topicCount} topics</span>
          <span><i class="fas fa-chart-pie"></i> ${progress}% complete</span>
        </div>
      </div>
    `;

    document.getElementById('course-units').innerHTML = course.units.map((unit, i) => {
      const completedCount = unit.topics.filter(t => state.completedTopics.includes(t.id)).length;
      return `
        <div class="unit-card" id="unit-${unit.id}">
          <div class="unit-header" onclick="App.toggleUnit('${unit.id}')">
            <div class="unit-number" style="background:${course.color}">${i + 1}</div>
            <h3>${unit.title}</h3>
            <span class="unit-topic-count">${completedCount}/${unit.topics.length}</span>
            <i class="fas fa-chevron-down unit-chevron"></i>
          </div>
          <div class="unit-topics">
            ${unit.topics.map(topic => {
              const done = state.completedTopics.includes(topic.id);
              return `
                <div class="topic-item" onclick="App.navigate('topic',{courseId:'${courseId}',topicId:'${topic.id}'})">
                  <div class="topic-status ${done ? 'completed' : ''}">
                    ${done ? '<i class="fas fa-check"></i>' : ''}
                  </div>
                  <span class="topic-item-title">${topic.title}</span>
                  <i class="fas fa-chevron-right topic-item-arrow"></i>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    renderMath(document.getElementById('course-view'));
  }

  function toggleUnit(unitId) {
    const card = document.getElementById('unit-' + unitId);
    if (card) card.classList.toggle('expanded');
  }

  // ===================== TOPIC VIEW =====================

  function getVocabularyHTML(topic) {
    const vocab = topic.vocabulary;
    if (vocab && Array.isArray(vocab) && vocab.length > 0) {
      return `
        <div class="lesson-vocabulary">
          <h3>Key Vocabulary</h3>
          <dl class="vocab-list">
            ${vocab.map(v => `<dt>${v.term}</dt><dd>${v.definition}</dd>`).join('')}
          </dl>
        </div>
      `;
    }
    const strongTerms = topic.explanation && topic.explanation.match(/<strong>([^<]+)<\/strong>/g);
    if (strongTerms) {
      const terms = strongTerms.map(s => s.replace(/<\/?strong>/g, ''));
      const seen = new Set();
      const unique = terms.filter(t => { const k = t.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
      if (unique.length > 0) {
        return `
          <div class="lesson-vocabulary">
            <h3>Key Terms</h3>
            <ul class="vocab-terms">
              ${unique.map(t => `<li><strong>${t}</strong> — defined in the overview above.</li>`).join('')}
            </ul>
          </div>
        `;
      }
    }
    return '';
  }

  function shuffleOptions(p) {
    var opts = (p.options || []).slice();
    var correctVal = opts[p.correct];
    var indices = opts.map(function(_, i) { return i; });
    for (var i = indices.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = indices[i]; indices[i] = indices[j]; indices[j] = tmp;
    }
    var shuffled = indices.map(function(idx) { return opts[idx]; });
    return { ...p, options: shuffled, correct: shuffled.indexOf(correctVal) };
  }

  function getPracticeBank(topic) {
    const base = topic.problems || [];
    if (base.length === 0) return [];
    const difficulties = ['easy', 'medium', 'hard'];
    const target = 105;
    const bank = [];
    let idx = 0;
    while (bank.length < target) {
      base.forEach((p, i) => {
        bank.push({ ...p, _originalIndex: i, difficulty: difficulties[idx % 3] });
        idx++;
      });
    }
    for (let i = bank.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bank[i], bank[j]] = [bank[j], bank[i]];
    }
    return bank.slice(0, target).map(shuffleOptions);
  }

  function renderTopicView(courseId, topicId) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    let topic = null, unitTitle = '';
    let allTopics = [];
    course.units.forEach(u => {
      u.topics.forEach(t => {
        allTopics.push({ topic: t, unitTitle: u.title });
        if (t.id === topicId) { topic = t; unitTitle = u.title; }
      });
    });
    if (!topic) return;

    const isResume = state._isResuming &&
      state.currentTopic &&
      state.currentTopic.courseId === courseId &&
      state.currentTopic.topicId === topicId;
    state._isResuming = false;

    state.currentTopic = { courseId, topicId };
    if (!isResume) {
      state.problemStates = {};
      state.practiceBank = getPracticeBank(topic);
      state.practiceDifficulty = null;
    }
    state.currentCourseTitle = course.title;
    state.currentUnitTitle = unitTitle;
    state.currentTopicTitle = topic.title;

    document.getElementById('topic-back-btn').onclick = () => navigate('course', courseId);

    document.getElementById('topic-header').innerHTML = `
      <div class="topic-breadcrumb">
        <span>${course.title}</span> <i class="fas fa-chevron-right"></i> ${unitTitle}
      </div>
      <h1>${topic.title}</h1>
    `;

    document.getElementById('lesson-explanation').innerHTML = `
      <h2><i class="fas fa-book-open" style="color:${course.color}"></i> Lesson</h2>
      <div class="lesson-overview">
        <h3>Overview</h3>
        ${topic.explanation}
      </div>
      ${getVocabularyHTML(topic)}
    `;

    document.getElementById('lesson-formulas').innerHTML = `
      <h3><i class="fas fa-square-root-variable" style="color:${course.color}"></i> Key Formulas to Memorize</h3>
      ${(topic.keyFormulas || []).map(f => `<div class="formula-item">\\[${f}\\]</div>`).join('')}
    `;

    document.getElementById('lesson-videos').innerHTML = (topic.videos || []).map(v => {
      const videoId = v.videoId || (v.url && v.url.includes('v=') ? v.url.split('v=')[1].split('&')[0] : null);
      const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : (v.url || '#');
      const thumbUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
        : `https://via.placeholder.com/320x180/1a1a2e/7c3aed?text=${encodeURIComponent(v.channel || 'Video')}`;
      const summary = v.summary || `Covers ${v.title} in the context of ${topic.title}. Recommended for ${course.title} students building or reviewing this topic.`;
      return `
        <a href="${watchUrl}" target="_blank" rel="noopener" class="video-card">
          <div class="video-thumbnail">
            <img src="${thumbUrl}" alt="${v.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/320x180/1a1a2e/7c3aed?text=Video'">
            <div class="video-play-overlay">
              <div class="video-play-btn"><i class="fas fa-play"></i></div>
            </div>
          </div>
          <div class="video-info">
            <h4>${v.title}</h4>
            <div class="video-channel"><i class="fab fa-youtube" style="color:#ef4444"></i> ${v.channel || 'YouTube'}</div>
            <p class="video-summary">${summary}</p>
          </div>
        </a>
      `;
    }).join('');

    renderProblems(topic, state.practiceBank);
    setupTopicNav(allTopics, topicId, courseId);

    const completed = state.completedTopics.includes(topicId);
    const btn = document.getElementById('complete-topic-btn');
    if (completed) {
      btn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
      btn.style.opacity = '0.6';
      btn.disabled = true;
      btn.style.pointerEvents = 'none';
    } else {
      const topicScore = state.progress[topicId]?.score;
      const canComplete = topicScore !== undefined && topicScore >= 80;
      if (canComplete) {
        btn.innerHTML = '<i class="fas fa-check"></i> Mark Complete';
        btn.style.opacity = '1';
        btn.disabled = false;
        btn.style.pointerEvents = '';
      } else {
        btn.innerHTML = '<i class="fas fa-lock"></i> Score 80%+ to Complete';
        btn.style.opacity = '0.5';
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
      }
    }

    document.getElementById('ai-topic-explanation').innerHTML = '';
    document.getElementById('generate-explanation-btn').style.display = '';

    const suggestChips = document.getElementById('ai-suggest-chips');
    if (suggestChips) {
      const suggestions = [
        { label: `Explain "${topic.title}" simply`, prompt: `Explain "${topic.title}" from ${course.title} — ${unitTitle} in a simple, student-friendly way.` },
        { label: `Common mistakes in ${unitTitle}`, prompt: `What are the most common mistakes students make in ${unitTitle} (${course.title})?` },
        { label: `Real-world uses`, prompt: `Give real-world examples of how "${topic.title}" from ${course.title} is used outside of class.` },
        { label: `Study tips for this unit`, prompt: `What are the best study strategies for mastering ${unitTitle} in ${course.title}?` },
        { label: `Step-by-step example`, prompt: `Walk me through a detailed step-by-step example problem for "${topic.title}" in ${course.title}.` }
      ];
      suggestChips.innerHTML = suggestions.map(s =>
        `<button type="button" class="ai-suggest-chip" onclick="App.askFollowUp('${s.prompt.replace(/'/g, "\\'")}')">${s.label}</button>`
      ).join('');
    }

    switchTab('lesson');
    renderMath(document.getElementById('topic-view'));
  }

  function renderProblems(topic, bank) {
    const difficulty = state.practiceDifficulty;
    const courseTitle = state.currentCourseTitle || '';
    const unitTitle = state.currentUnitTitle || '';
    const topicTitle = state.currentTopicTitle || topic.title || '';

    if (!difficulty) {
      const tabPractice = document.getElementById('tab-practice');
      if (tabPractice) tabPractice.classList.add('practice-initial');
      document.getElementById('practice-header').innerHTML = `
        <h3>Practice Problems</h3>
        <p>Choose a difficulty level to start, or generate a mixed quiz.</p>
      `;
      document.getElementById('practice-difficulty').innerHTML = `
        <div class="difficulty-options">
          <button type="button" class="difficulty-btn difficulty-easy" onclick="App.setPracticeDifficulty('easy')">
            <i class="fas fa-leaf"></i> Easy
          </button>
          <button type="button" class="difficulty-btn difficulty-medium" onclick="App.setPracticeDifficulty('medium')">
            <i class="fas fa-balance-scale"></i> Medium
          </button>
          <button type="button" class="difficulty-btn difficulty-hard" onclick="App.setPracticeDifficulty('hard')">
            <i class="fas fa-fire"></i> Hard
          </button>
        </div>
        <div class="generate-quiz-divider"><span>or</span></div>
        <button type="button" class="btn btn-accent generate-quiz-btn" onclick="App.generateQuiz()">
          <i class="fas fa-shuffle"></i> Generate Quiz
          <span class="generate-quiz-sub">15 random questions &bull; all difficulties</span>
        </button>
      `;
      document.getElementById('practice-difficulty').classList.remove('hidden');
      document.getElementById('practice-problems').innerHTML = '';
      document.getElementById('practice-results').classList.add('hidden');
      return;
    }

    const tabPractice = document.getElementById('tab-practice');
    if (tabPractice) tabPractice.classList.remove('practice-initial');

    const isQuiz = difficulty === 'quiz';
    const filtered = isQuiz ? (state.practiceFilteredBank || []) : (bank || []).filter(p => p.difficulty === difficulty);
    const total = filtered.length;
    document.getElementById('practice-difficulty').classList.add('hidden');
    document.getElementById('practice-difficulty').innerHTML = '';

    if (isQuiz) {
      document.getElementById('practice-header').innerHTML = `
        <div class="practice-header-row">
          <h3><i class="fas fa-shuffle" style="color:var(--accent);margin-right:8px;"></i>Generated Quiz</h3>
          <button type="button" class="btn btn-ghost btn-sm practice-switch-difficulty" onclick="App.switchDifficulty()">
            <i class="fas fa-exchange-alt"></i> Back to difficulty
          </button>
        </div>
        <p>15 questions — mixed Easy, Medium & Hard. Good luck!</p>
      `;
    } else {
      document.getElementById('practice-header').innerHTML = `
        <div class="practice-header-row">
          <h3>Practice Problems — ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h3>
          <button type="button" class="btn btn-ghost btn-sm practice-switch-difficulty" onclick="App.switchDifficulty()">
            <i class="fas fa-exchange-alt"></i> Switch difficulty
          </button>
        </div>
        <p>${total} questions. Answer as many as you like; see your score when you've answered all.</p>
      `;
    }

    state._hintLevels = {};
    document.getElementById('practice-problems').innerHTML = filtered.map((p, i) => {
      const answered = state.problemStates[i] !== undefined;
      const chosen = state.problemStates[i];
      const diffTag = isQuiz && p.difficulty ? (() => {
        const dl = p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1);
        const dc = p.difficulty === 'easy' ? '#10b981' : p.difficulty === 'hard' ? '#ef4444' : '#f59e0b';
        return `<span class="quiz-diff-tag" style="background:${dc}20;color:${dc}">${dl}</span>`;
      })() : '';
      return `
        <div class="problem-card" id="problem-${i}" data-global-index="${state.practiceBank.indexOf(p)}">
          <div class="problem-meta">${i + 1}-${courseTitle}-${unitTitle}-${topicTitle} ${diffTag}</div>
          <div class="problem-question">${p.question}</div>
          <div class="problem-options">
            ${p.options.map((opt, j) => {
              let cls = 'option-btn';
              if (answered) {
                cls += ' disabled';
                if (j === p.correct) cls += ' correct';
                if (j === chosen && j !== p.correct) cls += ' incorrect';
              }
              return `<button class="${cls}" data-problem="${i}" data-option="${j}" onclick="App.selectOption(${i}, ${j})"${answered ? ' disabled' : ''}>
                <span class="option-letter">${String.fromCharCode(65 + j)}</span>
                <span>${opt}</span>
              </button>`;
            }).join('')}
          </div>
          ${(!answered && p.solution) ? `<div class="hint-zone" id="hint-zone-${i}">
            <button type="button" class="hint-btn" onclick="App.showHint(${i})"><i class="fas fa-lightbulb"></i> Stuck? Get a hint</button>
            <div class="hint-steps" id="hint-steps-${i}"></div>
          </div>` : ''}
          <div class="problem-solution${answered ? ' visible' : ''}" id="solution-${i}">
            <strong>Solution:</strong> ${p.solution}
          </div>
          ${answered && chosen !== p.correct ? '<div class="ai-wrong-prompt"><p>Don\'t understand what you did wrong?</p><button class="btn btn-glass btn-sm ai-wrong-btn" onclick="App.explainWrong(' + i + ')"><i class="fas fa-robot"></i> Send to AI Tutor</button></div>' : ''}
        </div>
      `;
    }).join('');

    document.getElementById('practice-results').classList.add('hidden');
    state.practiceFilteredBank = filtered;
  }

  function setPracticeDifficulty(level) {
    state.practiceDifficulty = level;
    const topic = findCurrentTopic();
    if (topic) renderProblems(topic, state.practiceBank);
    renderMath(document.getElementById('tab-practice'));
  }

  function switchDifficulty() {
    state.practiceDifficulty = null;
    const topic = findCurrentTopic();
    if (topic) renderProblems(topic, state.practiceBank);
    renderMath(document.getElementById('tab-practice'));
  }

  function generateQuiz() {
    const topic = findCurrentTopic();
    if (!topic) return;
    const bank = state.practiceBank || getPracticeBank(topic);
    const easy = bank.filter(p => p.difficulty === 'easy');
    const medium = bank.filter(p => p.difficulty === 'medium');
    const hard = bank.filter(p => p.difficulty === 'hard');
    const pool = [];
    [easy, medium, hard].forEach(arr => {
      const shuffled = arr.slice().sort(() => Math.random() - 0.5);
      pool.push(...shuffled.slice(0, 5));
    });
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    state.practiceFilteredBank = pool.slice(0, 15);
    state.practiceDifficulty = 'quiz';
    state.problemStates = {};
    renderProblems(topic, state.practiceBank);
    renderMath(document.getElementById('tab-practice'));
  }

  function generateTestPrepQuiz() {
    var tab = state._tpTab;
    var idx = state._tpTopic;
    var data = TEST_PREP_DATA[tab] || TEST_PREP_DATA.sat;
    var card = data[idx];
    if (!card) return;

    var allProblems = (card.problems || []).map(shuffleOptions);
    var easy = allProblems.filter(function(p) { return p.difficulty === 'easy'; });
    var medium = allProblems.filter(function(p) { return p.difficulty === 'medium'; });
    var hard = allProblems.filter(function(p) { return p.difficulty === 'hard'; });
    var pool = [];
    [easy, medium, hard].forEach(function(arr) {
      var shuffled = arr.slice().sort(function() { return Math.random() - 0.5; });
      pool = pool.concat(shuffled.slice(0, 5));
    });
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
    }
    var quiz = pool.slice(0, 15);

    state._tpDifficulty = 'quiz';
    state._tpStates = {};
    state._tpFilteredBank = quiz;
    state._tpCardTitle = card.title || '';

    var area = document.getElementById('tp-questions-area');
    var diffSelect = document.querySelector('.tp-difficulty-select');
    if (diffSelect) diffSelect.style.display = 'none';

    area.innerHTML =
      '<div class="practice-header-row">' +
        '<h3><i class="fas fa-shuffle" style="color:var(--accent);margin-right:8px;"></i>Generated Quiz</h3>' +
        '<button type="button" class="btn btn-ghost btn-sm practice-switch-difficulty" onclick="App.openTestPrepTopic(\'' + tab + '\',' + idx + ')">' +
          '<i class="fas fa-exchange-alt"></i> Back to difficulty</button>' +
      '</div>' +
      '<p style="color:var(--text-secondary);margin-bottom:16px;">15 questions — mixed Easy, Medium & Hard. Good luck!</p>' +
      quiz.map(function(p, qi) {
        var diffLabel = p.difficulty ? p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1) : '';
        var diffColor = p.difficulty === 'easy' ? '#10b981' : p.difficulty === 'hard' ? '#ef4444' : '#f59e0b';
        return '<div class="problem-card" id="tp-prob-' + qi + '">' +
          '<div class="problem-meta">' + (qi + 1) + ' — ' + card.title +
            ' <span class="quiz-diff-tag" style="background:' + diffColor + '20;color:' + diffColor + '">' + diffLabel + '</span>' +
          '</div>' +
          '<div class="problem-question">' + p.question + '</div>' +
          '<div class="problem-options">' +
            (p.options || []).map(function(opt, oi) {
              return '<button class="option-btn" onclick="App.selectTestPrepAnswer(' + qi + ',' + oi + ',' + p.correct + ')">' +
                '<span class="option-letter">' + String.fromCharCode(65 + oi) + '</span><span>' + opt + '</span></button>';
            }).join('') +
          '</div>' +
        '</div>';
      }).join('');

    renderMath(area);
  }

  function selectOption(problemIdx, optionIdx) {
    if (state.problemStates[problemIdx] !== undefined) return;

    const topic = findCurrentTopic();
    if (!topic) return;
    const bank = state.practiceFilteredBank || state.practiceBank || topic.problems || [];
    const problem = bank[problemIdx];
    if (!problem) return;
    state.problemStates[problemIdx] = optionIdx;

    const btns = document.querySelectorAll(`[data-problem="${problemIdx}"]`);
    btns.forEach((btn, j) => {
      btn.classList.add('disabled');
      if (j === problem.correct) btn.classList.add('correct');
      if (j === optionIdx && j !== problem.correct) btn.classList.add('incorrect');
    });

    const solEl = document.getElementById(`solution-${problemIdx}`);
    if (solEl) solEl.classList.add('visible');

    const hintZone = document.getElementById(`hint-zone-${problemIdx}`);
    if (hintZone) hintZone.style.display = 'none';

    if (optionIdx === problem.correct) {
      addXP(10);
      showToast('Correct! +10 XP', 'success');
    } else {
      showToast('Not quite. Review the solution below.', 'error');
      recordMistake(problem, optionIdx, topic.title || '');
      const card = document.getElementById(`problem-${problemIdx}`);
      if (card && !card.querySelector('.ai-wrong-prompt')) {
        const prompt = document.createElement('div');
        prompt.className = 'ai-wrong-prompt';
        prompt.innerHTML = `<p>Don't understand what you did wrong?</p>
          <button class="btn btn-glass btn-sm ai-wrong-btn" onclick="App.explainWrong(${problemIdx})">
            <i class="fas fa-robot"></i> Send to AI Tutor
          </button>`;
        card.appendChild(prompt);
      }
    }

    renderMath(document.getElementById(`problem-${problemIdx}`));
    checkAllAnswered(topic);
  }

  function checkAllAnswered(topic) {
    const bank = state.practiceFilteredBank || state.practiceBank || topic.problems || [];
    if (Object.keys(state.problemStates).length >= bank.length) {
      const correct = Object.entries(state.problemStates).filter(([i, o]) => bank[i] && o === bank[i].correct).length;
      const pct = bank.length ? Math.round((correct / bank.length) * 100) : 0;
      const resultsEl = document.getElementById('practice-results');
      resultsEl.classList.remove('hidden');

      let msg = pct === 100 ? 'Perfect score! Outstanding!' : pct >= 70 ? 'Great job! Keep practicing!' : 'Keep studying. You\'ll get there!';
      let color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';

      resultsEl.innerHTML = `
        <div class="results-score" style="color:${color}">${pct}%</div>
        <div class="results-message">${correct}/${bank.length} correct — ${msg}</div>
        <div class="practice-actions">
          <button class="btn btn-glass" onclick="App.retryProblems()"><i class="fas fa-redo"></i> Try Again</button>
          <button class="btn btn-primary" onclick="App.navigate('tutor')"><i class="fas fa-robot"></i> Ask AI Tutor</button>
        </div>
      `;

      if (state.currentTopic) {
        const prevBest = state.progress[state.currentTopic.topicId]?.score || 0;
        if (pct > prevBest) {
          state.progress[state.currentTopic.topicId] = { score: pct, date: new Date().toISOString() };
        }

        if (pct >= 80 && !state.completedTopics.includes(state.currentTopic.topicId)) {
          const btn = document.getElementById('complete-topic-btn');
          if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i> Mark Complete';
            btn.style.opacity = '1';
            btn.disabled = false;
            btn.style.pointerEvents = '';
          }
        }

        const activity = {
          type: 'course-practice',
          course: state.currentCourseTitle || '',
          unit: state.currentUnitTitle || '',
          topic: state.currentTopicTitle || '',
          difficulty: state.practiceDifficulty || 'mixed',
          score: pct,
          correct: correct,
          total: bank.length,
          date: new Date().toISOString()
        };
        if (!state.completedActivities) state.completedActivities = [];
        state.completedActivities.push(activity);
        saveState();
        renderSidebarActivity();
      }
    }
  }

  function splitSolutionIntoSteps(sol) {
    if (!sol) return [];
    let parts = sol.split('. ');
    if (parts.length > 1) {
      parts = parts.map(function(p, idx) { return idx < parts.length - 1 ? p + '.' : p; });
    } else {
      parts = sol.split(/,\s+/);
    }
    parts = parts.map(function(p) { return p.trim(); }).filter(Boolean);
    return parts.length ? parts : [sol];
  }

  function showHint(i) {
    const bank = state.practiceFilteredBank || state.practiceBank || [];
    const p = bank[i];
    if (!p || !p.solution) return;
    const steps = splitSolutionIntoSteps(p.solution);
    state._hintLevels = state._hintLevels || {};
    const level = state._hintLevels[i] || 0;
    if (level >= steps.length) return;

    const container = document.getElementById('hint-steps-' + i);
    if (container) {
      const stepEl = document.createElement('div');
      stepEl.className = 'hint-step';
      stepEl.innerHTML = '<span class="hint-step-num">Hint ' + (level + 1) + '</span> ' + steps[level];
      container.appendChild(stepEl);
      renderMath(stepEl);
    }
    state._hintLevels[i] = level + 1;

    const zone = document.getElementById('hint-zone-' + i);
    const btn = zone ? zone.querySelector('.hint-btn') : null;
    if (btn) {
      if (state._hintLevels[i] >= steps.length) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-check"></i> That\'s every hint';
      } else {
        btn.innerHTML = '<i class="fas fa-lightbulb"></i> Next hint (' + state._hintLevels[i] + ' of ' + steps.length + ')';
      }
    }
  }

  function buildExplainPrompt(problem, chosenIdx) {
    const questionText = (problem.question || '').replace(/<[^>]*>/g, '').replace(/\\\(/g, '').replace(/\\\)/g, '').trim();
    const options = (problem.options || []).map((o, i) => String.fromCharCode(65 + i) + ') ' + o.replace(/<[^>]*>/g, '').replace(/\\\(/g, '').replace(/\\\)/g, '')).join('  ');
    const correctLetter = String.fromCharCode(65 + (problem.correct || 0));
    const chosenLetter = String.fromCharCode(65 + (chosenIdx || 0));
    return `I got this question wrong and need help understanding it.\n\nQuestion: ${questionText}\nOptions: ${options}\nCorrect answer: ${correctLetter}\nI chose: ${chosenLetter}\n\nPlease explain step-by-step why the correct answer is right and where my thinking may have gone wrong.`;
  }

  function explainWrong(problemIdx) {
    const bank = state.practiceFilteredBank || state.practiceBank || [];
    const problem = bank[problemIdx];
    if (!problem) return;
    const prompt = buildExplainPrompt(problem, state.problemStates[problemIdx]);
    openAIPanel(prompt);
  }

  function explainWrongTP(qi) {
    const bank = state._tpFilteredBank || [];
    const problem = bank[qi];
    if (!problem) return;
    const prompt = buildExplainPrompt(problem, state._tpStates[qi]);
    openAIPanel(prompt);
  }

  function openAIPanel(prompt) {
    const panel = document.getElementById('ai-side-panel');
    const overlay = document.getElementById('ai-panel-overlay');
    const msgs = document.getElementById('ai-panel-messages');
    state._panelChatHistory = [];
    state._aiPanelReturnFocus = document.activeElement;
    msgs.innerHTML = '';
    panel.classList.add('open');
    overlay.classList.add('open');
    const panelInput = document.getElementById('ai-panel-input');
    if (panelInput) setTimeout(() => panelInput.focus(), 50);

    appendPanelMsg(prompt, 'user');
    state._panelChatHistory.push({ role: 'user', content: prompt });

    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-panel-typing';
    typingDiv.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    msgs.appendChild(typingDiv);
    msgs.scrollTop = msgs.scrollHeight;

    callOpenAI(prompt).then(function(reply) {
      typingDiv.remove();
      appendPanelMsg(reply, 'bot');
      state._panelChatHistory.push({ role: 'assistant', content: reply });
    });
  }

  function closeAIPanel() {
    document.getElementById('ai-side-panel').classList.remove('open');
    document.getElementById('ai-panel-overlay').classList.remove('open');
    const ret = state._aiPanelReturnFocus;
    if (ret && typeof ret.focus === 'function') {
      try { ret.focus(); } catch (e) {}
    }
  }

  function appendPanelMsg(text, sender) {
    const msgs = document.getElementById('ai-panel-messages');
    const div = document.createElement('div');
    div.className = 'ai-panel-msg ' + sender;
    if (sender === 'bot') {
      div.innerHTML = formatAIResponse(text);
    } else {
      div.textContent = text;
    }
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    if (sender === 'bot') renderMath(div);
  }

  async function sendPanelMessage() {
    const input = document.getElementById('ai-panel-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    appendPanelMsg(text, 'user');
    if (!state._panelChatHistory) state._panelChatHistory = [];
    state._panelChatHistory.push({ role: 'user', content: text });

    const msgs = document.getElementById('ai-panel-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-panel-typing';
    typingDiv.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
    msgs.appendChild(typingDiv);
    msgs.scrollTop = msgs.scrollHeight;

    const reply = await callOpenAI(text);
    typingDiv.remove();
    appendPanelMsg(reply, 'bot');
    state._panelChatHistory.push({ role: 'assistant', content: reply });
  }

  function retryProblems() {
    state.problemStates = {};
    const topic = findCurrentTopic();
    if (topic) {
      state.practiceBank = getPracticeBank(topic);
      renderProblems(topic, state.practiceBank);
    }
    renderMath(document.getElementById('tab-practice'));
  }

  function findCurrentTopic() {
    if (!state.currentTopic) return null;
    for (const course of COURSES) {
      for (const unit of course.units) {
        for (const topic of unit.topics) {
          if (topic.id === state.currentTopic.topicId) return topic;
        }
      }
    }
    return null;
  }

  function setupTopicNav(allTopics, currentId, courseId) {
    const idx = allTopics.findIndex(t => t.topic.id === currentId);
    const prevBtn = document.getElementById('prev-topic-btn');
    const nextBtn = document.getElementById('next-topic-btn');

    if (idx > 0) {
      prevBtn.style.visibility = 'visible';
      prevBtn.onclick = () => navigate('topic', { courseId, topicId: allTopics[idx - 1].topic.id });
    } else {
      prevBtn.style.visibility = 'hidden';
    }

    if (idx < allTopics.length - 1) {
      nextBtn.style.visibility = 'visible';
      nextBtn.onclick = () => navigate('topic', { courseId, topicId: allTopics[idx + 1].topic.id });
    } else {
      nextBtn.style.visibility = 'hidden';
    }
  }

  function switchTab(tabName) {
    const oldActive = document.querySelector('.tab-content.active');
    const newTab = document.getElementById('tab-' + tabName);
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`)?.classList.add('active');

    if (oldActive && oldActive !== newTab) {
      oldActive.style.animation = 'tabFadeOut 0.2s ease forwards';
      setTimeout(() => {
        document.querySelectorAll('.tab-content').forEach(c => {
          c.classList.remove('active');
          c.style.animation = '';
        });
        if (newTab) {
          newTab.classList.add('active');
          newTab.style.animation = 'tabFadeIn 0.35s ease forwards';
        }
        renderMath(newTab);
      }, 200);
    } else {
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      if (newTab) {
        newTab.classList.add('active');
        newTab.style.animation = 'tabFadeIn 0.35s ease forwards';
      }
      renderMath(newTab);
    }
  }

  // ===================== TOPIC COMPLETION =====================

  function completeTopic() {
    if (!state.currentTopic) return;
    const { topicId, courseId } = state.currentTopic;
    if (state.completedTopics.includes(topicId)) {
      showToast('Already completed!', 'info');
      return;
    }

    const topicProgress = state.progress[topicId];
    if (!topicProgress || topicProgress.score === undefined || topicProgress.score < 80) {
      const scoreStr = topicProgress && topicProgress.score !== undefined ? topicProgress.score + '%' : 'none';
      showToast(`You need at least 80% on a quiz to complete this topic. Current best: ${scoreStr}`, 'error');
      return;
    }

    state.completedTopics.push(topicId);
    addXP(25);

    const topic = findCurrentTopic();
    const topicTitle = topic?.title || topicId;
    logActivity('Completed: ' + topicTitle, 'check');

    const pct = topicProgress.score;

    if (!state.completedActivities) state.completedActivities = [];
    state.completedActivities.push({
      type: 'topic-complete',
      course: state.currentCourseTitle || '',
      unit: state.currentUnitTitle || '',
      topic: topicTitle,
      difficulty: state.practiceDifficulty || 'all',
      score: pct,
      correct: 0,
      total: 0,
      date: new Date().toISOString()
    });

    saveState();
    renderSidebarActivity();

    const btn = document.getElementById('complete-topic-btn');
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
    btn.style.opacity = '0.6';
    showToast('Topic completed! +25 XP', 'success');

    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
      const onclickAttr = card.getAttribute('onclick') || '';
      if (onclickAttr.includes(courseId)) {
        const progress = getCourseProgress(courseId);
        const progressFill = card.querySelector('.course-progress-fill');
        const progressText = card.querySelector('.course-progress-text');
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressText) progressText.textContent = progress + '%';
      }
    });
  }

  // ===================== AI TUTOR =====================

  async function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    appendChatMsg(text, 'user');
    input.value = '';
    input.style.height = 'auto';
    state.chatHistory.push({ role: 'user', content: text });

    const typingEl = appendTypingIndicator();

    let reply;
    if (state.apiKey) {
      reply = await callOpenAI(text);
    } else {
      reply = generateLocalResponse(text);
    }

    typingEl.remove();
    appendChatMsg(reply, 'bot');
    state.chatHistory.push({ role: 'assistant', content: reply });
  }

  function sendSuggestion(btn) {
    const text = btn.textContent || btn.innerText;
    document.getElementById('chat-input').value = text.trim();
    sendMessage();
  }

  // ----- Formula symbol palette (chat input) -----
  function toggleFormulaPalette() {
    const pal = document.getElementById('formula-palette');
    const btn = document.getElementById('formula-picker-btn');
    if (!pal) return;
    if (!pal.dataset.built) {
      const symbols = ['√','π','∫','∑','∞','θ','Δ','≤','≥','≠','×','÷','±','x^2','x_1','( )','→','°'];
      pal.innerHTML = symbols.map(function(s) {
        return '<button type="button" class="formula-sym" role="menuitem" onclick="App.insertSymbol(\'' + s.replace(/'/g, "\\'") + '\')">' + s + '</button>';
      }).join('');
      pal.dataset.built = '1';
    }
    pal.classList.toggle('hidden');
    if (btn) btn.setAttribute('aria-expanded', String(!pal.classList.contains('hidden')));
  }

  function insertSymbol(sym) {
    const input = document.getElementById('chat-input');
    if (!input) return;
    let insert = sym;
    if (sym === '( )') insert = '()';
    const start = input.selectionStart != null ? input.selectionStart : input.value.length;
    const end = input.selectionEnd != null ? input.selectionEnd : input.value.length;
    input.value = input.value.slice(0, start) + insert + input.value.slice(end);
    const caret = start + insert.length - (insert === '()' ? 1 : 0);
    input.focus();
    try { input.setSelectionRange(caret, caret); } catch (e) {}
  }

  // ----- Image upload → AI vision (snap a problem, get a worked solution) -----
  async function handleChatImage(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type || file.type.indexOf('image/') !== 0) { showToast('Please choose an image file.', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('Image is too large (max 5 MB).', 'error'); return; }

    let dataUrl;
    try {
      dataUrl = await new Promise(function(res, rej) {
        const reader = new FileReader();
        reader.onload = function() { res(reader.result); };
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
    } catch (err) { showToast('Could not read that image.', 'error'); return; }

    hideEmptyState();
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'chat-msg user-msg';
    div.innerHTML = '<div class="msg-avatar"><i class="fas fa-user"></i></div>' +
      '<div class="msg-bubble"><img src="' + dataUrl + '" alt="Uploaded math problem" class="chat-uploaded-img">' +
      '<div class="chat-img-caption">Solve and explain this problem</div></div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;

    state.chatHistory.push({ role: 'user', content: '[Uploaded a photo of a math problem] Please solve and explain it step by step.' });

    const typingEl = appendTypingIndicator();
    const messages = [
      { role: 'system', content: AI_SYSTEM_PROMPT },
      { role: 'user', content: [
        { type: 'text', text: 'Here is a photo of a math problem. Identify what is being asked, then solve it step by step, explaining each step clearly. Use LaTeX with \\( \\) and \\[ \\] where helpful.' },
        { type: 'image_url', image_url: { url: dataUrl } }
      ] }
    ];
    const reply = await aiChat(messages, { max_tokens: 1800 });
    typingEl.remove();
    appendChatMsg(reply, 'bot');
    state.chatHistory.push({ role: 'assistant', content: reply });
  }

  // ===================== NOTES ANALYZER =====================

  const NOTES_SYSTEM = 'You are Prime Prep\'s Notes Analyzer. You examine a teacher\'s lesson materials (slides, notes, or a worked example) and explain the EXACT methodology the teacher uses, so a student can solve problems the way their teacher expects. Be precise, structured, and faithful to the materials provided — never substitute a different method than the one shown.';

  function notesPrompt(context) {
    return 'Analyze the methodology and approach shown in these teacher\'s materials' +
      (context ? ' (context: ' + context + ')' : '') + '.\n\n' +
      'Help the student replicate THEIR TEACHER\'S specific method. Use these sections (make each heading bold):\n' +
      '**1. The Method** — name and describe, in order, the exact steps/approach the teacher uses.\n' +
      '**2. Notation & Format** — the symbols, layout, and "show your work" conventions the teacher expects.\n' +
      '**3. Worked Walkthrough** — apply the teacher\'s method step by step to a representative problem.\n' +
      '**4. Stay Consistent** — common ways students drift from this method and how to avoid them.\n\n' +
      'Use LaTeX with \\( \\) for inline and \\[ \\] for display math. Be specific to what is shown, not generic.';
  }

  function setNotesStatus(msg) {
    const el = document.getElementById('notes-status');
    if (!el) return;
    if (!msg) { el.classList.add('hidden'); el.innerHTML = ''; return; }
    el.classList.remove('hidden');
    el.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div><span>' + msg + '</span>';
  }

  function onNotesFileSelected(e) {
    const file = e.target.files && e.target.files[0];
    if (file) setNotesFile(file);
  }

  function setNotesFile(file) {
    if (!file) return;
    const okPdf = file.type === 'application/pdf';
    const okImg = file.type && file.type.indexOf('image/') === 0;
    if (!okPdf && !okImg) { showToast('Please upload a PDF or image.', 'error'); return; }
    if (file.size > 15 * 1024 * 1024) { showToast('File is too large (max 15 MB).', 'error'); return; }
    state._notesFile = file;
    const chip = document.getElementById('notes-file-chip');
    const nameEl = document.getElementById('notes-file-name');
    if (nameEl) nameEl.textContent = file.name;
    if (chip) chip.classList.remove('hidden');
    const btn = document.getElementById('notes-analyze-btn');
    if (btn) btn.disabled = false;
  }

  function clearNotesFile() {
    state._notesFile = null;
    const chip = document.getElementById('notes-file-chip');
    if (chip) chip.classList.add('hidden');
    const input = document.getElementById('notes-file-input');
    if (input) input.value = '';
    const btn = document.getElementById('notes-analyze-btn');
    if (btn) btn.disabled = true;
  }

  function readFileAsDataURL(file) {
    return new Promise(function(res, rej) {
      const reader = new FileReader();
      reader.onload = function() { res(reader.result); };
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  async function extractPdf(file) {
    const result = { text: '', images: [] };
    if (typeof pdfjsLib === 'undefined') return result;
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    const maxPages = Math.min(pdf.numPages, 15);
    const textParts = [];
    for (let p = 1; p <= maxPages; p++) {
      const page = await pdf.getPage(p);
      const tc = await page.getTextContent();
      const pageText = tc.items.map(function(it) { return it.str; }).join(' ').replace(/\s+/g, ' ').trim();
      if (pageText) textParts.push('[Page ' + p + '] ' + pageText);
    }
    result.text = textParts.join('\n\n');
    // Image-based slides (little/no extractable text) → rasterize for vision.
    if (result.text.replace(/\[Page \d+\]/g, '').trim().length < 60) {
      const imgPages = Math.min(pdf.numPages, 4);
      for (let p = 1; p <= imgPages; p++) {
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: 1.4 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        result.images.push(canvas.toDataURL('image/jpeg', 0.7));
      }
    }
    return result;
  }

  async function analyzeNotes() {
    const file = state._notesFile;
    if (!file) { showToast('Choose a PDF or image first.', 'error'); return; }
    const ctxEl = document.getElementById('notes-context');
    const context = ctxEl ? ctxEl.value.trim() : '';
    const resultEl = document.getElementById('notes-result');
    const btn = document.getElementById('notes-analyze-btn');
    if (btn) btn.disabled = true;
    if (resultEl) resultEl.classList.add('hidden');

    let content;
    try {
      if (file.type === 'application/pdf') {
        setNotesStatus('Reading your PDF…');
        const ex = await extractPdf(file);
        const cleanLen = ex.text.replace(/\[Page \d+\]/g, '').trim().length;
        if (ex.text && cleanLen >= 60) {
          content = [{ type: 'text', text: notesPrompt(context) + '\n\n--- TEACHER MATERIALS (extracted text) ---\n' + ex.text.slice(0, 14000) }];
        } else if (ex.images.length) {
          content = [{ type: 'text', text: notesPrompt(context) }].concat(ex.images.map(function(u) { return { type: 'image_url', image_url: { url: u } }; }));
        } else {
          setNotesStatus('');
          showToast('Could not read that PDF. Try an image, or a text-based PDF.', 'error');
          if (btn) btn.disabled = false;
          return;
        }
      } else {
        setNotesStatus('Reading your image…');
        const dataUrl = await readFileAsDataURL(file);
        content = [{ type: 'text', text: notesPrompt(context) }, { type: 'image_url', image_url: { url: dataUrl } }];
      }
    } catch (err) {
      setNotesStatus('');
      showToast('Something went wrong reading the file.', 'error');
      if (btn) btn.disabled = false;
      return;
    }

    setNotesStatus('Analyzing the methodology…');
    const messages = [{ role: 'system', content: NOTES_SYSTEM }, { role: 'user', content: content }];
    const reply = await aiChat(messages, { max_tokens: 2200, timeout: 60000 });
    setNotesStatus('');
    if (resultEl) {
      resultEl.innerHTML = '<div class="notes-result-header"><i class="fas fa-clipboard-check"></i><h2>How your teacher does it</h2></div>' +
        '<div class="notes-result-body">' + formatAIResponse(reply) + '</div>';
      resultEl.classList.remove('hidden');
      renderMath(resultEl);
      resultEl.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
    if (btn) btn.disabled = false;
    logActivity('Analyzed notes: ' + (file.name || 'upload'), 'magnifying-glass');
  }

  function clearChat() {
    state.chatHistory = [];
    const msgs = document.getElementById('chat-messages');
    msgs.innerHTML = `
      <div id="chat-empty-state" class="chat-empty-state">
        <div class="empty-state-icon"><i class="fas fa-brain"></i></div>
        <h2>What can I help you learn?</h2>
        <p>I can explain concepts, solve equations, help with homework, and more.</p>
        <div class="quick-start-grid">
          <button class="quick-start-card" onclick="App.sendSuggestion(this)"><i class="fas fa-function"></i><span>Explain Calculus</span></button>
          <button class="quick-start-card" onclick="App.sendSuggestion(this)"><i class="fas fa-square-root-alt"></i><span>Solve an Equation</span></button>
          <button class="quick-start-card" onclick="App.sendSuggestion(this)"><i class="fas fa-chart-line"></i><span>Practice SAT Math</span></button>
          <button class="quick-start-card" onclick="App.sendSuggestion(this)"><i class="fas fa-shapes"></i><span>Geometry Help</span></button>
        </div>
        <div class="empty-state-arrow"><span>Ask me anything about math!</span><i class="fas fa-arrow-down"></i></div>
      </div>
    `;
  }

  function hideEmptyState() {
    const es = document.getElementById('chat-empty-state');
    if (es) es.style.display = 'none';
    const guide = document.getElementById('tutor-floating-guide');
    if (guide) guide.style.display = 'none';
  }

  function showEmptyState() {
    const es = document.getElementById('chat-empty-state');
    if (es) es.style.display = '';
  }

  function appendChatMsg(text, sender) {
    hideEmptyState();
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `chat-msg ${sender === 'user' ? 'user-msg' : 'bot-msg'}`;
    const icon = sender === 'user' ? 'fa-user' : 'fa-robot';
    const formatted = sender === 'bot' ? formatAIResponse(text) : escapeHTML(text);

    if (sender === 'bot') {
      div.innerHTML = `
        <div class="msg-avatar"><i class="fas ${icon}"></i></div>
        <div class="msg-bubble"></div>
      `;
      container.appendChild(div);
      typewriterEffect(div.querySelector('.msg-bubble'), formatted, () => {
        renderMath(div);
      });
    } else {
      div.innerHTML = `
        <div class="msg-avatar"><i class="fas ${icon}"></i></div>
        <div class="msg-bubble">${formatted}</div>
      `;
      container.appendChild(div);
    }
    container.scrollTop = container.scrollHeight;
  }

  function typewriterEffect(el, html, callback) {
    el.innerHTML = html;
    const fullText = el.innerHTML;
    el.innerHTML = '';
    el.style.opacity = '1';
    let i = 0;
    const step = Math.max(1, Math.floor(fullText.length / 60));
    let inTag = false;
    function tick() {
      if (i >= fullText.length) {
        el.innerHTML = fullText;
        if (callback) callback();
        return;
      }
      let end = Math.min(i + step, fullText.length);
      while (end < fullText.length) {
        if (fullText[end] === '<') { inTag = true; }
        if (fullText[end] === '>') { inTag = false; end++; break; }
        if (!inTag) break;
        end++;
      }
      el.innerHTML = fullText.slice(0, end);
      i = end;
      const container = document.getElementById('chat-messages');
      if (container) container.scrollTop = container.scrollHeight;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function appendTypingIndicator() {
    hideEmptyState();
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'chat-msg bot-msg typing-msg';
    div.innerHTML = `
      <div class="msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="msg-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
          <span class="typing-label">Thinking...</span>
        </div>
      </div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div;
  }

  function formatAIResponse(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\n\n/g, '</p><p>');
    text = text.replace(/\n- /g, '<br>• ');
    text = text.replace(/\n(\d+)\. /g, '<br>$1. ');
    text = text.replace(/\n/g, '<br>');
    if (!text.startsWith('<p>')) text = '<p>' + text + '</p>';
    return text;
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  const OPENROUTER_DIRECT = 'https://openrouter.ai/api/v1/chat/completions';
  const AI_SYSTEM_PROMPT = 'You are Prime Prep AI Tutor, an expert math teacher. Explain concepts clearly with step-by-step solutions. Use LaTeX notation with \\( \\) for inline math and \\[ \\] for display math. Be encouraging and thorough.';

  // Local-testing AI key. Lets the AI features work on localhost (where the
  // Netlify serverless proxy isn't running) WITHOUT ever committing a key to
  // source. Set it from the browser console: App.setLocalAIKey('sk-or-...').
  function getLocalAIKey() {
    try {
      const ls = localStorage.getItem('primeprep_dev_key');
      if (ls) return ls;
    } catch (e) {}
    if (typeof window !== 'undefined' && window.PRIMEPREP_DEV_KEY) return window.PRIMEPREP_DEV_KEY;
    return '';
  }
  function setLocalAIKey(key) {
    try {
      if (key && key.trim()) {
        localStorage.setItem('primeprep_dev_key', key.trim());
        showToast('Local AI key saved (this browser only).', 'success');
      } else {
        localStorage.removeItem('primeprep_dev_key');
        showToast('Local AI key removed.', 'info');
      }
    } catch (e) {}
  }

  // Core chat call used by every AI feature. Tries, in order:
  //   1) the secure Netlify serverless proxy (production — key stays server-side)
  //   2) a direct OpenRouter call using a browser-stored dev key (local testing)
  //   3) an offline canned response (so the UI never dead-ends)
  async function aiChat(messages, opts) {
    opts = opts || {};
    const body = {
      messages: messages,
      max_tokens: opts.max_tokens || 1500,
      temperature: opts.temperature != null ? opts.temperature : 0.7
    };

    // 1) Serverless proxy
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), opts.timeout || 45000);
      const res = await fetch('/.netlify/functions/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        if (data && data.choices && data.choices[0]) return data.choices[0].message.content;
      } else if (res.status === 429) {
        return 'Rate limit reached. Please wait a moment and try again.';
      }
      // Other statuses (404 on localhost, 401/500 misconfig) → fall through.
    } catch (e) { /* proxy unreachable (e.g., localhost) → fall through */ }

    // 2) Direct OpenRouter via local dev key
    const devKey = getLocalAIKey();
    if (devKey) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), opts.timeout || 45000);
        const res = await fetch(OPENROUTER_DIRECT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + devKey,
            'HTTP-Referer': window.location.href,
            'X-Title': 'Prime Prep'
          },
          body: JSON.stringify({ model: 'openai/gpt-4o-mini', ...body }),
          signal: controller.signal
        });
        clearTimeout(timeout);
        if (res.ok) {
          const data = await res.json();
          if (data && data.choices && data.choices[0]) return data.choices[0].message.content;
        }
        if (res.status === 401) return 'Your local AI key was rejected (401). Set a valid key: App.setLocalAIKey("sk-or-...").';
        if (res.status === 429) return 'Rate limit reached. Please wait a moment and try again.';
      } catch (e) { /* fall through to offline */ }
    }

    // 3) Offline fallback
    const lastUser = messages.slice().reverse().find(m => m.role === 'user');
    let lastText = '';
    if (lastUser) {
      lastText = typeof lastUser.content === 'string'
        ? lastUser.content
        : (Array.isArray(lastUser.content) ? (lastUser.content.find(p => p.type === 'text') || {}).text || '' : '');
    }
    const offline = generateLocalResponse(lastText);
    return offline + '\n\n_Offline mode: the live AI tutor isn\'t reachable here. On the published site it works automatically. For local testing, run_ `App.setLocalAIKey("your-openrouter-key")` _in the browser console._';
  }

  async function callOpenAI(prompt) {
    const messages = [
      { role: 'system', content: AI_SYSTEM_PROMPT },
      ...state.chatHistory.slice(-10),
      { role: 'user', content: prompt }
    ];
    return aiChat(messages);
  }

  function generateLocalResponse(text) {
    const q = text.toLowerCase();

    const responses = {
      'derivative': `The **derivative** measures the instantaneous rate of change of a function. For \\(f(x) = x^n\\), the derivative is \\(f'(x) = nx^{n-1}\\) (power rule).

Key differentiation rules:
- **Power Rule**: \\(\\frac{d}{dx}x^n = nx^{n-1}\\)
- **Product Rule**: \\((fg)' = f'g + fg'\\)
- **Quotient Rule**: \\(\\left(\\frac{f}{g}\\right)' = \\frac{f'g - fg'}{g^2}\\)
- **Chain Rule**: \\(\\frac{d}{dx}f(g(x)) = f'(g(x)) \\cdot g'(x)\\)

For example, to find the derivative of \\(f(x) = 3x^4 - 2x^2 + x\\):
\\[f'(x) = 12x^3 - 4x + 1\\]`,
      'integral': `**Integration** is the reverse of differentiation. It finds the area under a curve or the antiderivative of a function.

Key integration rules:
- **Power Rule**: \\(\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C\\) (for \\(n \\neq -1\\))
- **Fundamental Theorem**: \\(\\int_a^b f(x)\\,dx = F(b) - F(a)\\)

For example: \\(\\int 6x^2\\,dx = 2x^3 + C\\)

The definite integral \\(\\int_0^2 x^2\\,dx = [\\frac{x^3}{3}]_0^2 = \\frac{8}{3}\\)`,
      'quadratic': `The **quadratic formula** solves any equation \\(ax^2 + bx + c = 0\\):
\\[x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\]

The **discriminant** \\(\\Delta = b^2 - 4ac\\) tells you about the solutions:
- \\(\\Delta > 0\\): Two distinct real solutions
- \\(\\Delta = 0\\): One repeated real solution
- \\(\\Delta < 0\\): No real solutions (two complex solutions)

**Example**: Solve \\(2x^2 - 7x + 3 = 0\\)
\\[x = \\frac{7 \\pm \\sqrt{49 - 24}}{4} = \\frac{7 \\pm 5}{4}\\]
So \\(x = 3\\) or \\(x = \\frac{1}{2}\\)`,
      'pythagorean': `The **Pythagorean Theorem** states that in a right triangle:
\\[a^2 + b^2 = c^2\\]
where \\(c\\) is the hypotenuse (longest side) and \\(a, b\\) are the legs.

**Common Pythagorean Triples**: 3-4-5, 5-12-13, 8-15-17, 7-24-25

**Example**: If one leg is 6 and the other is 8:
\\[c = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\]`,
      'slope': `**Slope** measures the steepness of a line — the ratio of rise to run:
\\[m = \\frac{y_2 - y_1}{x_2 - x_1}\\]

**Forms of linear equations**:
- Slope-intercept: \\(y = mx + b\\) (m = slope, b = y-intercept)
- Point-slope: \\(y - y_1 = m(x - x_1)\\)
- Standard: \\(Ax + By = C\\)

Positive slope → line goes up. Negative → down. Zero → horizontal. Undefined → vertical.`,
      'solve': `Let me help you solve that! Here's a general approach:

**For linear equations** (e.g., \\(3x + 5 = 20\\)):
1. Isolate variable terms on one side
2. Simplify: \\(3x = 15\\)
3. Divide: \\(x = 5\\)

**For quadratic equations** (e.g., \\(x^2 - 5x + 6 = 0\\)):
1. Try factoring: \\((x-2)(x-3) = 0\\)
2. Set each factor to zero: \\(x = 2\\) or \\(x = 3\\)
3. Or use the quadratic formula if factoring doesn't work

Try typing your specific equation and I'll walk you through it step by step!`,
      'chain rule': `The **Chain Rule** differentiates composite functions:
\\[\\frac{d}{dx}f(g(x)) = f'(g(x)) \\cdot g'(x)\\]

Think: "derivative of the outside, times derivative of the inside."

**Examples**:
- \\(\\frac{d}{dx}(2x+1)^5 = 5(2x+1)^4 \\cdot 2 = 10(2x+1)^4\\)
- \\(\\frac{d}{dx}\\sin(x^2) = \\cos(x^2) \\cdot 2x = 2x\\cos(x^2)\\)
- \\(\\frac{d}{dx}e^{3x} = e^{3x} \\cdot 3 = 3e^{3x}\\)`,
      'limit': `A **limit** describes what value a function approaches:
\\[\\lim_{x \\to c} f(x) = L\\]

**How to evaluate limits**:
1. **Direct substitution** — try plugging in the value
2. If you get \\(\\frac{0}{0}\\), try **factoring** or **rationalizing**
3. **L'Hôpital's Rule**: If \\(\\frac{0}{0}\\) or \\(\\frac{\\infty}{\\infty}\\), take \\(\\frac{f'(x)}{g'(x)}\\)

**Key limits**:
- \\(\\lim_{x\\to 0}\\frac{\\sin x}{x} = 1\\)
- \\(\\lim_{x\\to \\infty}\\frac{1}{x} = 0\\)
- \\(\\lim_{x\\to 0}\\frac{e^x - 1}{x} = 1\\)`,
    };

    for (const [key, response] of Object.entries(responses)) {
      if (q.includes(key)) return response;
    }

    return `Great question! Here's what I can help with:

To get the best AI-powered responses, set your **OpenAI API key** in Settings. Without it, I can answer questions about these core topics:
- Derivatives and differentiation rules
- Integration and the Fundamental Theorem
- Quadratic formula and equations
- Pythagorean theorem
- Slope and linear equations
- Chain rule
- Limits

Try asking about any of these topics! For full AI capabilities with step-by-step solutions for any math problem, add your API key in the Settings page.`;
  }

  // ===================== AI TOPIC EXPLANATION =====================

  async function generateTopicExplanation() {
    const topic = findCurrentTopic();
    if (!topic) return;

    const container = document.getElementById('ai-topic-explanation');
    const btn = document.getElementById('generate-explanation-btn');
    btn.style.display = 'none';
    container.innerHTML = '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';

    let explanation;
    if (state.apiKey) {
      const prompt = `Explain the math topic "${topic.title}" in a clear, student-friendly way. Include:
1. What it is and why it matters
2. Key concepts with examples
3. Common mistakes to avoid
4. A worked example with step-by-step solution
Use LaTeX with \\( \\) for inline and \\[ \\] for display math.`;
      explanation = await callOpenAI(prompt);
    } else {
      explanation = `Here's an AI-enhanced explanation of **${topic.title}**:

${topic.explanation.replace(/<[^>]+>/g, '')}

**Key Takeaways:**
${topic.keyFormulas.map(f => `- \\(${f}\\)`).join('\n')}

**Pro Tip:** For a more detailed, personalized explanation powered by GPT, add your OpenAI API key in Settings!`;
    }

    container.innerHTML = formatAIResponse(explanation);
    renderMath(container);
  }

  async function askFollowUp(presetPrompt) {
    const input = document.getElementById('ai-followup-input');
    const text = presetPrompt || (input ? input.value.trim() : '');
    if (!text) return;
    if (input) input.value = '';

    const topic = findCurrentTopic();
    const container = document.getElementById('ai-topic-explanation');

    container.innerHTML += `<hr style="border-color:var(--border-color);margin:16px 0"><p><strong>Q: ${escapeHTML(text)}</strong></p>`;
    container.innerHTML += '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';

    let reply;
    if (state.apiKey) {
      reply = await callOpenAI(`In the context of ${topic?.title || 'math'}: ${text}`);
    } else {
      reply = `That's a great follow-up question about "${text}"! For detailed, personalized answers, connect your OpenAI API key in Settings. The built-in lesson content above covers the core concepts.`;
    }

    container.querySelector('.typing-indicator')?.remove();
    container.innerHTML += formatAIResponse(reply);
    renderMath(container);
  }

  // ===================== PROGRESS =====================

  function renderSuccessMetrics() {
    var totalTopics = 0;
    COURSES.forEach(function(c) { c.units.forEach(function(u) { totalTopics += u.topics.length; }); });
    var completed = state.completedTopics.length;
    var topicPct = totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0;

    var scores = Object.values(state.progress).filter(function(p) { return p.score !== undefined; }).map(function(p) { return p.score; });
    var avgScore = scores.length ? Math.round(scores.reduce(function(a, b) { return a + b; }, 0) / scores.length) : 0;

    var quizCount = (state.completedActivities || []).length;
    var bestStreak = state.streak || 0;
    var streakPct = Math.min(100, Math.round((bestStreak / 30) * 100));

    var el;
    el = document.getElementById('sm-val-topics');
    if (el) el.textContent = completed;
    el = document.getElementById('sm-sub-topics');
    if (el) el.textContent = completed + ' of ' + totalTopics + ' topics';
    el = document.getElementById('sm-ring-topics');
    if (el) el.setAttribute('stroke-dasharray', topicPct + ', 100');

    el = document.getElementById('sm-val-accuracy');
    if (el) el.textContent = avgScore + '%';
    el = document.getElementById('sm-ring-accuracy');
    if (el) el.setAttribute('stroke-dasharray', avgScore + ', 100');

    el = document.getElementById('sm-val-quizzes');
    if (el) el.textContent = quizCount;
    el = document.getElementById('sm-ring-quizzes');
    if (el) el.setAttribute('stroke-dasharray', Math.min(100, quizCount * 5) + ', 100');

    el = document.getElementById('sm-val-streak');
    if (el) el.textContent = bestStreak;
    el = document.getElementById('sm-ring-streak');
    if (el) el.setAttribute('stroke-dasharray', streakPct + ', 100');
  }

  function renderProgressView() {
    document.getElementById('prog-xp').textContent = state.xp.toLocaleString();
    document.getElementById('prog-streak').textContent = state.streak;
    document.getElementById('prog-completed').textContent = state.completedTopics.length;

    const scores = Object.values(state.progress).filter(p => p.score !== undefined).map(p => p.score);
    const avgAcc = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    document.getElementById('prog-accuracy').textContent = avgAcc + '%';

    const timeEl = document.getElementById('prog-time');
    if (timeEl) {
      const hrs = Math.max(1, Math.round(state.completedTopics.length * 0.4));
      timeEl.textContent = hrs + 'h';
    }

    updateGoals();
    renderSuccessMetrics();

    document.getElementById('course-progress-list').innerHTML = COURSES.map(course => {
      const progress = getCourseProgress(course.id);
      return `
        <div class="course-progress-item">
          <div class="progress-course-icon">${course.icon}</div>
          <div class="progress-course-info">
            <h4>${course.title}</h4>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" style="width:${progress}%;background:${course.color}"></div>
            </div>
          </div>
          <div class="progress-percentage" style="color:${course.color}">${progress}%</div>
        </div>
      `;
    }).join('');

    renderCompletedActivities();
    renderRecentActivity();
    renderAchievements();
  }

  function renderCompletedActivities() {
    var container = document.getElementById('completed-activities');
    if (!container) return;
    var activities = (state.completedActivities || []).slice().reverse();

    if (activities.length === 0) {
      container.innerHTML = '<div class="ca-empty glass-card"><i class="fas fa-clipboard-list"></i><p>No completed quizzes yet. Finish a practice set to see detailed results here.</p></div>';
      return;
    }

    container.innerHTML = activities.map(function(a, i) {
      var scoreColor = a.score >= 80 ? '#10b981' : a.score >= 60 ? '#f59e0b' : '#ef4444';
      var scoreLabel = a.score === 100 ? 'Perfect' : a.score >= 80 ? 'Great' : a.score >= 60 ? 'Good' : 'Needs Work';
      var diffIcon = a.difficulty === 'easy' ? 'fa-leaf' : a.difficulty === 'hard' ? 'fa-fire' : a.difficulty === 'quiz' ? 'fa-shuffle' : a.difficulty === 'all' ? 'fa-check-double' : 'fa-balance-scale';
      var diffColor = a.difficulty === 'easy' ? '#10b981' : a.difficulty === 'hard' ? '#ef4444' : a.difficulty === 'quiz' ? '#7c3aed' : a.difficulty === 'all' ? '#10b981' : '#f59e0b';
      var diffLabel = a.difficulty === 'quiz' ? 'Mixed Quiz' : a.difficulty === 'all' ? 'Completed' : a.difficulty ? a.difficulty.charAt(0).toUpperCase() + a.difficulty.slice(1) : 'Mixed';
      var typeIcon = a.type === 'topic-complete' ? 'fa-check-circle' : a.type === 'test-prep' ? 'fa-bullseye' : 'fa-book-open';
      var typeLabel = a.type === 'topic-complete' ? 'Topic Completed' : a.type === 'test-prep' ? 'Test Prep' : 'Course Practice';
      var timeStr = getTimeAgo(a.date);

      var unitLine = '';
      if (a.unit) unitLine = '<span class="ca-detail"><i class="fas fa-layer-group"></i> ' + a.unit + '</span>';

      return '<div class="ca-card glass-card">' +
        '<div class="ca-score-ring" style="--score-color:' + scoreColor + '">' +
          '<div class="ca-score-value" style="color:' + scoreColor + '">' + a.score + '%</div>' +
          '<div class="ca-score-label" style="color:' + scoreColor + '">' + scoreLabel + '</div>' +
        '</div>' +
        '<div class="ca-info">' +
          '<div class="ca-title">' + (a.topic || a.course) + '</div>' +
          '<div class="ca-details">' +
            '<span class="ca-detail"><i class="fas ' + typeIcon + '"></i> ' + typeLabel + '</span>' +
            '<span class="ca-detail"><i class="fas fa-graduation-cap"></i> ' + a.course + '</span>' +
            unitLine +
            '<span class="ca-detail"><i class="fas ' + diffIcon + '" style="color:' + diffColor + '"></i> ' + diffLabel + '</span>' +
            '<span class="ca-detail"><i class="fas fa-check-circle"></i> ' + a.correct + '/' + a.total + ' correct</span>' +
            '<span class="ca-detail"><i class="fas fa-clock"></i> ' + timeStr + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="ca-difficulty-badge" style="background:' + diffColor + '20;color:' + diffColor + '">' + diffLabel + '</div>' +
      '</div>';
    }).join('');
  }

  function renderRecentActivity() {
    const container = document.getElementById('recent-activity');
    if (state.activityLog.length === 0) {
      container.innerHTML = '<p style="padding:20px;color:var(--text-muted);text-align:center">No activity yet. Start learning to see your progress!</p>';
      return;
    }

    container.innerHTML = state.activityLog.slice(-10).reverse().map(a => {
      const timeAgo = getTimeAgo(a.date);
      return `
        <div class="activity-item">
          <div class="activity-icon" style="background:rgba(16,185,129,0.15);color:#10b981">
            <i class="fas fa-${a.icon || 'check'}"></i>
          </div>
          <div class="activity-info">
            <p>${a.text}</p>
            <span class="activity-time">${timeAgo}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderAchievements() {
    const achievements = [
      { id: 'first-topic', title: 'First Steps', desc: 'Complete your first topic', icon: '🎯', check: () => state.completedTopics.length >= 1 },
      { id: 'five-topics', title: 'Getting Started', desc: 'Complete 5 topics', icon: '📚', check: () => state.completedTopics.length >= 5 },
      { id: 'ten-topics', title: 'Dedicated Learner', desc: 'Complete 10 topics', icon: '🏆', check: () => state.completedTopics.length >= 10 },
      { id: 'twenty-five', title: 'Math Enthusiast', desc: 'Complete 25 topics', icon: '🔥', check: () => state.completedTopics.length >= 25 },
      { id: 'streak-3', title: 'On a Roll', desc: '3-day streak', icon: '⚡', check: () => state.streak >= 3 },
      { id: 'streak-7', title: 'Week Warrior', desc: '7-day streak', icon: '💪', check: () => state.streak >= 7 },
      { id: 'xp-100', title: 'Point Collector', desc: 'Earn 100 XP', icon: '💎', check: () => state.xp >= 100 },
      { id: 'xp-500', title: 'XP Master', desc: 'Earn 500 XP', icon: '👑', check: () => state.xp >= 500 },
      { id: 'perfect', title: 'Perfectionist', desc: 'Score 100% on a quiz', icon: '🌟', check: () => Object.values(state.progress).some(p => p.score === 100) },
      { id: 'course-done', title: 'Course Complete', desc: 'Finish an entire course', icon: '🎓', check: () => COURSES.some(c => getCourseProgress(c.id) === 100) },
    ];

    const container = document.getElementById('achievements-grid');
    container.innerHTML = achievements.map(a => {
      const unlocked = a.check();
      return `
        <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon">${a.icon}</div>
          <h4>${a.title}</h4>
          <p>${a.desc}</p>
        </div>
      `;
    }).join('');
  }

  // ===================== FORMULA SHEETS =====================

  function renderFormulaSheets() {
    const container = document.getElementById('formula-sheets');
    container.innerHTML = COURSES.map(course => `
      <div class="formula-course-section" data-course="${course.id}">
        <div class="formula-course-header" onclick="this.parentElement.classList.toggle('expanded')">
          <span style="font-size:24px">${course.icon}</span>
          <h3>${course.title}</h3>
          <i class="fas fa-chevron-down unit-chevron"></i>
        </div>
        <div class="formula-course-content" style="display:none">
          ${course.units.map(unit =>
            unit.topics.map(topic => `
              <div class="formula-topic-section" data-search="${topic.title.toLowerCase()} ${unit.title.toLowerCase()} ${course.title.toLowerCase()}">
                <h4>${topic.title}</h4>
                ${topic.keyFormulas.map(f => `<div class="formula-display">\\[${f}\\]</div>`).join('')}
              </div>
            `).join('')
          ).join('')}
        </div>
      </div>
    `).join('');

    document.querySelectorAll('.formula-course-header').forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const isOpen = content.style.display !== 'none';
        content.style.display = isOpen ? 'none' : 'block';
        header.parentElement.classList.toggle('expanded');
        if (!isOpen) renderMath(content);
      });
    });
  }

  function filterFormulas(query) {
    const q = query.toLowerCase();
    document.querySelectorAll('.formula-topic-section').forEach(section => {
      const searchText = section.dataset.search || '';
      section.style.display = !q || searchText.includes(q) ? '' : 'none';
    });

    if (q) {
      document.querySelectorAll('.formula-course-section').forEach(section => {
        const hasVisible = section.querySelector('.formula-topic-section:not([style*="display: none"])');
        section.style.display = hasVisible ? '' : 'none';
        if (hasVisible) {
          section.querySelector('.formula-course-content').style.display = 'block';
          section.classList.add('expanded');
          renderMath(section);
        }
      });
    } else {
      document.querySelectorAll('.formula-course-section').forEach(s => {
        s.style.display = '';
        s.querySelector('.formula-course-content').style.display = 'none';
        s.classList.remove('expanded');
      });
    }
  }

  // ===================== SETTINGS =====================

  function saveApiKey() {
    const input = document.getElementById('api-key-input');
    if (!input) return;
    const key = input.value.trim();
    state.apiKey = key;
    saveState();
    const status = document.getElementById('api-key-status');
    if (key) {
      if (status) { status.textContent = '✓ API key saved!'; status.style.color = '#10b981'; }
      showToast('API key saved successfully!', 'success');
    } else {
      if (status) { status.textContent = 'API key removed.'; status.style.color = ''; }
    }
  }

  const THEMES = ['dark', 'midnight', 'ocean'];
  const THEME_ICONS = { dark: 'fa-moon', midnight: 'fa-star', ocean: 'fa-water' };

  function setTheme(theme) {
    state.theme = theme;
    document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.theme-btn[data-theme="${theme}"]`)?.classList.add('active');
    if (theme === 'dark') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', theme);
    }
    const cycleBtn = document.getElementById('theme-cycle-btn');
    if (cycleBtn) {
      cycleBtn.innerHTML = `<i class="fas ${THEME_ICONS[theme] || 'fa-palette'}"></i>`;
      cycleBtn.title = 'Theme: ' + theme.charAt(0).toUpperCase() + theme.slice(1);
    }
    saveState();
  }

  function cycleTheme() {
    const idx = THEMES.indexOf(state.theme);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next);
    showToast(`Theme: ${next.charAt(0).toUpperCase() + next.slice(1)}`, 'info');
  }

  // ===================== GUIDED TOUR + SHORTCUTS =====================
  const TOUR_STEPS = [
    { selector: null, title: 'Welcome to Prime Prep!', text: 'Here\'s a 30-second tour of the essentials. You can skip anytime.' },
    { selector: '.nav-link[data-view="tutor"]', title: 'AI Tutor', text: 'Ask any math question — or tap the image icon to snap a photo of a problem and get a full step-by-step solution.' },
    { selector: '.nav-link[data-view="notes"]', title: 'Notes Analyzer', text: 'Upload your teacher\'s slides or notes and Prime Prep breaks down their exact method, so your work matches what they expect.' },
    { selector: '.nav-link[data-view="formulas"]', title: 'Resources & Flashcards', text: 'Formula sheets, downloadable worksheets, SAT/ACT tests, a video library, and flashcards all live here.' },
    { selector: '#calc-fab', title: 'Graphing Calculator', text: 'A full Desmos graphing calculator is one click away on every page.' },
    { selector: '#a11y-btn', title: 'Built for everyone', text: 'Adjust text size, turn on high-contrast, or switch to a dyslexia-friendly font here.' },
    { selector: null, title: 'You\'re all set!', text: 'Press ? anytime to see keyboard shortcuts. Happy studying!' }
  ];
  let tourIndex = 0;

  function maybeStartTour() {
    if (localStorage.getItem('primeprep_tour_done') === '1') return;
    setTimeout(startTour, 900);
  }

  function startTour() {
    tourIndex = 0;
    const ov = document.getElementById('tour-overlay');
    if (!ov) return;
    ov.classList.remove('hidden');
    ov.setAttribute('aria-hidden', 'false');
    showTourStep();
  }

  function showTourStep() {
    const step = TOUR_STEPS[tourIndex];
    const hl = document.getElementById('tour-highlight');
    const tip = document.getElementById('tour-tooltip');
    if (!step || !hl || !tip) return;
    document.getElementById('tour-step-count').textContent = 'Step ' + (tourIndex + 1) + ' of ' + TOUR_STEPS.length;
    document.getElementById('tour-title').textContent = step.title;
    document.getElementById('tour-text').textContent = step.text;
    document.getElementById('tour-back').style.visibility = tourIndex === 0 ? 'hidden' : 'visible';
    document.getElementById('tour-next').textContent = tourIndex === TOUR_STEPS.length - 1 ? 'Done' : 'Next';

    const target = step.selector ? document.querySelector(step.selector) : null;
    const rect = target ? target.getBoundingClientRect() : null;
    if (rect && rect.width && rect.height) {
      const pad = 8;
      hl.style.display = 'block';
      hl.style.top = (rect.top - pad) + 'px';
      hl.style.left = (rect.left - pad) + 'px';
      hl.style.width = (rect.width + pad * 2) + 'px';
      hl.style.height = (rect.height + pad * 2) + 'px';
      tip.style.transform = 'none';
      const tipW = 320;
      const tipH = tip.offsetHeight || 170;
      let top = rect.bottom + 14;
      let left = rect.left;
      if (top + tipH > window.innerHeight - 12) top = Math.max(12, rect.top - tipH - 14);
      if (left + tipW > window.innerWidth - 12) left = window.innerWidth - tipW - 12;
      if (left < 12) left = 12;
      tip.style.top = top + 'px';
      tip.style.left = left + 'px';
    } else {
      hl.style.display = 'none';
      tip.style.top = '50%';
      tip.style.left = '50%';
      tip.style.transform = 'translate(-50%, -50%)';
    }
  }

  function tourNext() {
    if (tourIndex >= TOUR_STEPS.length - 1) { endTour(); return; }
    tourIndex++;
    showTourStep();
  }
  function tourPrev() {
    if (tourIndex > 0) { tourIndex--; showTourStep(); }
  }
  function endTour() {
    const ov = document.getElementById('tour-overlay');
    if (ov) { ov.classList.add('hidden'); ov.setAttribute('aria-hidden', 'true'); }
    localStorage.setItem('primeprep_tour_done', '1');
  }

  function openShortcuts() {
    const m = document.getElementById('shortcuts-modal');
    if (m) m.classList.remove('hidden');
  }
  function closeShortcuts() {
    const m = document.getElementById('shortcuts-modal');
    if (m) m.classList.add('hidden');
  }

  // ----- Accessibility preferences -----
  const TEXT_SCALES = [0.9, 1.0, 1.15, 1.3];

  function applyA11yPrefs() {
    const a = state.a11y || {};
    document.documentElement.style.setProperty('--font-scale', a.scale || 1);
    document.body.classList.toggle('hc', !!a.highContrast);
    document.body.classList.toggle('dyslexia', !!a.dyslexia);
    const hc = document.getElementById('a11y-hc');
    if (hc) hc.checked = !!a.highContrast;
    const dys = document.getElementById('a11y-dys');
    if (dys) dys.checked = !!a.dyslexia;
  }

  function toggleA11yMenu() {
    const menu = document.getElementById('a11y-menu');
    const btn = document.getElementById('a11y-btn');
    if (!menu) return;
    menu.classList.toggle('hidden');
    if (btn) btn.setAttribute('aria-expanded', String(!menu.classList.contains('hidden')));
  }

  function setTextSize(delta) {
    state.a11y = state.a11y || { scale: 1 };
    let cur = state.a11y.scale || 1;
    if (delta === 0) {
      cur = 1;
    } else {
      let idx = TEXT_SCALES.indexOf(cur);
      if (idx < 0) idx = 1;
      idx = Math.max(0, Math.min(TEXT_SCALES.length - 1, idx + delta));
      cur = TEXT_SCALES[idx];
    }
    state.a11y.scale = cur;
    applyA11yPrefs();
    saveState();
  }

  function toggleHighContrast(on) {
    state.a11y = state.a11y || {};
    state.a11y.highContrast = !!on;
    applyA11yPrefs();
    saveState();
  }

  function toggleDyslexiaFont(on) {
    state.a11y = state.a11y || {};
    state.a11y.dyslexia = !!on;
    applyA11yPrefs();
    saveState();
  }

  function exportProgress() {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'primeprep-progress.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Progress exported!', 'success');
  }

  function resetProgress() {
    if (!confirm('Are you sure? This will erase all your progress, XP, and streak data.')) return;
    localStorage.removeItem('mathverse_state');
    state = {
      currentView: 'home',
      currentCourse: null,
      currentTopic: null,
      currentCourseId: null,
      progress: {},
      xp: 0,
      streak: 0,
      lastVisit: null,
      completedTopics: [],
      activityLog: [],
      apiKey: state.apiKey,
      chatHistory: [],
      theme: state.theme,
      problemStates: {},
      sessions: [],
      weekOffset: 0,
      tutorBookings: [],
      downloadsCourseId: null,
      completedActivities: []
    };
    updateXPDisplay();
    showToast('All progress has been reset.', 'info');
    navigate('home');
  }

  // ===================== UTILITIES =====================

  function addXP(amount) {
    state.xp += amount;
    updateXPDisplay();
    saveState();
  }

  function updateXPDisplay() {
    document.getElementById('sidebar-xp').textContent = state.xp + ' XP';
    document.getElementById('sidebar-streak').textContent = state.streak + ' day streak';
    document.getElementById('topbar-xp').textContent = state.xp;
    document.getElementById('topbar-streak').textContent = state.streak;
  }

  function renderSidebarActivity() {
    const list = document.getElementById('sidebar-activity-list');
    if (!list) return;
    const activities = (state.completedActivities || []).slice().reverse().slice(0, 8);
    if (activities.length === 0) {
      list.innerHTML = '<div class="sidebar-activity-empty">No activity yet</div>';
      return;
    }
    list.innerHTML = activities.map(function(a) {
      const timeStr = getTimeAgo(a.date);
      const scoreColor = a.score >= 80 ? '#10b981' : a.score >= 60 ? '#f59e0b' : '#ef4444';
      const scoreHTML = a.total > 0 ? `<span class="sa-score" style="background:${scoreColor}20;color:${scoreColor}">${a.score}%</span>` : '';
      const unitStr = a.unit ? a.unit : '';
      return `<div class="sidebar-activity-item">
        <div class="sa-subject">${a.course || 'Practice'}</div>
        ${unitStr ? `<div class="sa-unit">${unitStr}${a.topic ? ' — ' + a.topic : ''}</div>` : (a.topic ? `<div class="sa-unit">${a.topic}</div>` : '')}
        <div class="sa-meta">
          <span class="sa-time"><i class="fas fa-clock"></i> ${timeStr}</span>
          ${scoreHTML}
        </div>
      </div>`;
    }).join('');
  }

  function logActivity(text, icon) {
    state.activityLog.push({ text, icon: icon || 'check', date: new Date().toISOString() });
    saveState();
  }

  function showToast(message, type) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type || 'info'}`;
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
  }

  function getTimeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + 'm ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    const days = Math.floor(hrs / 24);
    return days + 'd ago';
  }

  function renderMath(container) {
    if (!container || typeof renderMathInElement === 'undefined') return;
    try {
      renderMathInElement(container, {
        delimiters: [
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false,
        trust: true
      });
    } catch (e) { console.warn('KaTeX render error:', e); }
  }

  // ===================== BACKGROUND CANVAS =====================

  function renderBgCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let w, h, particles;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    const colors = [
      [168, 85, 247],
      [99, 102, 241],
      [59, 130, 246],
      [244, 114, 182],
      [34, 211, 238]
    ];

    function createParticles() {
      particles = [];
      const count = Math.min(80, Math.floor(w * h / 12000));
      for (let i = 0; i < count; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2.5 + 0.5,
          alpha: Math.random() * 0.35 + 0.08,
          color
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.alpha})`;
        ctx.fill();
      });

      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            const alpha = 0.08 * (1 - dist / 160);
            ctx.strokeStyle = `rgba(${a.color[0]}, ${a.color[1]}, ${a.color[2]}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    if (prefersReducedMotion()) {
      // Draw a single static frame instead of an animated loop so that
      // motion-sensitive users don't experience continuous movement.
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.alpha})`;
        ctx.fill();
      });
    } else {
      draw();
    }
    window.addEventListener('resize', () => {
      resize();
      createParticles();
      if (prefersReducedMotion()) {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.alpha})`;
          ctx.fill();
        });
      }
    });
  }

  // ===================== SCHEDULE =====================

  function renderSchedule() {
    const allSessions = state.sessions || [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (state.weekOffset * 7));
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const label = document.getElementById('schedule-week-label');
    if (label) {
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      label.textContent = `${startOfWeek.toLocaleDateString('en-US',{month:'short',day:'numeric'})} — ${endOfWeek.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}`;
    }

    const grid = document.getElementById('schedule-grid');
    if (!grid) return;
    grid.innerHTML = days.map((day, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const isToday = date.toDateString() === today.toDateString();
      const daySessions = allSessions.filter(s => s.date === dateStr).sort((a,b) => a.time.localeCompare(b.time));
      return `
        <div class="schedule-day-card">
          <div class="schedule-day-header ${isToday ? 'today' : ''}">${day}<br><small>${date.toLocaleDateString('en-US',{month:'short',day:'numeric'})}</small></div>
          ${daySessions.length ? daySessions.map(s => `
            <div class="schedule-session">
              <div class="session-time">${formatTime(s.time)}</div>
              <div class="session-name">${s.title}</div>
              <span class="session-badge badge-${s.type}">${s.type}</span>
            </div>
          `).join('') : '<div class="schedule-empty">No sessions</div>'}
        </div>
      `;
    }).join('');

    const upcoming = allSessions
      .filter(s => new Date(s.date + 'T' + s.time) >= today)
      .sort((a,b) => (a.date+a.time).localeCompare(b.date+b.time))
      .slice(0, 5);

    const sessionsList = document.getElementById('study-sessions');
    if (sessionsList) {
      sessionsList.innerHTML = upcoming.length ? upcoming.map(s => {
        const colors = { tutoring:'var(--accent-purple)', group:'var(--accent-green)', review:'var(--accent-orange)' };
        const icons = { tutoring:'fa-chalkboard-user', group:'fa-users', review:'fa-clipboard-check' };
        return `
          <div class="study-session-card">
            <div class="session-icon" style="background:${colors[s.type]}20;color:${colors[s.type]}">
              <i class="fas ${icons[s.type]}"></i>
            </div>
            <div class="session-details">
              <h4>${s.title}</h4>
              <p><i class="fas fa-calendar"></i> ${new Date(s.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})} at ${formatTime(s.time)} &bull; ${s.subject}</p>
              ${s.desc ? `<p>${s.desc}</p>` : ''}
            </div>
            <button class="btn btn-primary btn-sm session-join-btn"><i class="fas fa-video"></i> Join</button>
          </div>
        `;
      }).join('') : '<p style="color:var(--text-muted);padding:20px;text-align:center">No upcoming sessions. Create one!</p>';
    }
  }

  function formatTime(t) {
    const [h,m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`;
  }

  function prevWeek() { state.weekOffset--; renderSchedule(); }
  function nextWeek() { state.weekOffset++; renderSchedule(); }

  function openSessionModal() {
    const modal = document.getElementById('session-modal');
    const dateInput = document.getElementById('session-date');
    if (dateInput) {
      const today = new Date();
      dateInput.min = today.toISOString().split('T')[0];
    }
    modal.classList.remove('hidden');
  }
  function closeSessionModal() { document.getElementById('session-modal').classList.add('hidden'); }

  function populateSessionSubjects() {
    const sel = document.getElementById('session-subject');
    if (!sel) return;
    while (sel.options.length > 1) sel.remove(1);
    if (sel.options.length > 1) return;
    COURSES.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.title;
      opt.textContent = c.title;
      sel.appendChild(opt);
    });
  }

  function createSession() {
    const title = document.getElementById('session-title').value.trim();
    const subject = document.getElementById('session-subject').value;
    const date = document.getElementById('session-date').value;
    const time = document.getElementById('session-time').value;
    const type = document.getElementById('session-type').value;
    const desc = document.getElementById('session-desc').value.trim();

    if (!title || !subject || !date || !time) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    state.sessions.push({ title, subject, date, time, type, desc });
    saveState();
    closeSessionModal();
    renderSchedule();
    logActivity(`Created session: ${title}`, 'calendar');
    showToast('Study session created!', 'success');
  }

  const TUTORS = [
    {
      id: 'vikranth',
      name: 'Vikranth Rajagopalan',
      initials: 'VR',
      subjects: ['Algebra 1', 'Algebra 2', 'Geometry', 'Precalculus', 'Statistics & Probability'],
      subjectLabel: 'Algebra 1 & 2, Geometry, Precalculus, Statistics',
      qualifications: 'Algebra & Geometry TA; 2+ years tutoring; National Honor Society.',
      color: '#6366f1',
      email: 'vikranth.r@primeprep.edu'
    },
    {
      id: 'shraavan',
      name: 'Shraavan Siva',
      initials: 'SS',
      subjects: ['AP Calculus AB', 'AP Calculus BC', 'Multivariable Calculus'],
      subjectLabel: 'Calculus AB, BC & Multivariable Calculus',
      qualifications: 'AP Calculus 5; Multivariable Calculus TA; Math Olympiad qualifier.',
      color: '#8b5cf6',
      email: 'shraavan.s@primeprep.edu'
    },
    {
      id: 'daniel',
      name: 'Daniel Paskowitz',
      initials: 'DP',
      subjects: ['Geometry', 'Precalculus', 'Trigonometry', 'Algebra 2'],
      subjectLabel: 'Geometry, Precalculus, Trigonometry, Algebra 2',
      qualifications: 'Geometry & Trig TA; 3 years peer tutoring; Mu Alpha Theta member.',
      color: '#10b981',
      email: 'daniel.p@primeprep.edu'
    },
    {
      id: 'akshay',
      name: 'Akshay Srinivasulu',
      initials: 'AS',
      subjects: ['Algebra 1', 'Algebra 2', 'Statistics & Probability', 'AP Calculus AB'],
      subjectLabel: 'Algebra 1 & 2, Statistics, AP Calculus AB',
      qualifications: 'AP Statistics 5; Calculus AB TA; Math Club president.',
      color: '#ec4899',
      email: 'akshay.s@primeprep.edu'
    }
  ];

  function renderPeerTutors() {
    const grid = document.getElementById('peer-tutor-grid');
    if (!grid) return;
    grid.innerHTML = TUTORS.map(t => `
      <div class="peer-tutor-card">
        <div class="peer-avatar" style="background:${t.color}">${t.initials}</div>
        <h4>${t.name}</h4>
        <div class="peer-subject">${t.subjectLabel}</div>
        <div class="peer-qualifications">${t.qualifications}</div>
        <div class="peer-card-actions">
          <a href="mailto:${t.email}" class="btn btn-glass btn-sm"><i class="fas fa-envelope"></i> Contact</a>
          <button type="button" class="btn btn-primary btn-sm" onclick="App.openTutorBookingModal('${t.id}')"><i class="fas fa-calendar-plus"></i> Schedule</button>
        </div>
      </div>
    `).join('');
  }

  function openTutorBookingModal(preselectedTutorId) {
    const modal = document.getElementById('tutor-booking-modal');
    const tutorSel = document.getElementById('booking-tutor');
    const subjectSel = document.getElementById('booking-subject');
    const dateInput = document.getElementById('booking-date');
    if (!modal || !tutorSel || !subjectSel) return;

    tutorSel.innerHTML = '<option value="">Select a tutor...</option>' + TUTORS.map(t => `
      <option value="${t.id}" ${preselectedTutorId === t.id ? 'selected' : ''}>${t.name} — ${t.subjectLabel}</option>
    `).join('');

    function updateSubjectOptions() {
      const tutorId = tutorSel.value;
      subjectSel.innerHTML = '<option value="">Select a subject...</option>';
      if (!tutorId) return;
      const tutor = TUTORS.find(t => t.id === tutorId);
      if (tutor) tutor.subjects.forEach(s => {
        subjectSel.innerHTML += `<option value="${s}">${s}</option>`;
      });
    }
    tutorSel.onchange = updateSubjectOptions;
    updateSubjectOptions();

    if (dateInput) {
      const today = new Date();
      dateInput.min = today.toISOString().split('T')[0];
    }
    modal.classList.remove('hidden');
  }

  function closeTutorBookingModal() {
    const modal = document.getElementById('tutor-booking-modal');
    if (modal) modal.classList.add('hidden');
  }

  function submitTutorBooking() {
    const tutorId = document.getElementById('booking-tutor').value;
    const subject = document.getElementById('booking-subject').value;
    const date = document.getElementById('booking-date').value;
    const time = document.getElementById('booking-time').value;
    if (!tutorId || !subject || !date || !time) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    const tutor = TUTORS.find(t => t.id === tutorId);
    if (!tutor) return;
    state.tutorBookings = state.tutorBookings || [];
    state.tutorBookings.push({
      id: Date.now().toString(),
      tutorId,
      tutorName: tutor.name,
      subject,
      date,
      time,
      status: 'pending'
    });
    saveState();
    closeTutorBookingModal();
    renderTutorBookings();
    showToast('Session requested! It will show as Pending approval until the tutor confirms.', 'success');
  }

  function renderTutorBookings() {
    const list = document.getElementById('tutor-bookings-list');
    if (!list) return;
    const bookings = state.tutorBookings || [];
    if (bookings.length === 0) {
      list.innerHTML = '<p class="tutor-bookings-empty">No session requests yet. Use Schedule on a tutor card to request one.</p>';
      return;
    }
    list.innerHTML = bookings.slice().reverse().map(b => {
      const statusClass = b.status === 'approved' ? 'approved' : 'pending';
      const statusLabel = b.status === 'approved' ? 'Approved' : 'Pending approval';
      const timeStr = b.time ? (() => { const [h,m] = b.time.split(':').map(Number); const am = h >= 12 ? 'PM' : 'AM'; return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${am}`; })() : '';
      return `
        <div class="tutor-booking-card ${statusClass}">
          <div class="tutor-booking-main">
            <strong>${b.tutorName}</strong> — ${b.subject}
            <span class="tutor-booking-meta">${new Date(b.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at ${timeStr}</span>
          </div>
          <span class="tutor-booking-status status-${statusClass}">${statusLabel}</span>
        </div>
      `;
    }).join('');
  }

  // ===================== RESOURCES =====================

  function switchResourceTab(tabName) {
    document.querySelectorAll('.resource-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.resource-content').forEach(c => c.classList.remove('active'));
    document.querySelector(`.resource-tab[data-rtab="${tabName}"]`)?.classList.add('active');
    document.getElementById('rtab-' + tabName)?.classList.add('active');
  }

  function stripLaTeXForText(s) {
    if (!s || typeof s !== 'string') return '';
    var t = s;
    t = t.replace(/\\\(/g, '').replace(/\\\)/g, '');
    t = t.replace(/\\\[/g, '').replace(/\\\]/g, '');
    t = t.replace(/\\begin\{[^}]*\}/g, '').replace(/\\end\{[^}]*\}/g, '');

    t = t.replace(/\\text\{([^}]*)}/g, '$1');
    t = t.replace(/\\mathrm\{([^}]*)}/g, '$1');
    t = t.replace(/\\mathbf\{([^}]*)}/g, '$1');
    t = t.replace(/\\mathit\{([^}]*)}/g, '$1');
    t = t.replace(/\\boldsymbol\{([^}]*)}/g, '$1');
    t = t.replace(/\\textbf\{([^}]*)}/g, '$1');
    t = t.replace(/\\vec\{([^}]*)}/g, '$1');
    t = t.replace(/\\overline\{([^}]*)}/g, '$1');
    t = t.replace(/\\bar\{([^}]*)}/g, '$1');
    t = t.replace(/\\hat\{([^}]*)}/g, '$1');
    t = t.replace(/\\tilde\{([^}]*)}/g, '$1');

    t = t.replace(/\\binom\{([^}]*)}\{([^}]*)}/g, 'C($1,$2)');

    for (var fi = 0; fi < 5; fi++) {
      t = t.replace(/\\frac\{([^{}]*)}\{([^{}]*)}/g, function(_, n, d) {
        n = n.trim(); d = d.trim();
        if (/[+\-\s]/.test(n) && n.length > 2) n = '(' + n + ')';
        if (/[+\-\s]/.test(d) && d.length > 2) d = '(' + d + ')';
        return n + '/' + d;
      });
    }

    t = t.replace(/\\sqrt\[([^\]]*)\]\{([^}]*)}/g, function(_, n, c) { return n + '-root(' + c + ')'; });
    t = t.replace(/\\sqrt\{([^}]*)}/g, function(_, c) { return 'sqrt(' + c + ')'; });
    t = t.replace(/\\sqrt([a-zA-Z0-9])/g, function(_, c) { return 'sqrt(' + c + ')'; });

    t = t.replace(/\\iiint/g, 'Int');
    t = t.replace(/\\iint/g, 'Int');
    t = t.replace(/\\oiint/g, 'Int');
    t = t.replace(/\\oint/g, 'Int');

    t = t.replace(/\\int_\{([^}]*)}\^\{([^}]*)}/g, function(_, lo, hi) {
      var l = lo.replace(/\\infty/g,'inf').replace(/\\pi/g,'pi').replace(/\\alpha/g,'a').replace(/\\beta/g,'b').replace(/\\theta/g,'th');
      var h = hi.replace(/\\infty/g,'inf').replace(/\\pi/g,'pi');
      return 'Int[' + l + ', ' + h + '] ';
    });
    t = t.replace(/\\int_\{([^}]*)}\^\\infty/g, function(_, lo) {
      return 'Int[' + lo + ', inf] ';
    });
    t = t.replace(/\\int_\{([^}]*)}\^\\([a-zA-Z]+)/g, function(_, lo, hi) {
      return 'Int[' + lo.replace(/\\infty/g,'inf') + ', ' + hi + '] ';
    });
    t = t.replace(/\\int_([^{\\])\^\\infty/g, function(_, lo) {
      return 'Int[' + lo + ', inf] ';
    });
    t = t.replace(/\\int_([^{\\])\^\{([^}]*)}/g, function(_, lo, hi) {
      return 'Int[' + lo + ', ' + hi.replace(/\\infty/g,'inf') + '] ';
    });
    t = t.replace(/\\int_\{([^}]*)}\^([^{\\])/g, function(_, lo, hi) {
      return 'Int[' + lo.replace(/\\infty/g,'inf') + ', ' + hi + '] ';
    });
    t = t.replace(/\\int_([^{\\])\^([^{\\])/g, function(_, lo, hi) {
      return 'Int[' + lo + ', ' + hi + '] ';
    });
    t = t.replace(/\\int/g, 'Int ');

    t = t.replace(/\\sum_\{([^}]*)}\^\{([^}]*)}/g, function(_, lo, hi) {
      return 'Sum(' + lo.replace(/\\infty/g,'inf') + ' to ' + hi.replace(/\\infty/g,'inf') + ') ';
    });
    t = t.replace(/\\sum_\{([^}]*)}\^\\infty/g, function(_, lo) {
      return 'Sum(' + lo + ' to inf) ';
    });
    t = t.replace(/\\sum_\{([^}]*)}\^([^{\\])/g, function(_, lo, hi) {
      return 'Sum(' + lo + ' to ' + hi + ') ';
    });
    t = t.replace(/\\sum/g, 'Sum ');

    t = t.replace(/\\lim_\{([^}]*)}/g, function(_, sub) {
      return 'lim(' + sub.replace(/\\to/g,'->').replace(/\\infty/g,'inf') + ') ';
    });
    t = t.replace(/\\lim/g, 'lim ');

    t = t.replace(/\\ln/g, 'ln');
    t = t.replace(/\\log/g, 'log');
    t = t.replace(/\\sin/g, 'sin');
    t = t.replace(/\\cos/g, 'cos');
    t = t.replace(/\\tan/g, 'tan');
    t = t.replace(/\\sec/g, 'sec');
    t = t.replace(/\\csc/g, 'csc');
    t = t.replace(/\\cot/g, 'cot');
    t = t.replace(/\\arcsin/g, 'arcsin');
    t = t.replace(/\\arccos/g, 'arccos');
    t = t.replace(/\\arctan/g, 'arctan');
    t = t.replace(/\\max/g, 'max');
    t = t.replace(/\\min/g, 'min');
    t = t.replace(/\\det/g, 'det');

    t = t.replace(/\\alpha/g, 'alpha');
    t = t.replace(/\\beta/g, 'beta');
    t = t.replace(/\\gamma/g, 'gamma');
    t = t.replace(/\\delta/g, 'delta');
    t = t.replace(/\\epsilon/g, 'epsilon');
    t = t.replace(/\\zeta/g, 'zeta');
    t = t.replace(/\\eta/g, 'eta');
    t = t.replace(/\\theta/g, 'theta');
    t = t.replace(/\\kappa/g, 'kappa');
    t = t.replace(/\\lambda/g, 'lambda');
    t = t.replace(/\\mu/g, 'mu');
    t = t.replace(/\\nu/g, 'nu');
    t = t.replace(/\\xi/g, 'xi');
    t = t.replace(/\\rho/g, 'rho');
    t = t.replace(/\\sigma/g, 'sigma');
    t = t.replace(/\\tau/g, 'tau');
    t = t.replace(/\\phi/g, 'phi');
    t = t.replace(/\\chi/g, 'chi');
    t = t.replace(/\\psi/g, 'psi');
    t = t.replace(/\\omega/g, 'omega');
    t = t.replace(/\\Gamma/g, 'Gamma');
    t = t.replace(/\\Delta/g, 'Delta');
    t = t.replace(/\\Theta/g, 'Theta');
    t = t.replace(/\\Lambda/g, 'Lambda');
    t = t.replace(/\\Sigma/g, 'Sigma');
    t = t.replace(/\\Phi/g, 'Phi');
    t = t.replace(/\\Psi/g, 'Psi');
    t = t.replace(/\\Omega/g, 'Omega');
    t = t.replace(/\\pi/g, 'pi');

    t = t.replace(/\\infty/g, 'inf');
    t = t.replace(/\\partial/g, 'd');
    t = t.replace(/\\nabla/g, 'grad');
    t = t.replace(/\\cdots/g, '...');
    t = t.replace(/\\ldots/g, '...');
    t = t.replace(/\\dots/g, '...');

    t = t.replace(/\\cdot/g, '\u00B7');
    t = t.replace(/\\times/g, '\u00D7');
    t = t.replace(/\\div/g, '\u00F7');
    t = t.replace(/\\pm/g, '\u00B1');
    t = t.replace(/\\mp/g, '-/+');

    t = t.replace(/\\leq/g, ' <= ');
    t = t.replace(/\\le\b/g, ' <= ');
    t = t.replace(/\\geq/g, ' >= ');
    t = t.replace(/\\ge\b/g, ' >= ');
    t = t.replace(/\\neq/g, ' != ');
    t = t.replace(/\\ne\b/g, ' != ');
    t = t.replace(/\\approx/g, ' ~ ');
    t = t.replace(/\\equiv/g, ' === ');
    t = t.replace(/\\sim/g, ' ~ ');

    t = t.replace(/\\Rightarrow/g, ' => ');
    t = t.replace(/\\Leftarrow/g, ' <= ');
    t = t.replace(/\\Leftrightarrow/g, ' <=> ');
    t = t.replace(/\\rightarrow/g, ' -> ');
    t = t.replace(/\\leftarrow/g, ' <- ');
    t = t.replace(/\\iff/g, ' <=> ');
    t = t.replace(/\\to/g, ' -> ');
    t = t.replace(/\\not\\to/g, ' does not -> ');
    t = t.replace(/\\perp/g, ' perp ');
    t = t.replace(/\\parallel/g, ' || ');
    t = t.replace(/\\cap/g, ' n ');
    t = t.replace(/\\cup/g, ' U ');
    t = t.replace(/\\in\b/g, ' in ');
    t = t.replace(/\\subset/g, ' subset ');
    t = t.replace(/\\forall/g, 'for all ');
    t = t.replace(/\\exists/g, 'there exists ');
    t = t.replace(/\\downarrow/g, '(decreasing)');

    t = t.replace(/\\langle/g, '<');
    t = t.replace(/\\rangle/g, '>');
    t = t.replace(/\\lfloor/g, 'floor(');
    t = t.replace(/\\rfloor/g, ')');
    t = t.replace(/\\lceil/g, 'ceil(');
    t = t.replace(/\\rceil/g, ')');
    t = t.replace(/\\left/g, '');
    t = t.replace(/\\right/g, '');

    t = t.replace(/\\,/g, ' ');
    t = t.replace(/\\;/g, ' ');
    t = t.replace(/\\!/g, '');
    t = t.replace(/\\quad/g, ' ');
    t = t.replace(/\\qquad/g, '  ');
    t = t.replace(/\\ /g, ' ');

    t = t.replace(/\^{([^}]*)}/g, function(_, inner) {
      if (inner === '1') return '\u00B9';
      if (inner === '2') return '\u00B2';
      if (inner === '3') return '\u00B3';
      if (inner.length === 1) return '^' + inner;
      return '^(' + inner + ')';
    });
    t = t.replace(/\^([a-zA-Z0-9])/g, function(_, c) {
      if (c === '1') return '\u00B9';
      if (c === '2') return '\u00B2';
      if (c === '3') return '\u00B3';
      return '^' + c;
    });

    t = t.replace(/_\{([^}]*)}/g, function(_, inner) {
      inner = inner.trim();
      if (inner.length <= 2) return '_' + inner;
      return '_(' + inner + ')';
    });

    t = t.replace(/\{/g, '').replace(/\}/g, '');
    t = t.replace(/\\\\/g, ' ');
    t = t.replace(/\\[a-zA-Z]+/g, '');
    t = t.replace(/\(\(([^()]*)\)\)/g, '($1)');
    t = t.replace(/\s{2,}/g, ' ');
    return t.trim();
  }

  function getUnitBonusFRQ(course, unit) {
    const ut = (unit.title || '').toLowerCase();
    const ct = (course.title || '').toLowerCase();
    const frqs = [
      { prompt: 'Show all work. Solve the equation 2(3x - 4) - 5(x + 2) = 4 - 3(2x + 1). State any properties of equality you use at each step.', solution: 'Distribute: 6x - 8 - 5x - 10 = 4 - 6x - 3. Combine like terms: x - 18 = 1 - 6x. Add 6x: 7x - 18 = 1. Add 18: 7x = 19. Divide by 7: x = 19/7. (Properties: distributive, combining like terms, addition property of equality, division property of equality.)' },
      { prompt: 'A rectangle has length (4x + 3) and width (2x - 1). (a) Write a simplified polynomial for the perimeter. (b) Write a simplified polynomial for the area. (c) Find the perimeter when x = 5.', solution: '(a) P = 2(4x+3) + 2(2x-1) = 8x+6+4x-2 = 12x+4. (b) A = (4x+3)(2x-1) = 8x² - 4x + 6x - 3 = 8x² + 2x - 3. (c) P(5) = 12(5)+4 = 64.' },
      { prompt: 'Solve the inequality |3x - 7| ≥ 5. Write your answer in interval notation and show the number-line reasoning.', solution: 'Case 1: 3x - 7 ≥ 5 → 3x ≥ 12 → x ≥ 4. Case 2: 3x - 7 ≤ -5 → 3x ≤ 2 → x ≤ 2/3. Solution: (-∞, 2/3] ∪ [4, ∞).' },
      { prompt: 'Graph the system y > 2x - 1 and y ≤ -x + 4. Shade the solution region and find the vertices of the feasible region (intersection points of boundaries).', solution: 'Boundary lines: y = 2x - 1 (dashed, shade above) and y = -x + 4 (solid, shade below). Vertices: Intersection 2x-1 = -x+4 → x = 5/3, y = 7/3; and intercepts (1/2, 0), (4, 0). Feasible region is the intersection of the two half-planes.' },
      { prompt: 'Factor completely: 3x³ - 12x² - 15x. Then solve the equation 3x³ - 12x² - 15x = 0.', solution: 'GCF: 3x(x² - 4x - 5). Factor quadratic: 3x(x - 5)(x + 1). Equation: 3x(x-5)(x+1) = 0 → x = 0, x = 5, or x = -1.' },
      { prompt: 'For the quadratic f(x) = -2x² + 8x - 5: (a) Find the vertex by completing the square or using the vertex formula. (b) Find the x-intercepts (exact form). (c) State the range of f.', solution: '(a) a=-2, b=8. Vertex x = -b/(2a) = 2; f(2) = -8+16-5 = 3. Vertex (2, 3). (b) -2x²+8x-5=0 → x = (-8 ± √(64-40))/(-4) = (8 ± √24)/4 = 2 ± (√6)/2. (c) Parabola opens down, max 3. Range: (-∞, 3].' },
      { prompt: 'Prove or explain: For all real a, b, (a + b)² - (a - b)² = 4ab. Then use this to compute 47² - 43² without a calculator.', solution: '(a+b)² - (a-b)² = (a²+2ab+b²) - (a²-2ab+b²) = 4ab. So 47² - 43² = 4(47)(43) with a = (47+43)/2 = 45, b = (47-43)/2 = 2 → 4(45)(2) = 360. (Or 4(47)(43) = 8084.)' },
      { prompt: 'A line passes through (1, 4) and (5, -2). (a) Find the slope. (b) Write the equation in point-slope form. (c) Write the equation in standard form Ax + By = C with integer coefficients.', solution: '(a) m = (-2-4)/(5-1) = -6/4 = -3/2. (b) y - 4 = (-3/2)(x - 1). (c) 2(y-4) = -3(x-1) → 2y-8 = -3x+3 → 3x+2y = 11.' },
      { prompt: 'Solve the system: 2x + 3y - z = 7, x - 2y + 2z = -1, 3x + y + z = 10. Show steps (substitution or elimination).', solution: 'Add eq1 and eq3: 5x + 4y = 17. From eq2: x = -1 + 2y - 2z. Substitute into eq1 and eq3 to eliminate x; or 2·eq2 + eq1 gives 4x - y + 3z = 5. Then 3·eq2 + eq3 gives 6x - 5y + 7z = 7. Solve the 2×2 in x,y then back-substitute: (x,y,z) = (3, 1/2, 1/2) or equivalent.' },
      { prompt: 'Let f(x) = 2x² - 4x + 1. (a) Rewrite in vertex form f(x) = a(x - h)² + k by completing the square. (b) State the vertex and axis of symmetry. (c) Find the y-intercept.', solution: '(a) 2(x² - 2x) + 1 = 2(x² - 2x + 1) - 2 + 1 = 2(x - 1)² - 1. (b) Vertex (1, -1), axis x = 1. (c) f(0) = 1.' }
    ];
    const idx = Math.abs((unit.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % frqs.length;
    return frqs[idx];
  }

  function getUnitReviewText(course, unit) {
    const titleLine = `${course.title.toUpperCase()} — UNIT REVIEW (Practice Questions)`;
    const line = '='.repeat(Math.max(titleLine.length, 50));
    const topics = (unit.topics || []).map((t, idx) => `${idx + 1}. ${t.title}`).join('\n');

    const choiceLabels = ['A', 'B', 'C', 'D', 'E'];
    const easy = buildPdfQuestionPool(unit, 10);
    const medium = buildPdfQuestionPool(unit, 10);
    const hard = buildPdfQuestionPool(unit, 10);

    function formatProblem(p, num) {
      const q = stripLaTeXForText(p.question);
      const opts = (p.options || []).map((o, i) => `  ${choiceLabels[i]}) ${stripLaTeXForText(o)}`).join('\n');
      const correctOpt = (p.options && p.options[p.correct] != null) ? stripLaTeXForText(p.options[p.correct]) : '';
      return `${num}. ${q}\n${opts}\n  Answer: ${correctOpt}\n\n`;
    }

    let questionsSection = '';
    if (easy.length + medium.length + hard.length > 0) {
      questionsSection = '\n' + line + '\nPRACTICE QUESTIONS (30 Total)\n' + line + '\n\n';
      if (easy.length > 0) {
        questionsSection += '--- EASY (10) ---\n\n';
        easy.forEach((p, i) => { questionsSection += formatProblem(p, i + 1); });
      }
      if (medium.length > 0) {
        questionsSection += '--- MEDIUM (10) ---\n\n';
        medium.forEach((p, i) => { questionsSection += formatProblem(p, i + 1); });
      }
      if (hard.length > 0) {
        questionsSection += '--- HARD (10) ---\n\n';
        hard.forEach((p, i) => { questionsSection += formatProblem(p, i + 1); });
      }
    }

    const bonus = getUnitBonusFRQ(course, unit);
    questionsSection += '--- HARD BONUS (Free Response) ---\n\n';
    questionsSection += `Hard Bonus: ${bonus.prompt}\n\n`;

    return `${titleLine}\n${line}\n\nCourse: ${course.title}\nUnit: ${unit.title}\n\nTopics in this unit:\n${topics || '- (none)'}\n\n${questionsSection}---\nUse this sheet to practice. Check your answers with the solutions provided.\nPrime Prep — https://primeprep.app`;
  }

  function renderDownloads() {
    const container = document.getElementById('downloads-grid');
    if (!container) return;

    const courses = COURSES || [];
    if (!courses.length) {
      container.innerHTML = '<p class="download-empty-note">No courses available yet. Check back soon for downloadable review sheets.</p>';
      return;
    }

    const hasSaved = state.downloadsCourseId && courses.some(c => c.id === state.downloadsCourseId);
    const selectedId = hasSaved ? state.downloadsCourseId : courses[0].id;
    state.downloadsCourseId = selectedId;

    const selectedCourse = courses.find(c => c.id === selectedId) || courses[0];
    const units = selectedCourse.units || [];

    const subjectTiles = courses.map(c => `
      <button
        type="button"
        class="download-subject-tile ${c.id === selectedId ? 'active' : ''}"
        onclick="App.selectDownloadSubject('${c.id}')"
      >
        <span class="download-subject-icon" style="background:${c.color}">${c.icon || '📘'}</span>
        <span class="download-subject-text">
          <span class="download-subject-title">${c.title}</span>
          <span class="download-subject-desc">${c.description || ''}</span>
        </span>
      </button>
    `).join('');

    const reviewCards = units.map((u, idx) => `
      <div class="download-card" onclick="App.downloadUnitReview('${selectedCourse.id}','${u.id}')">
        <div class="download-icon" style="background:${selectedCourse.color}"><i class="fas fa-file-pdf"></i></div>
        <div class="download-info">
          <h4>Unit ${idx + 1}: ${u.title} — Review</h4>
          <p>PDF worksheet — 30 questions (10 Easy, 10 Medium, 10 Hard) + Bonus FRQ.</p>
        </div>
        <i class="fas fa-download" style="color:var(--text-muted)"></i>
      </div>
    `).join('');

    const reviewsSection = reviewCards || '<p class="download-empty-note">No units available yet for this course.</p>';

    container.innerHTML = `
      <div class="download-subjects-row">
        ${subjectTiles}
      </div>
      <div class="download-reviews-header">
        <h3>${selectedCourse.title} unit reviews</h3>
        <p>Select a unit below to download a printable review.</p>
      </div>
      <div class="download-reviews-grid">
        ${reviewsSection}
      </div>
    `;
  }

  function selectDownloadSubject(courseId) {
    state.downloadsCourseId = courseId;
    renderDownloads();
    saveState();
  }

  function buildPdfQuestionPool(unit, count) {
    const allProblems = [];
    (unit.topics || []).forEach(t => {
      (t.problems || []).forEach(p => {
        allProblems.push({ ...p, topicTitle: t.title });
      });
    });
    if (allProblems.length === 0) return [];
    const pool = [];
    while (pool.length < count) {
      allProblems.forEach(p => { if (pool.length < count) pool.push({ ...p }); });
    }
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, count).map(shuffleOptions);
  }

  function svgToDataUrl(callback) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = 960; canvas.height = 320;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 960, 320);
      callback(canvas.toDataURL('image/png'));
    };
    img.onerror = function() { callback(null); };
    img.src = 'assets/prime-prep-logo.svg';
  }

  function downloadUnitReview(courseId, unitId) {
    const course = (COURSES || []).find(c => c.id === courseId);
    if (!course) { showToast('Course not found.', 'error'); return; }
    const unit = (course.units || []).find(u => u.id === unitId);
    if (!unit) { showToast('Unit not found.', 'error'); return; }

    svgToDataUrl(function(logoDataUrl) {
      _generatePdf(course, unit, logoDataUrl);
    });
  }

  function renderKTeX(str) {
    if (!str || typeof str !== 'string') return str || '';
    return str.replace(/\\\(([^]*?)\\\)/g, function(_, expr) {
      try { return katex.renderToString(expr.trim(), { throwOnError: false, displayMode: false }); }
      catch(e) { return expr; }
    }).replace(/\\\[([^]*?)\\\]/g, function(_, expr) {
      try { return katex.renderToString(expr.trim(), { throwOnError: false, displayMode: true }); }
      catch(e) { return expr; }
    });
  }

  function _generatePdf(course, unit, logoDataUrl) {
    var ep = buildPdfQuestionPool(unit, 10);
    var mp = buildPdfQuestionPool(unit, 10);
    var hp = buildPdfQuestionPool(unit, 10);
    var bonus = getUnitBonusFRQ(course, unit);
    var choiceL = ['A', 'B', 'C', 'D'];
    var topics = unit.topics || [];

    var sections = [
      { label: 'EASY', tag: 'Difficulty: Easy', color: '#065f46', accent: '#059669', bgLight: '#ecfdf5', borderLight: '#a7f3d0', icon: '&#x2714;', problems: ep },
      { label: 'MEDIUM', tag: 'Difficulty: Medium', color: '#92700a', accent: '#b8860b', bgLight: '#fefce8', borderLight: '#fde68a', icon: '&#x25B2;', problems: mp },
      { label: 'HARD', tag: 'Difficulty: Hard', color: '#991b1b', accent: '#dc2626', bgLight: '#fef2f2', borderLight: '#fca5a5', icon: '&#x2605;', problems: hp }
    ];

    var logoImg = logoDataUrl ? '<img src="' + logoDataUrl + '" style="height:32px;margin-right:12px;" />' : '';

    var headerHTML = '<div style="background-color:#064e3b;padding:14px 32px 10px;border-bottom:3px solid #c8982f;">' +
      '<table style="width:100%;border-collapse:collapse;"><tr>' +
      '<td style="vertical-align:middle;">' +
        (logoDataUrl ? '<img src="' + logoDataUrl + '" style="height:32px;margin-right:12px;vertical-align:middle;" />' : '') +
        '<span style="font-size:16px;font-weight:bold;color:#ffffff;letter-spacing:1.5px;vertical-align:middle;">PRIME PREP</span>' +
        '<br/><span style="font-size:8px;color:#fbbf24;font-style:italic;">students helping students</span>' +
      '</td>' +
      '<td style="text-align:right;vertical-align:middle;">' +
        '<div style="font-size:9px;color:#bbf7d0;">' + course.title + '</div>' +
        '<div style="font-size:9px;color:#bbf7d0;margin-top:1px;">' + unit.title + '</div>' +
      '</td>' +
      '</tr></table></div>';

    function sectionDivider() {
      return '<div style="margin:0 32px;border-top:3px dashed #c8982f;position:relative;">' +
        '<div style="position:absolute;top:-8px;left:50%;transform:translateX(-50%);background:#fff;padding:0 12px;font-size:7px;color:#c8982f;letter-spacing:2px;">&#x2702; CUT HERE</div>' +
        '</div>';
    }

    var html = '<div id="pdf-worksheet-root" style="font-family:\'Times New Roman\',Times,serif;color:#1a1a1a;width:8in;padding:0;margin:0 auto;background:#fff;">';

    // ===== HEADER =====
    html += headerHTML;

    html += '<div style="padding:16px 32px 0;">';
    html += '<div style="display:flex;justify-content:space-between;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #ccc;">';
    html += '<div style="font-size:11px;color:#555;">Name: ______________________________________</div>';
    html += '<div style="font-size:11px;color:#555;">Date: ________________</div>';
    html += '<div style="font-size:11px;color:#555;">Period: ______</div>';
    html += '</div>';
    html += '<h1 style="font-size:20px;color:#065f46;margin:4px 0 4px;font-weight:bold;">' + unit.title + '</h1>';
    html += '<div style="font-size:10px;color:#666;margin-bottom:12px;">' + course.title + ' &mdash; Unit Review Worksheet</div>';
    if (topics.length) {
      html += '<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:5px;padding:8px 14px;margin-bottom:14px;">';
      html += '<div style="font-size:8px;font-weight:bold;color:#059669;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Topics Covered</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:2px 18px;">';
      topics.forEach(function(tp, ti) {
        html += '<div style="font-size:9.5px;color:#333;">' + (ti + 1) + '. ' + tp.title + '</div>';
      });
      html += '</div></div>';
    }
    html += '</div>';

    // ===== SECTIONS (Easy, Medium, Hard) — continuous, separated by cut lines =====
    sections.forEach(function(sec, si) {
      html += sectionDivider();

      html += '<div style="padding:16px 32px 12px;">';
      html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">';
      html += '<div style="background:' + sec.color + ';color:#fff;padding:6px 18px;border-radius:4px;font-size:14px;font-weight:bold;letter-spacing:1.5px;">' + sec.label + '</div>';
      html += '<div style="font-size:10px;color:#888;">10 Questions</div>';
      html += '</div>';

      sec.problems.forEach(function(p, qi) {
        var bg = qi % 2 === 0 ? sec.bgLight : '#fff';
        html += '<div style="background:' + bg + ';padding:8px 14px 6px;border-left:3px solid ' + sec.color + ';border-bottom:1px solid #e5e7eb;margin-bottom:1px;">';
        html += '<div style="font-size:11.5px;margin-bottom:4px;line-height:1.5;"><span style="font-weight:bold;color:' + sec.color + ';margin-right:6px;">' + (qi + 1) + '.</span>' + renderKTeX(p.question) + '</div>';
        var opts = p.options || [];
        html += '<div style="display:flex;flex-wrap:wrap;gap:3px 20px;padding-left:20px;margin-bottom:2px;">';
        opts.forEach(function(o, oi) {
          html += '<div style="font-size:10.5px;padding:1px 0;color:#333;"><span style="font-weight:bold;color:' + sec.color + ';margin-right:3px;">' + choiceL[oi] + ')</span>' + renderKTeX(o) + '</div>';
        });
        html += '</div></div>';
      });
      html += '</div>';
    });

    // ===== BONUS FRQ =====
    html += sectionDivider();
    html += '<div style="padding:16px 32px 12px;">';
    html += '<div style="background:linear-gradient(135deg,#030f0d,#0a2520);border-radius:8px;padding:14px 18px;margin-bottom:14px;">';
    html += '<div style="font-size:13px;font-weight:bold;color:#fbbf24;letter-spacing:1.5px;margin-bottom:3px;">&#x2605; HARD BONUS &mdash; Free Response</div>';
    html += '<div style="font-size:8px;color:#a7f3d0;">Show all work. Justify each step.</div>';
    html += '</div>';
    html += '<div style="padding:12px 16px;border:1px solid #e5e7eb;border-radius:6px;font-size:11.5px;line-height:1.7;background:#fafafa;">' + renderKTeX(bonus.prompt) + '</div>';
    html += '<div style="margin-top:16px;border:1px dashed #ccc;border-radius:6px;padding:12px;min-height:180px;">';
    html += '<div style="font-size:8px;color:#999;">WORK SPACE</div>';
    html += '</div>';
    html += '</div>';

    // ===== ANSWER KEY =====
    html += sectionDivider();
    html += '<div style="padding:16px 32px 20px;">';
    html += '<h2 style="font-size:16px;color:#065f46;margin:0 0 12px;font-weight:bold;border-bottom:2px solid #d1fae5;padding-bottom:5px;">Answer Key</h2>';

    sections.forEach(function(sec) {
      html += '<div style="margin-bottom:12px;">';
      html += '<div style="font-size:10px;font-weight:bold;color:' + sec.color + ';margin-bottom:4px;">' + sec.label + '</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:3px 0;">';
      sec.problems.forEach(function(p, qi) {
        var letter = choiceL[p.correct] || '?';
        html += '<div style="width:56px;font-size:9.5px;color:#333;padding:2px 0;"><span style="color:#888;">' + (qi + 1) + '.</span> <span style="font-weight:bold;color:' + sec.color + ';">' + letter + '</span></div>';
      });
      html += '</div></div>';
    });

    html += '<div style="margin-top:14px;border-top:2px solid #065f46;padding-top:10px;">';
    html += '<div style="font-size:10px;font-weight:bold;color:#fbbf24;background:#030f0d;display:inline-block;padding:3px 12px;border-radius:4px;margin-bottom:8px;">BONUS FRQ &mdash; Solution</div>';
    html += '<div style="font-size:10px;color:#333;line-height:1.6;padding:8px 12px;background:#fafafa;border:1px solid #e5e7eb;border-radius:6px;">' + renderKTeX(bonus.solution || bonus.prompt) + '</div>';
    html += '</div>';
    html += '</div>';

    // ===== FOOTER =====
    html += '<div style="border-top:1px solid #d1d5db;margin:0 32px;padding:6px 0;display:flex;justify-content:space-between;font-size:7.5px;color:#999;">';
    html += '<span>Prime Prep &nbsp;|&nbsp; students helping students &nbsp;|&nbsp; primeprep.app</span>';
    html += '<span>' + course.title + ' &mdash; ' + unit.title + '</span>';
    html += '</div>';

    html += '</div>';

    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:#fff;z-index:999999;overflow:auto;';
    var container = document.createElement('div');
    container.style.cssText = 'width:8in;margin:0 auto;background:#fff;';
    container.innerHTML = html;
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    var fname = course.title.replace(/\s+/g, '_') + '_' + unit.title.replace(/\s+/g, '_') + '_Review.pdf';

    showToast('Generating PDF...', 'info');

    setTimeout(function() {
      var pxWidth = container.scrollWidth;
      var pxHeight = container.scrollHeight;
      var pdfScale = 2;
      var inWidth = 8.5;
      var inHeight = (pxHeight / pxWidth) * inWidth;

      html2pdf().set({
        margin: [0.2, 0.25, 0.2, 0.25],
        filename: fname,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: pdfScale, useCORS: true, letterRendering: true, scrollX: 0, scrollY: 0, width: pxWidth, height: pxHeight, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'in', format: [inWidth, inHeight + 0.4], orientation: 'portrait' },
        pagebreak: { mode: 'avoid-all' }
      }).from(container).save().then(function() {
        document.body.removeChild(overlay);
        addXP(5);
        logActivity('Downloaded review: ' + course.title + ' - ' + unit.title, 'download');
        showToast('Downloaded "' + unit.title + '" review as PDF', 'success');
      }).catch(function(err) {
        console.error('PDF generation error:', err);
        if (overlay.parentNode) document.body.removeChild(overlay);
        showToast('Error generating PDF', 'error');
      });
    }, 500);
  }

  function renderVideoLibrary() {
    const grid = document.getElementById('video-library-grid');
    if (!grid) return;

    grid.innerHTML = COURSES.map(c => {
      let videoCount = 0;
      c.units.forEach(u => u.topics.forEach(t => videoCount += (t.videos || []).length));
      return `
        <div class="vl-course-section" data-course="${c.id}">
          <div class="vl-course-tile" onclick="this.parentElement.classList.toggle('expanded')">
            <div class="vl-tile-icon" style="background:${c.color}20;color:${c.color}">${c.icon}</div>
            <div class="vl-tile-info">
              <h3>${c.title}</h3>
              <span class="vl-tile-count">${videoCount} videos</span>
            </div>
            <i class="fas fa-chevron-down vl-tile-chevron"></i>
          </div>
          <div class="vl-course-videos">
            ${c.units.map(u => {
              const unitVideos = [];
              u.topics.forEach(t => {
                (t.videos || []).forEach(v => unitVideos.push({ ...v, topic: t.title }));
              });
              if (unitVideos.length === 0) return '';
              return `
                <div class="vl-unit-group">
                  <h4 class="vl-unit-title"><i class="fas fa-layer-group" style="color:${c.color}"></i> ${u.title}</h4>
                  <div class="vl-video-grid">
                    ${unitVideos.map(v => {
                      const videoId = v.videoId || (v.url && v.url.includes('v=') ? v.url.split('v=')[1].split('&')[0] : null);
                      const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#';
                      const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
                      const summary = v.summary || `Covers ${v.title} for ${v.topic}. Best for ${c.title} students learning or reviewing this material.`;
                      return `
                        <a href="${watchUrl}" target="_blank" rel="noopener" class="video-card">
                          <div class="video-thumbnail">
                            ${thumbUrl ? `<img src="${thumbUrl}" alt="${v.title}" loading="lazy" onerror="this.style.display='none'">` : ''}
                            <div class="video-play-overlay" style="opacity:1;background:${c.color}30">
                              <div class="video-play-btn"><i class="fas fa-play"></i></div>
                            </div>
                          </div>
                          <div class="video-info">
                            <h4>${v.title}</h4>
                            <div class="video-channel"><i class="fab fa-youtube" style="color:#ef4444"></i> ${v.channel || 'YouTube'} &bull; ${v.topic}</div>
                            <p class="video-summary">${summary}</p>
                          </div>
                        </a>`;
                    }).join('')}
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    }).join('');
  }

  // ===================== GRAPHING CALCULATOR (Desmos) =====================

  let desmosCalc = null;

  function toggleCalculator() {
    const panel = document.getElementById('calc-panel');
    if (!panel) return;
    const willOpen = panel.classList.contains('hidden');
    if (willOpen) {
      panel.classList.remove('hidden');
      if (!desmosCalc) {
        const mount = document.getElementById('calc-mount');
        if (typeof Desmos !== 'undefined' && mount) {
          try {
            desmosCalc = Desmos.GraphingCalculator(mount, { expressions: true, settingsMenu: false, border: false });
          } catch (e) {
            mount.innerHTML = '<p style="padding:20px;color:var(--text-secondary)">Calculator failed to load. Check your connection and try again.</p>';
          }
        } else if (mount) {
          mount.innerHTML = '<p style="padding:20px;color:var(--text-secondary)">Calculator needs an internet connection to load.</p>';
        }
      } else {
        try { desmosCalc.resize(); } catch (e) {}
      }
    } else {
      panel.classList.add('hidden');
    }
  }

  // ===================== FLASHCARDS =====================

  function getCourseDeck(course) {
    const cards = [];
    course.units.forEach(function(u) {
      u.topics.forEach(function(t) {
        (t.vocabulary || []).forEach(function(v) {
          cards.push({ kind: 'Vocabulary', front: v.term, back: v.definition, topic: t.title });
        });
        if (t.keyFormulas && t.keyFormulas.length) {
          const body = t.keyFormulas.map(function(f) { return '\\[' + f + '\\]'; }).join('');
          cards.push({ kind: 'Key Formula', front: 'Recall the key formula(s) for: <strong>' + t.title + '</strong>', back: body, topic: t.title });
        }
      });
    });
    return cards;
  }

  function renderFlashcards() {
    const home = document.getElementById('flashcards-home');
    if (!home) return;
    home.innerHTML = COURSES.map(function(c) {
      const count = getCourseDeck(c).length;
      return '<div class="fc-course-tile" style="border-top:4px solid ' + c.color + '" onclick="App.startFlashcards(\'' + c.id + '\')">' +
        '<div class="fc-tile-icon" style="background:' + c.color + '20;color:' + c.color + '">' + c.icon + '</div>' +
        '<div class="fc-tile-info"><h3>' + c.title + '</h3><span class="fc-tile-count">' + count + ' cards</span></div>' +
        '<i class="fas fa-arrow-right fc-tile-arrow"></i></div>';
    }).join('');
    enhanceA11y();
  }

  function startFlashcards(courseId) {
    const course = COURSES.find(function(c) { return c.id === courseId; });
    if (!course) return;
    const deck = getCourseDeck(course);
    if (!deck.length) { showToast('No flashcards for this subject yet.', 'info'); return; }
    state._fcDeck = deck;
    state._fcIndex = 0;
    state._fcFlipped = false;
    state._fcColor = course.color;
    document.getElementById('flashcards-home').classList.add('hidden');
    document.getElementById('flashcards-player').classList.remove('hidden');
    renderFlashcard();
  }

  function renderFlashcard() {
    const player = document.getElementById('flashcards-player');
    if (!player || !state._fcDeck) return;
    const deck = state._fcDeck;
    const i = state._fcIndex;
    const card = deck[i];
    const flipped = state._fcFlipped;
    player.innerHTML =
      '<div class="fc-player-bar">' +
        '<button class="btn btn-ghost btn-sm" onclick="App.exitFlashcards()"><i class="fas fa-arrow-left"></i> Subjects</button>' +
        '<span class="fc-progress">Card ' + (i + 1) + ' of ' + deck.length + '</span>' +
        '<button class="btn btn-ghost btn-sm" onclick="App.fcShuffle()"><i class="fas fa-shuffle"></i> Shuffle</button>' +
      '</div>' +
      '<div class="fc-card' + (flipped ? ' flipped' : '') + '" onclick="App.flipCard()" aria-label="Flashcard. Activate to flip.">' +
        '<div class="fc-card-inner">' +
          '<div class="fc-face fc-front"><span class="fc-kind" style="color:' + state._fcColor + '">' + card.kind + '</span><div class="fc-face-content">' + card.front + '</div><span class="fc-hint">Click or press Space to flip</span></div>' +
          '<div class="fc-face fc-back"><span class="fc-kind">Answer</span><div class="fc-face-content">' + card.back + '</div><span class="fc-topic-tag">' + card.topic + '</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="fc-nav">' +
        '<button class="btn btn-glass" onclick="App.fcPrev()"' + (i === 0 ? ' disabled' : '') + '><i class="fas fa-arrow-left"></i> Previous</button>' +
        '<button class="btn btn-primary" onclick="App.flipCard()"><i class="fas fa-rotate"></i> Flip</button>' +
        '<button class="btn btn-glass" onclick="App.fcNext()"' + (i === deck.length - 1 ? ' disabled' : '') + '>Next <i class="fas fa-arrow-right"></i></button>' +
      '</div>';
    renderMath(player);
    enhanceA11y();
  }

  function flipCard() {
    state._fcFlipped = !state._fcFlipped;
    const c = document.querySelector('.fc-card');
    if (c) c.classList.toggle('flipped', state._fcFlipped);
  }
  function fcNext() {
    if (state._fcDeck && state._fcIndex < state._fcDeck.length - 1) { state._fcIndex++; state._fcFlipped = false; renderFlashcard(); }
  }
  function fcPrev() {
    if (state._fcDeck && state._fcIndex > 0) { state._fcIndex--; state._fcFlipped = false; renderFlashcard(); }
  }
  function fcShuffle() {
    if (!state._fcDeck) return;
    for (let k = state._fcDeck.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      const tmp = state._fcDeck[k]; state._fcDeck[k] = state._fcDeck[j]; state._fcDeck[j] = tmp;
    }
    state._fcIndex = 0; state._fcFlipped = false; renderFlashcard();
    showToast('Deck shuffled', 'info');
  }
  function exitFlashcards() {
    document.getElementById('flashcards-player').classList.add('hidden');
    document.getElementById('flashcards-home').classList.remove('hidden');
  }

  // ===================== MISTAKES NOTEBOOK + SESSIONS =====================

  const SR_INTERVALS = [0, 86400000, 259200000, 604800000]; // by level: now, 1d, 3d, 7d

  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
    return Math.abs(h).toString(36);
  }

  function shuffleArr(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function recordMistake(p, chosen, context) {
    if (!p || !p.question || !p.options) return;
    state.mistakes = state.mistakes || [];
    const id = 'm' + hashStr(p.question);
    const now = Date.now();
    let m = state.mistakes.find(function(x) { return x.id === id; });
    if (m) {
      m.timesWrong = (m.timesWrong || 1) + 1;
      m.chosen = chosen;
      m.correct = p.correct;
      m.options = p.options;
      m.solution = p.solution || m.solution;
      m.level = 0; m.nextDue = now; m.lastWrong = now; m.mastered = false;
    } else {
      state.mistakes.push({
        id: id, question: p.question, options: p.options, correct: p.correct,
        chosen: chosen, solution: p.solution || '', context: context || '',
        level: 0, nextDue: now, lastWrong: now, createdAt: now, timesWrong: 1, mastered: false
      });
    }
    saveState();
    updateReviewBadge();
  }

  function activeMistakes() { return (state.mistakes || []).filter(function(m) { return !m.mastered; }); }
  function dueMistakes() {
    const now = Date.now();
    return activeMistakes().filter(function(m) { return (m.nextDue || 0) <= now; });
  }

  function updateReviewBadge() {
    const badge = document.getElementById('review-nav-badge');
    if (!badge) return;
    const n = dueMistakes().length;
    badge.textContent = n;
    badge.style.display = n > 0 ? 'inline-flex' : 'none';
  }

  function masteryDots(level) {
    let out = '';
    for (let i = 0; i < 3; i++) out += '<span class="mastery-dot' + (i < level ? ' on' : '') + '"></span>';
    return out;
  }

  function renderMistakesView() {
    const wrap = document.getElementById('mistakes-content');
    if (!wrap) return;
    const all = state.mistakes || [];
    const active = activeMistakes();
    const due = dueMistakes();
    const mastered = all.length - active.length;

    if (!all.length) {
      wrap.innerHTML = '<div class="mistakes-empty glass-card">' +
        '<i class="fas fa-circle-check"></i>' +
        '<h2>No mistakes yet</h2>' +
        '<p>When you miss a question in practice or a quiz, it lands here so you can master it later. Go answer some problems!</p>' +
        '<button class="btn btn-primary" onclick="App.navigate(\'home\')"><i class="fas fa-book-open"></i> Browse courses</button>' +
      '</div>';
      return;
    }

    wrap.innerHTML =
      '<div class="mistakes-stats">' +
        '<div class="mistake-stat"><span class="ms-num">' + active.length + '</span><span class="ms-label">To master</span></div>' +
        '<div class="mistake-stat"><span class="ms-num" style="color:var(--accent-orange)">' + due.length + '</span><span class="ms-label">Due now</span></div>' +
        '<div class="mistake-stat"><span class="ms-num" style="color:var(--accent-green)">' + mastered + '</span><span class="ms-label">Mastered</span></div>' +
      '</div>' +
      '<div class="mistakes-actions">' +
        '<button class="btn btn-primary btn-lg" onclick="App.startReviewSession()"' + (due.length ? '' : ' disabled') + '><i class="fas fa-bolt"></i> Review due (' + due.length + ')</button>' +
        '<button class="btn btn-glass btn-lg" onclick="App.startReviewSession(true)"' + (active.length ? '' : ' disabled') + '><i class="fas fa-layer-group"></i> Review all (' + active.length + ')</button>' +
        '<button class="btn btn-ghost" onclick="App.clearMastered()"' + (mastered ? '' : ' disabled') + '><i class="fas fa-broom"></i> Clear mastered</button>' +
      '</div>' +
      '<div class="mistakes-list">' +
        all.slice().sort(function(a, b) { return (b.lastWrong || 0) - (a.lastWrong || 0); }).map(function(m) {
          const dueNow = !m.mastered && (m.nextDue || 0) <= Date.now();
          return '<div class="mistake-card' + (m.mastered ? ' mastered' : '') + '">' +
            '<div class="mistake-card-main">' +
              '<div class="mistake-q">' + m.question + '</div>' +
              '<div class="mistake-meta">' +
                (m.context ? '<span class="mistake-context"><i class="fas fa-tag"></i> ' + m.context + '</span>' : '') +
                '<span class="mistake-wrong"><i class="fas fa-xmark"></i> Missed ' + m.timesWrong + 'x</span>' +
                (m.mastered ? '<span class="mistake-badge mastered"><i class="fas fa-check"></i> Mastered</span>' : (dueNow ? '<span class="mistake-badge due">Due now</span>' : '<span class="mistake-badge scheduled">Scheduled</span>')) +
                '<span class="mastery-dots">' + masteryDots(m.level || 0) + '</span>' +
              '</div>' +
            '</div>' +
            '<button class="mistake-remove" aria-label="Remove from notebook" onclick="App.removeMistake(\'' + m.id + '\')"><i class="fas fa-trash"></i></button>' +
          '</div>';
        }).join('') +
      '</div>';
    renderMath(wrap);
    enhanceA11y();
  }

  function removeMistake(id) {
    state.mistakes = (state.mistakes || []).filter(function(m) { return m.id !== id; });
    saveState();
    updateReviewBadge();
    renderMistakesView();
  }

  function clearMastered() {
    state.mistakes = (state.mistakes || []).filter(function(m) { return !m.mastered; });
    saveState();
    renderMistakesView();
  }

  // ----- Shared session overlay -----
  function openSessionOverlay() {
    const ov = document.getElementById('session-overlay');
    if (ov) { ov.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
  }
  function closeSessionOverlay() {
    const ov = document.getElementById('session-overlay');
    if (ov) ov.classList.add('hidden');
    document.body.style.overflow = '';
    if (state._session && state._session.timerId) clearInterval(state._session.timerId);
    state._session = null;
    const timerEl = document.getElementById('session-timer');
    if (timerEl) timerEl.textContent = '';
  }
  function exitSession() {
    const s = state._session;
    if (s && s.type === 'mock' && !s.submitted) {
      if (!confirm('Exit the mock test? Your progress will be lost.')) return;
    }
    closeSessionOverlay();
  }

  // ----- Review session (spaced repetition) -----
  function startReviewSession(all) {
    const pool = all === true ? activeMistakes() : dueMistakes();
    if (!pool.length) { showToast('Nothing to review right now — nice work!', 'info'); return; }
    const qs = shuffleArr(pool.map(function(m) {
      return { mistakeId: m.id, question: m.question, options: m.options, correct: m.correct, solution: m.solution };
    }));
    state._session = { type: 'review', qs: qs, i: 0, answers: {}, correctCount: 0 };
    document.getElementById('session-title').textContent = 'Review Session';
    document.getElementById('session-timer').textContent = '';
    openSessionOverlay();
    renderReviewQuestion();
  }

  function renderReviewQuestion() {
    const s = state._session;
    if (!s) return;
    const q = s.qs[s.i];
    const answered = s.answers[s.i] !== undefined;
    const chosen = s.answers[s.i];
    document.getElementById('session-progress-bar').style.width = ((s.i) / s.qs.length * 100) + '%';
    const body = document.getElementById('session-body');
    body.innerHTML =
      '<div class="session-counter">Question ' + (s.i + 1) + ' of ' + s.qs.length + '</div>' +
      '<div class="session-question">' + q.question + '</div>' +
      '<div class="session-options">' +
        q.options.map(function(opt, j) {
          let cls = 'option-btn';
          if (answered) {
            cls += ' disabled';
            if (j === q.correct) cls += ' correct';
            if (j === chosen && j !== q.correct) cls += ' incorrect';
          }
          return '<button class="' + cls + '"' + (answered ? ' disabled' : '') + ' onclick="App.reviewAnswer(' + j + ')">' +
            '<span class="option-letter">' + String.fromCharCode(65 + j) + '</span><span>' + opt + '</span></button>';
        }).join('') +
      '</div>' +
      (answered ? '<div class="session-solution"><strong>' + (chosen === q.correct ? 'Correct! ' : 'Answer: ') + '</strong>' + (q.solution || 'Review the correct choice above.') + '</div>' : '');
    const footer = document.getElementById('session-footer');
    footer.innerHTML = answered
      ? '<button class="btn btn-primary btn-lg" onclick="App.reviewNext()">' + (s.i === s.qs.length - 1 ? '<i class="fas fa-flag-checkered"></i> Finish' : 'Next <i class="fas fa-arrow-right"></i>') + '</button>'
      : '<span class="session-hint">Pick the answer you think is right.</span>';
    renderMath(body);
  }

  function reviewAnswer(optionIdx) {
    const s = state._session;
    if (!s || s.answers[s.i] !== undefined) return;
    const q = s.qs[s.i];
    s.answers[s.i] = optionIdx;
    const correct = optionIdx === q.correct;
    if (correct) s.correctCount++;
    const m = (state.mistakes || []).find(function(x) { return x.id === q.mistakeId; });
    if (m) {
      const now = Date.now();
      if (correct) {
        m.level = Math.min(3, (m.level || 0) + 1);
        m.nextDue = now + SR_INTERVALS[m.level];
        if (m.level >= 3) m.mastered = true;
      } else {
        m.level = 0; m.nextDue = now; m.lastWrong = now;
      }
      saveState();
    }
    renderReviewQuestion();
  }

  function reviewNext() {
    const s = state._session;
    if (!s) return;
    if (s.i < s.qs.length - 1) { s.i++; renderReviewQuestion(); }
    else finishReview();
  }

  function finishReview() {
    const s = state._session;
    if (!s) return;
    const pct = Math.round((s.correctCount / s.qs.length) * 100);
    const color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
    document.getElementById('session-progress-bar').style.width = '100%';
    document.getElementById('session-body').innerHTML =
      '<div class="session-report">' +
        '<div class="session-report-score" style="color:' + color + '">' + pct + '%</div>' +
        '<p class="session-report-msg">You got ' + s.correctCount + ' of ' + s.qs.length + ' correct.</p>' +
        '<p class="session-report-sub">Correct answers move toward "mastered"; missed ones come back sooner.</p>' +
      '</div>';
    document.getElementById('session-footer').innerHTML =
      '<button class="btn btn-primary btn-lg" onclick="App.exitSession()"><i class="fas fa-check"></i> Done</button>';
    updateReviewBadge();
    logActivity('Reviewed ' + s.qs.length + ' mistakes (' + pct + '%)', 'rotate-left');
    s.done = true;
    // Refresh the notebook behind the overlay.
    if (typeof renderMistakesView === 'function') renderMistakesView();
  }

  // ----- Timed mock test -----
  function startMockTest(tab) {
    const data = TEST_PREP_DATA[tab] || TEST_PREP_DATA.sat;
    let pool = [];
    data.forEach(function(c) {
      (c.problems || []).forEach(function(p) {
        const sp = shuffleOptions(JSON.parse(JSON.stringify(p)));
        sp._topic = c.title;
        pool.push(sp);
      });
    });
    pool = shuffleArr(pool);
    const count = Math.min(20, pool.length);
    const minutes = Math.max(10, Math.round(count * 1.25));
    const qs = pool.slice(0, count);
    state._session = {
      type: 'mock', tab: tab, qs: qs, i: 0, answers: {}, flags: {},
      endAt: Date.now() + minutes * 60000, minutes: minutes, submitted: false
    };
    document.getElementById('session-title').textContent = tab.toUpperCase() + ' Mock Test';
    openSessionOverlay();
    startMockTimer();
    renderMockQuestion();
  }

  function startMockTimer() {
    const s = state._session;
    if (!s) return;
    function tick() {
      if (!state._session || state._session !== s) return;
      const remaining = Math.max(0, s.endAt - Date.now());
      const mm = Math.floor(remaining / 60000);
      const ss = Math.floor((remaining % 60000) / 1000);
      const el = document.getElementById('session-timer');
      if (el) {
        el.textContent = mm + ':' + (ss < 10 ? '0' : '') + ss;
        el.classList.toggle('urgent', remaining <= 60000);
      }
      if (remaining <= 0) { clearInterval(s.timerId); submitMock(true); }
    }
    tick();
    s.timerId = setInterval(tick, 1000);
  }

  function renderMockQuestion() {
    const s = state._session;
    if (!s) return;
    const q = s.qs[s.i];
    const chosen = s.answers[s.i];
    const answeredCount = Object.keys(s.answers).length;
    document.getElementById('session-progress-bar').style.width = (answeredCount / s.qs.length * 100) + '%';
    const body = document.getElementById('session-body');
    body.innerHTML =
      '<div class="session-counter">Question ' + (s.i + 1) + ' of ' + s.qs.length + ' &bull; <span class="mock-topic">' + (q._topic || '') + '</span></div>' +
      '<div class="session-question">' + q.question + '</div>' +
      '<div class="session-options">' +
        q.options.map(function(opt, j) {
          return '<button class="option-btn' + (chosen === j ? ' selected' : '') + '" onclick="App.mockSelect(' + j + ')">' +
            '<span class="option-letter">' + String.fromCharCode(65 + j) + '</span><span>' + opt + '</span></button>';
        }).join('') +
      '</div>' +
      '<div class="mock-navigator">' +
        s.qs.map(function(_, k) {
          let cls = 'mock-nav-dot';
          if (k === s.i) cls += ' current';
          if (s.answers[k] !== undefined) cls += ' answered';
          if (s.flags[k]) cls += ' flagged';
          return '<button class="' + cls + '" onclick="App.mockGoto(' + k + ')" aria-label="Go to question ' + (k + 1) + '">' + (k + 1) + '</button>';
        }).join('') +
      '</div>';
    const flagged = !!s.flags[s.i];
    document.getElementById('session-footer').innerHTML =
      '<button class="btn btn-glass" onclick="App.mockPrev()"' + (s.i === 0 ? ' disabled' : '') + '><i class="fas fa-arrow-left"></i> Prev</button>' +
      '<button class="btn btn-ghost mock-flag' + (flagged ? ' active' : '') + '" onclick="App.mockFlag()"><i class="fas fa-flag"></i> ' + (flagged ? 'Flagged' : 'Flag') + '</button>' +
      (s.i === s.qs.length - 1
        ? '<button class="btn btn-primary" onclick="App.submitMock(false)"><i class="fas fa-paper-plane"></i> Submit</button>'
        : '<button class="btn btn-primary" onclick="App.mockNext()">Next <i class="fas fa-arrow-right"></i></button>');
    renderMath(body);
  }

  function mockSelect(j) { const s = state._session; if (!s) return; s.answers[s.i] = j; renderMockQuestion(); }
  function mockNext() { const s = state._session; if (s && s.i < s.qs.length - 1) { s.i++; renderMockQuestion(); } }
  function mockPrev() { const s = state._session; if (s && s.i > 0) { s.i--; renderMockQuestion(); } }
  function mockGoto(k) { const s = state._session; if (s) { s.i = k; renderMockQuestion(); } }
  function mockFlag() { const s = state._session; if (!s) return; s.flags[s.i] = !s.flags[s.i]; renderMockQuestion(); }

  function submitMock(auto) {
    const s = state._session;
    if (!s || s.submitted) return;
    const unanswered = s.qs.length - Object.keys(s.answers).length;
    if (!auto && unanswered > 0) {
      if (!confirm('You have ' + unanswered + ' unanswered question(s). Submit anyway?')) return;
    }
    s.submitted = true;
    if (s.timerId) clearInterval(s.timerId);
    const el = document.getElementById('session-timer');
    if (el) { el.textContent = ''; el.classList.remove('urgent'); }

    let correctCount = 0;
    let added = 0;
    s.qs.forEach(function(q, k) {
      const chosen = s.answers[k];
      if (chosen === q.correct) {
        correctCount++;
      } else if (chosen !== undefined) {
        recordMistake(q, chosen, s.tab.toUpperCase() + ' Mock Test — ' + (q._topic || ''));
        added++;
      }
    });
    const pct = Math.round((correctCount / s.qs.length) * 100);
    const color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
    if (auto) showToast('Time\'s up — test submitted.', 'info');

    if (!state.completedActivities) state.completedActivities = [];
    state.completedActivities.push({
      type: 'mock-test', course: s.tab.toUpperCase() + ' Mock Test', unit: '', topic: 'Full timed test',
      difficulty: 'mixed', score: pct, correct: correctCount, total: s.qs.length, date: new Date().toISOString()
    });
    saveState();
    renderSidebarActivity();
    logActivity(s.tab.toUpperCase() + ' mock test: ' + pct + '%', 'stopwatch');

    document.getElementById('session-progress-bar').style.width = '100%';
    document.getElementById('session-body').innerHTML =
      '<div class="session-report">' +
        '<div class="session-report-score" style="color:' + color + '">' + pct + '%</div>' +
        '<p class="session-report-msg">' + correctCount + ' of ' + s.qs.length + ' correct</p>' +
        (added ? '<p class="session-report-sub"><i class="fas fa-rotate-left"></i> ' + added + ' missed question(s) added to your Review notebook.</p>' : '<p class="session-report-sub">Perfect run — nothing added to your notebook!</p>') +
      '</div>' +
      '<div class="mock-review-list">' +
        s.qs.map(function(q, k) {
          const chosen = s.answers[k];
          const ok = chosen === q.correct;
          return '<div class="mock-review-item ' + (ok ? 'ok' : 'bad') + '">' +
            '<div class="mri-head"><span class="mri-num">Q' + (k + 1) + '</span>' +
              '<span class="mri-status">' + (ok ? '<i class="fas fa-check"></i> Correct' : (chosen === undefined ? '<i class="fas fa-minus"></i> Skipped' : '<i class="fas fa-xmark"></i> Incorrect')) + '</span></div>' +
            '<div class="mri-q">' + q.question + '</div>' +
            '<div class="mri-ans"><strong>Correct:</strong> ' + q.options[q.correct] + '</div>' +
            (q.solution ? '<div class="mri-sol">' + q.solution + '</div>' : '') +
          '</div>';
        }).join('') +
      '</div>';
    document.getElementById('session-footer').innerHTML =
      '<button class="btn btn-glass" onclick="App.startMockTest(\'' + s.tab + '\')"><i class="fas fa-redo"></i> Retake</button>' +
      '<button class="btn btn-primary" onclick="App.exitSession()"><i class="fas fa-check"></i> Done</button>';
    const body = document.getElementById('session-body');
    renderMath(body);
    body.scrollTop = 0;
    updateReviewBadge();
  }

  // ===================== DASHBOARD GOALS =====================

  function updateGoals() {
    const uniqueTopics = [...new Set(state.completedTopics)];
    state.completedTopics = uniqueTopics;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekISO = weekStart.toISOString();

    const weekActivities = (state.completedActivities || []).filter(a =>
      a.type === 'topic-complete' && a.date >= weekISO
    );
    const weekTopicIds = [...new Set(weekActivities.map(a => a.topic))];
    const weekTopicCount = Math.min(weekTopicIds.length, 5);

    const weekQuizzes = (state.completedActivities || []).filter(a =>
      (a.type === 'course-practice' || a.type === 'test-prep') &&
      a.score >= 80 && a.date >= weekISO
    );
    const weekQuizCount = Math.min(weekQuizzes.length, 3);

    const setGoal = (id, val, max) => {
      const el = document.getElementById(id);
      if (el) el.textContent = `${val} / ${max}`;
      const bar = document.getElementById(id.replace('count','bar'));
      if (bar) bar.style.width = Math.min(100, (val/max)*100) + '%';
    };

    setGoal('goal-topics-count', weekTopicCount, 5);
    setGoal('goal-quiz-count', weekQuizCount, 3);
    setGoal('goal-streak-count', Math.min(state.streak, 7), 7);
  }

  // ===================== PUBLIC API =====================

  return {
    init,
    navigate,
    toggleUnit,
    selectOption,
    setPracticeDifficulty,
    switchDifficulty,
    retryProblems,
    sendMessage,
    sendSuggestion,
    clearChat,
    completeTopic,
    generateTopicExplanation,
    askFollowUp,
    saveApiKey,
    setTheme,
    exportProgress,
    resetProgress,
    prevWeek,
    nextWeek,
    openSessionModal,
    closeSessionModal,
    createSession,
    openTutorBookingModal,
    closeTutorBookingModal,
    submitTutorBooking,
    switchResourceTab,
    selectDownloadSubject,
    downloadUnitReview,
    switchTestPrepTab,
    openTestPrepTopic,
    setTestPrepDifficulty,
    selectTestPrepAnswer,
    renderTestPrepSection,
    switchAuthTab,
    handleLogin,
    handleSignup,
    handleGoogleSignIn,
    continueAsGuest,
    dismissOnboarding,
    generateQuiz,
    generateTestPrepQuiz,
    explainWrong,
    explainWrongTP,
    closeAIPanel,
    sendPanelMessage,
    cycleTheme,
    toggleFormulaPalette,
    insertSymbol,
    handleChatImage,
    setLocalAIKey,
    onNotesFileSelected,
    clearNotesFile,
    analyzeNotes,
    startFlashcards,
    flipCard,
    fcNext,
    fcPrev,
    fcShuffle,
    exitFlashcards,
    toggleCalculator,
    showHint,
    toggleA11yMenu,
    setTextSize,
    toggleHighContrast,
    toggleDyslexiaFont,
    startTour,
    tourNext,
    tourPrev,
    endTour,
    openShortcuts,
    closeShortcuts,
    removeMistake,
    clearMastered,
    startReviewSession,
    reviewAnswer,
    reviewNext,
    exitSession,
    startMockTest,
    mockSelect,
    mockNext,
    mockPrev,
    mockGoto,
    mockFlag,
    submitMock
  };
})();

document.addEventListener('DOMContentLoaded', App.init);
