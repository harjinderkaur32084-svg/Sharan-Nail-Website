/* ==========================================================================
   Sharan Studio — interactions
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Navbar: shadow on scroll ---------- */
    const navbar = document.getElementById('navbar');
    const onScrollNav = () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScrollNav, { passive: true });
    onScrollNav();

    /* ---------- Mobile menu ---------- */
    const burger = document.getElementById('burger');
    const navLinksWrap = document.getElementById('navLinks');

    const closeMenu = () => {
        if (!burger || !navLinksWrap) return;
        burger.classList.remove('toggle');
        navLinksWrap.classList.remove('nav-active');
        document.body.classList.remove('menu-open');
    };

    if (burger && navLinksWrap) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('toggle');
            navLinksWrap.classList.toggle('nav-active');
            document.body.classList.toggle('menu-open', navLinksWrap.classList.contains('nav-active'));
        });

        navLinksWrap.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', (e) => {
            if (navLinksWrap.classList.contains('nav-active') &&
                !navLinksWrap.contains(e.target) &&
                !burger.contains(e.target)) {
                closeMenu();
            }
        });
    }

    /* ---------- Scroll-reveal ---------- */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        revealEls.forEach((el) => revealObserver.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('active'));
    }

    /* ---------- Scroll-spy active link ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-link');
    const spy = () => {
        const pos = window.scrollY + 140;
        let current = 'home';
        sections.forEach((sec) => {
            if (pos >= sec.offsetTop) current = sec.id;
        });
        navAnchors.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    };
    window.addEventListener('scroll', spy, { passive: true });

    /* ---------- Animated counters ---------- */
    const counters = document.querySelectorAll('.counter');
    const runCounter = (el) => {
        const target = parseFloat(el.dataset.target || '0');
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const duration = 1800;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const value = target * eased;
            el.textContent = decimals
                ? value.toFixed(decimals)
                : Math.floor(value).toLocaleString('en-IN');
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString('en-IN');
        };
        requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window && counters.length) {
        const cObs = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) { runCounter(entry.target); obs.unobserve(entry.target); }
            });
        }, { threshold: 0.5 });
        counters.forEach((c) => cObs.observe(c));
    } else {
        counters.forEach((c) => { c.textContent = c.dataset.target; });
    }

    /* ---------- Testimonial slider ---------- */
    const tTrack = document.getElementById('testimonialTrack');
    const tPrev = document.getElementById('tPrev');
    const tNext = document.getElementById('tNext');
    if (tTrack && tPrev && tNext) {
        const step = () => {
            const card = tTrack.querySelector('.testimonial-card');
            return card ? card.offsetWidth + 26 : 400;
        };
        tPrev.addEventListener('click', () => tTrack.scrollBy({ left: -step(), behavior: 'smooth' }));
        tNext.addEventListener('click', () => tTrack.scrollBy({ left: step(), behavior: 'smooth' }));
    }

    /* ---------- FAQ accordion ---------- */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const q = item.querySelector('.faq-question');
        const a = item.querySelector('.faq-answer');
        if (!q || !a) return;
        q.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            faqItems.forEach((other) => {
                other.classList.remove('open');
                const oa = other.querySelector('.faq-answer');
                if (oa) oa.style.maxHeight = null;
                const ob = other.querySelector('.faq-question');
                if (ob) ob.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                a.style.maxHeight = a.scrollHeight + 'px';
                q.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ---------- Booking form (opens WhatsApp) ---------- */
    const form = document.getElementById('booking-form');
    if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const waNumber = '919339954179'; // studio WhatsApp number
        const val = (field) => {
            const el = form.elements[field];
            return el ? el.value.trim() : '';
        };
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.checkValidity()) { form.reportValidity(); return; }

            const name = val('name');
            const phone = val('phone');
            const email = val('email');
            const service = val('service');
            const date = val('date');
            const message = val('message');

            let text = 'Hello Sharan Studio, I would like to book an appointment.\n';
            text += 'Name: ' + name + '\n';
            text += 'Phone: ' + phone + '\n';
            text += 'Email: ' + email + '\n';
            text += 'Service: ' + service + '\n';
            text += 'Preferred Date: ' + date;
            if (message) text += '\nMessage: ' + message;

            window.open('https://wa.me/' + waNumber + '?text=' + encodeURIComponent(text), '_blank');

            if (submitBtn) {
                const original = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Request sent &mdash; check WhatsApp';
                submitBtn.classList.add('btn-success');
                submitBtn.disabled = true;
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = original;
                    submitBtn.classList.remove('btn-success');
                    submitBtn.disabled = false;
                }, 4500);
            }
        });
    }

    /* ---------- Back to top ---------- */
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        const toggleTop = () => scrollTopBtn.classList.toggle('show', window.scrollY > 520);
        window.addEventListener('scroll', toggleTop, { passive: true });
        toggleTop();
        scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ---------- Dynamic footer year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});