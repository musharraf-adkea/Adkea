(() => {
  'use strict';
  const seenKey = 'adkea.quick-enquiry.seen';
  try { if (sessionStorage.getItem(seenKey)) return; } catch {}
  if (typeof HTMLDialogElement === 'undefined') return;

  let shown = false;
  let pending = false;
  let baseline = window.scrollY;
  let ready = document.readyState === 'complete';

  function interrupted() {
    return document.visibilityState === 'hidden' ||
      document.documentElement.classList.contains('page-loading') ||
      document.querySelector('dialog[open], .nav-dropdown[open]') ||
      document.activeElement?.closest('form, input, textarea, select, [contenteditable="true"]');
  }

  function openEnquiry() {
    if (shown || !pending || !ready || interrupted()) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'quick-enquiry';
    dialog.className = 'lead-popup';
    dialog.setAttribute('aria-labelledby', 'quick-enquiry-title');
    dialog.setAttribute('aria-describedby', 'quick-enquiry-description');
    dialog.innerHTML = `
      <div class="lead-popup-header">
        <button class="lead-popup-close" type="button" aria-label="Close enquiry popup" autofocus>×</button>
        <span class="lead-popup-eyebrow">LET’S TALK</span>
        <h2 id="quick-enquiry-title">Grow your business.<br><span>Start with a hello.</span></h2>
        <p id="quick-enquiry-description">Leave your details. Our team will get in touch.</p>
      </div>
      <form class="lead-popup-form" action="https://formsubmit.co/connectadkea@gmail.com" method="POST">
        <input type="hidden" name="_subject" value="New ADKEA quick enquiry">
        <input type="hidden" name="_template" value="table">
        <input type="hidden" name="_next" value="https://adkea-creative-studio.musharraf772218.chatgpt.site/thanks.html">
        <input class="lead-popup-honey" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="lead-popup-fields">
          <label for="quick-name">Name<input id="quick-name" name="name" type="text" autocomplete="name" maxlength="100" required placeholder="Your name"></label>
          <label for="quick-phone">Mobile number<input id="quick-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="40" required placeholder="Include country code"></label>
          <label for="quick-email">Email ID<input id="quick-email" name="email" type="email" autocomplete="email" maxlength="160" required placeholder="you@company.com"></label>
          <label for="quick-company">Company name<input id="quick-company" name="company" type="text" autocomplete="organization" maxlength="150" required placeholder="Your company"></label>
        </div>
        <label class="lead-popup-consent" for="quick-consent"><input id="quick-consent" name="contact_consent" type="checkbox" value="Yes" required><span>I agree to be contacted about my enquiry and have read the <a href="/privacy-policy.html" target="_blank" rel="noopener">privacy notice</a>.</span></label>
        <button class="lead-popup-send" type="submit">Send enquiry <span aria-hidden="true">↗</span></button>
        <p class="lead-popup-status" role="status" aria-live="polite"></p>
      </form>`;
    document.body.append(dialog);
    const form = dialog.querySelector('form');
    const phone = form.elements.namedItem('phone');
    const button = dialog.querySelector('.lead-popup-send');
    const status = dialog.querySelector('.lead-popup-status');
    // A second modal keeps the flight above the enquiry card in the browser's top layer.
    const flight = document.createElement('dialog');
    flight.className = 'send-flight lead-popup-flight';
    flight.setAttribute('aria-label', 'Preparing your enquiry');
    flight.innerHTML = `<div class="flying-plane" aria-hidden="true"><svg viewBox="0 0 120 90"><path d="M4 4 114 34 42 55Z" fill="#fff"/><path d="m4 4 38 51 7 31 22-41 43-11Z" fill="#a996fa"/><path d="m49 86 22-41 43-11-55 26Z" fill="#ded5ff"/></svg></div><div class="flight-message"><p>Your idea is taking flight.</p><small>Opening secure submission…</small></div>`;
    document.body.append(flight);
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let submitting = false;
    let submitTimer;
    let fallback;
    function validatePhone() {
      const digits = phone.value.replace(/\D/g, '');
      const valid = /^[+()0-9.\s-]+$/.test(phone.value) && digits.length >= 7 && digits.length <= 15;
      phone.setCustomValidity(phone.value.trim() && !valid ? 'Enter a valid mobile number with 7 to 15 digits.' : '');
    }
    phone.addEventListener('input', validatePhone);
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (submitting) return;
      validatePhone();
      if (!form.reportValidity()) return;
      submitting = true;
      button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      status.textContent = 'Opening secure submission…';
      const motionPaused = reducedMotion.matches || document.body.classList.contains('motion-paused');
      if (!motionPaused) {
        const w = innerWidth, h = innerHeight;
        flight.querySelector('.flying-plane').style.offsetPath = `path("M -100 ${h*.8} C ${w*.1} ${h*.3} ${w*.5} ${h*.05} ${w*.7} ${h*.4} C ${w*.95} ${h*.8} ${w*.1} ${h*.9} ${w*.3} ${h*.35} C ${w*.45} ${h*.02} ${w*.8} ${h*.1} ${w+150} -150")`;
        flight.showModal();
        flight.classList.add('active');
      }
      submitTimer = setTimeout(() => {
        HTMLFormElement.prototype.submit.call(form);
        fallback = setTimeout(() => {
          resetSubmission();
          status.textContent = 'If submission did not open, try again or email connectadkea@gmail.com.';
        }, 15000);
      }, motionPaused ? 0 : 1800);
    });
    function resetSubmission() {
      clearTimeout(submitTimer);
      clearTimeout(fallback);
      submitting = false;
      button.disabled = false;
      form.removeAttribute('aria-busy');
      status.textContent = '';
      flight.classList.remove('active');
      if (flight.open) flight.close();
    }
    flight.addEventListener('cancel', e => { e.preventDefault(); resetSubmission(); });
    window.addEventListener('pageshow', resetSubmission);
    dialog.querySelector('.lead-popup-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('button:not([disabled]), input:not([type="hidden"]):not([tabindex="-1"]), a[href]')];
      const first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    // Close on the backdrop, without treating blank space inside the card as a close action.
    dialog.addEventListener('click', e => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('lead-popup-open');
      resetSubmission();
    });
    dialog.showModal();
    document.body.classList.add('lead-popup-open');
    shown = true;
    try { sessionStorage.setItem(seenKey, '1'); } catch {}
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('focusout', retry);
    document.removeEventListener('toggle', retry, true);
    document.removeEventListener('close', retry, true);
    document.removeEventListener('visibilitychange', retry);
  }

  function onScroll() {
    if (!ready || shown) return;
    if (window.scrollY - baseline >= 160) pending = true;
    openEnquiry();
  }
  function retry() { requestAnimationFrame(openEnquiry); }
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('focusout', retry);
  document.addEventListener('toggle', retry, true);
  document.addEventListener('close', retry, true);
  document.addEventListener('visibilitychange', retry);
  if (!ready) window.addEventListener('load', () => { ready = true; baseline = window.scrollY; }, { once: true });
})();
