/**
 * SHIELD Cyber Society - Main JavaScript Engine
 * Handles cyber canvas particles, CTF challenge verification, modal dialogues & responsive UI
 */

document.addEventListener('DOMContentLoaded', () => {
  initCyberCanvas();
  initMobileNav();
  initCTFChallenge();
  initJoinDialog();
  initStatCounters();
  initSmoothScrollSpy();
});

/* ==========================================================================
   1. CYBER DEFENSE NETWORK CANVAS (MATRIX / NODE PARTICLES)
   ========================================================================== */

function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor(width / 16), 75);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.75,
      vy: (Math.random() - 0.5) * 0.75,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? '#00f0ff' : '#00ff66'
    });
  }

  let mouseX = -1000;
  let mouseY = -1000;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting edges
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Update & draw nodes
    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse subtle interaction
      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 100) {
        p.x += (mdx / mdist) * 1.2;
        p.y += (mdy / mdist) * 1.2;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */

function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const expanded = navLinks.classList.contains('active');
      toggle.setAttribute('aria-expanded', expanded);
    });

    // Close when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   3. MINI CTF CHALLENGE SOLVER
   ========================================================================== */

function initCTFChallenge() {
  const form = document.getElementById('ctf-form');
  const input = document.getElementById('ctf-flag-input');
  const feedback = document.getElementById('ctf-feedback');

  if (!form || !input || !feedback) return;

  // The base64 cipher solves to: SHIELD{d3f3nd_wh4t_m4tt3rs_n1th}
  const VALID_FLAG = 'SHIELD{d3f3nd_wh4t_m4tt3rs_n1th}';

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submission = input.value.trim();

    if (!submission) return;

    if (submission === VALID_FLAG) {
      feedback.className = 'ctf-feedback success';
      feedback.innerHTML = `
        <strong>[+] ACCESS GRANTED! FLAG CAPTURED!</strong><br>
        Congratulations! You proved your reverse-engineering & decoding aptitude.<br>
        Badge Unlocked: <code>ELITE_RECRUIT_2026</code>. Click <strong>[ Join SHIELD ]</strong> to claim your spot in our team!
      `;
      triggerCyberCelebration();
    } else {
      feedback.className = 'ctf-feedback error';
      feedback.innerHTML = `
        <strong>[-] ACCESS DENIED: Invalid Flag.</strong><br>
        Examine the cipher: <code>U0hJRUxEe2QzZjNuZF93aDR0X200dHQzcnNfbjF0aH0=</code><br>
        Tip: It ends with an '=' padding character standard in Base64 encoding. Decrypt it!
      `;
    }
  });
}

function triggerCyberCelebration() {
  const ctfCard = document.querySelector('.ctf-card');
  if (ctfCard) {
    ctfCard.style.boxShadow = '0 0 50px rgba(0, 255, 102, 0.45)';
    ctfCard.style.borderColor = 'var(--neon-green)';
    setTimeout(() => {
      ctfCard.style.boxShadow = '';
      ctfCard.style.borderColor = '';
    }, 4000);
  }
}

/* ==========================================================================
   4. JOIN US MODAL (<dialog>) & LIGHT DISMISS
   ========================================================================== */

function initJoinDialog() {
  const dialog = document.getElementById('join-dialog');
  const openButtons = document.querySelectorAll('.trigger-join-dialog');
  const closeButton = document.getElementById('dialog-close');
  const joinForm = document.getElementById('join-form');

  if (!dialog) return;

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      dialog.close();
    });
  }

  // Modern Light Dismiss: Close on backdrop click
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      dialog.close();
    }
  });

  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = joinForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Submitting Profile...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        alert("Registration recorded! Welcome to SHIELD Cyber Society. Connect with us on Discord to complete onboarding.");
        joinForm.reset();
        if (submitBtn) {
          submitBtn.textContent = 'Join Community';
          submitBtn.disabled = false;
        }
        dialog.close();
      }, 1000);
    });
  }
}

/* ==========================================================================
   5. STAT COUNTER ANIMATION ON SCROLL
   ========================================================================== */

function initStatCounters() {
  const statElements = document.querySelectorAll('.count-up');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        if (isNaN(target) || target <= 0) {
          el.textContent = 0;
          obs.unobserve(el);
          return;
        }
        let current = 0;
        const step = Math.ceil(target / 45);

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = current;
          }
        }, 30);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. SCROLL SPY & ACTIVE NAV
   ========================================================================== */

function initSmoothScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-item a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
