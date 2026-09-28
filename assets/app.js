(function () {
  // Scroll-reveal styles only apply once JS is confirmed running,
  // so content is never hidden if this script fails to load.
  document.documentElement.classList.add('js');

  // Mobile nav toggle
  var toggle = document.querySelector('.menu-toggle');
  var links = document.querySelector('nav.links');
  if (toggle && links) {
    var background = document.querySelectorAll('main, footer, .skip-link');
    var setOpen = function (open) {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
      background.forEach(function (el) { el.inert = open; });
      if (open) links.querySelector('a').focus();
    };
    toggle.addEventListener('click', function () {
      setOpen(!links.classList.contains('open'));
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
      if (e.key === 'Tab' && links.classList.contains('open')) {
        var focusable = Array.from(document.querySelectorAll('.site-header a, .menu-toggle')).filter(function (el) {
          return el.getClientRects().length > 0;
        });
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  // Prepare a draft locally. The visitor chooses whether to open and send it.
  var enquiry = document.querySelector('#enquiry-form');
  if (enquiry) {
    enquiry.hidden = false;
    enquiry.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!enquiry.reportValidity()) return;
      var data = new FormData(enquiry);
      var subjects = { school: 'Registering our school', partner: 'Partnering with SSBC', student: 'Joining SSBC as a student' };
      var subject = subjects[data.get('role')] || 'Getting involved in SSBC';
      var draft = 'Hello SSBC,\n\n' + data.get('message').trim() + '\n\nName: ' + data.get('name').trim() + '\nSchool or organisation: ' + data.get('organisation').trim();
      var output = document.querySelector('#enquiry-draft');
      output.value = 'Subject: ' + subject + '\n\n' + draft;
      document.querySelector('#enquiry-email').href = 'mailto:hello@ssbcouncil.org?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(draft);
      document.querySelector('#enquiry-result').hidden = false;
      document.querySelector('#enquiry-email').focus();
    });
  }

  // Active nav link
  var here = (document.body.getAttribute('data-page') || '').trim();
  if (here) {
    document.querySelectorAll('nav.links a[data-page]').forEach(function (a) {
      if (a.getAttribute('data-page') === here) a.setAttribute('aria-current', 'page');
    });
  }

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }
})();
