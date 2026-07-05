/**
 * app.js
 * JavaScript logic for Nivethika Sivagnanaseelan's Desert Urban Portfolio
 * Controls scroll navigation, interactive GIS simulator, stats counters, and contact form simulation.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 0. Fullscreen Preloader Logic (Road Building Theme)
  // ==========================================
  const preloader = document.getElementById('preloader');
  const progressFill = document.getElementById('preloader-progress-fill');
  const percentText = document.getElementById('preloader-percent');
  const statusText = document.getElementById('preloader-status');
  const consoleLine = document.getElementById('preloader-console-line');
  const roadAsphalt = document.getElementById('road-asphalt');
  const roadMarkings = document.getElementById('road-markings');
  const assets = document.querySelectorAll('.city-asset');
  const vehicle1 = document.getElementById('preloader-vehicle-1');
  const vehicle2 = document.getElementById('preloader-vehicle-2');
  const particleContainer = document.getElementById('preloader-particles');

  // Planning-related dynamic messages
  const consoleMessages = [
    "Initializing Planning Workspace...",
    "Loading Spatial Database...",
    "Importing GIS Layers...",
    "Analyzing Land Use...",
    "Building Road Network...",
    "Generating Urban Blocks...",
    "Designing Public Spaces...",
    "Optimizing Accessibility...",
    "Preparing Planning Models...",
    "Launching Portfolio..."
  ];

  if (preloader) {
    document.body.classList.add('loading');
    
    // Generate floating HUD particles
    if (particleContainer) {
      for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'preloader-particle';
        p.style.left = `${Math.random() * 100}vw`;
        p.style.top = `${Math.random() * 100}vh`;
        p.style.animationDelay = `${Math.random() * 5}s`;
        p.style.animationDuration = `${6 + Math.random() * 6}s`;
        particleContainer.appendChild(p);
      }
    }

    let progress = 0;

    const statusStories = [
      { max: 20, text: "Surveying the Site..." },
      { max: 40, text: "Designing Transport Network..." },
      { max: 60, text: "Developing Urban Infrastructure..." },
      { max: 80, text: "Integrating Sustainable Mobility..." },
      { max: 100, text: "Finalizing Planning Framework..." }
    ];

    const updatePreloaderStage = (val) => {
      // 1. Update primary status text
      const stage = statusStories.find(s => val <= s.max);
      if (stage && statusText) {
        statusText.textContent = stage.text;
      }

      // 2. Animate Road Line Growth (Total path length is 700px)
      const offset = 700 - (val / 100) * 700;
      if (roadAsphalt) roadAsphalt.style.strokeDashoffset = offset;
      if (roadMarkings) {
        roadMarkings.style.strokeDashoffset = offset;
        if (val > 15) {
          roadMarkings.style.opacity = '0.8';
        }
      }

      // 3. Reveal city assets when the road extends past their coordinate
      const roadFrontX = 50 + (val / 100) * 700;
      assets.forEach(asset => {
        const assetX = parseFloat(asset.getAttribute('data-x'));
        if (roadFrontX >= assetX) {
          asset.classList.add('active');
          
          // Light up streetlights
          const lightGlow = asset.querySelector('.streetlight-glow');
          if (lightGlow) lightGlow.classList.add('active');
          
          // Toggle traffic lights green
          const trafficGreen = asset.querySelector('.traffic-light-green');
          if (trafficGreen) trafficGreen.classList.add('active');
        }
      });

      // 4. Windows light-up and vehicle movement (above 80%)
      if (val >= 80) {
        document.querySelectorAll('.window-glow').forEach(w => w.classList.add('active'));
        
        // Translate and reveal vehicles
        if (vehicle1) {
          vehicle1.setAttribute('opacity', '1');
          vehicle1.style.opacity = '1';
          const car1X = 50 + ((val - 80) / 20) * 620;
          vehicle1.style.transform = `translateX(${car1X}px)`;
        }
        if (vehicle2) {
          vehicle2.setAttribute('opacity', '1');
          vehicle2.style.opacity = '1';
          const car2X = 30 + ((val - 80) / 20) * 600;
          vehicle2.style.transform = `translateX(${car2X}px)`;
        }
      }

      // 5. Rotate rotating CLI console messages
      if (consoleLine) {
        const msgIndex = Math.min(Math.floor((val / 100) * consoleMessages.length), consoleMessages.length - 1);
        consoleLine.textContent = consoleMessages[msgIndex].toUpperCase();
      }
    };

    // Increments smoothly over 4-5 seconds
    const interval = setInterval(() => {
      progress += Math.random() * 1.2 + 0.35; // Stochastically steps forward ~0.95% per 40ms tick
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Final updates
        if (progressFill) progressFill.style.width = '100%';
        if (percentText) percentText.textContent = '100%';
        updatePreloaderStage(100);
        
        // Continuous camera dive/scale zoom reveal transition out
        setTimeout(() => {
          preloader.classList.add('fade-out');
          document.body.classList.remove('loading');
          
          // Trigger entry reveals for the homepage hero elements
          setTimeout(() => {
            preloader.style.display = 'none';
            const heroContent = document.querySelector('.hero-content');
            const heroImg = document.querySelector('.hero-image-container');
            if (heroContent) heroContent.classList.add('active');
            if (heroImg) heroImg.classList.add('active');
          }, 1000);
        }, 1000);
      } else {
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (percentText) percentText.textContent = `${Math.round(progress)}%`;
        updatePreloaderStage(progress);
      }
    }, 40); // 40ms tick rate (~4.2 seconds total load)
  }

  // ==========================================
  // 1. Mobile Navigation Menu Toggle
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
      
      // Animate burger bars
      const spans = menuToggle.querySelectorAll('span');
      if (menuToggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu when link is clicked (mobile)
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => span.style.transform = 'none');
        spans[1].style.opacity = '1';
      });
    });
  }

  // ==========================================
  // 2. Navigation Active States on Scroll
  // ==========================================
  const sections = document.querySelectorAll('section');
  
  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies middle viewport
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  // ==========================================
  // 3. Stats Counter Animation
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-num');
  
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0');
    const duration = 1500; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const currentVal = easeProgress * target;
      
      el.textContent = currentVal.toFixed(decimals) + (el.textContent.includes('+') && progress === 1 ? '+' : '');
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        // Ensure final values are clean and include any indicator symbols
        if (target === 4) el.textContent = '4+';
        else if (target === 10) el.textContent = '10+';
        else el.textContent = target.toFixed(decimals);
      }
    };

    requestAnimationFrame(update);
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(num => animateCounter(num));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    statsObserver.observe(statsSection);
  }



  // ==========================================
  // 5. Dynamic Scroll Reveal Effects
  // ==========================================
  // Apply reveal class to sections, cards, and columns to animate them
  const revealElements = [
    ...document.querySelectorAll('.service-card'),
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.edu-card'),
    ...document.querySelectorAll('.timeline-item'),
    ...document.querySelectorAll('.about-text'),
    ...document.querySelectorAll('.about-quote-panel'),
    ...document.querySelectorAll('.skills-category-card'),
    ...document.querySelectorAll('.contact-info'),
    ...document.querySelectorAll('.contact-form-panel')
  ];

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Stop observing once animated in
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -100px 0px', // Trigger slightly before scrolling into view
    threshold: 0.15
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // 6. CV Download Handler (Generate summary text file)
  // ==========================================
  const downloadBtn = document.getElementById('download-cv-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const cvText = `
NIVETHIKA SIVAGNANASEELAN
Urban Planner | GIS & Spatial Analyst | Development Planning
Moratuwa, Sri Lanka
------------------------------------------------------------

SUMMARY:
First Class BSc (Hons) graduate in Urban Informatics and Planning from the 
University of Moratuwa. Specializes in urban planning, GIS, spatial analysis, 
and development coordination. Passionate about creating sustainable, 
resilient, and people-centered places.

EDUCATION:
University of Moratuwa
BSc (Hons) Urban Informatics & Planning
- CGPA: 3.85
- First Class Honours
- Dean's List (L1S1, L1S2, L2S3, L3S5, L4S7)

TECHNICAL EXPERTISE:
- Urban Planning: Development Planning, Land Use Planning, Site Assessment
- GIS & Spatial Analytics: GIS Mapping, Spatial Analysis, Remote Sensing
- Design Software: AutoCAD, SketchUp, QGIS
- Research: Field Surveys, Qualitative Research, Technical Report Writing

PROFESSIONAL EXPERIENCE:
- Planning Intern, John Keells Properties
- Freelance Planning & Design Support
- GIS & Spatial Mapping Specialist, Northern Province Consulting
- Research Translation & Documentation, USAID SCORE & CEA

CERTIFICATIONS:
- Foundations of Project Management (Google Professional Certificate)
- Project Scope & Schedule Management
- Diploma in English (First Class Honors)

CONTACT:
- Email: nivethika.s@example.com
- LinkedIn: linkedin.com/in/nivethika-sivagnanaseelan
- Phone: +94 77 000 0000
      `.trim();
      
      const blob = new Blob([cvText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.download = 'Nivethika_Sivagnanaseelan_CV_Summary.txt';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(url);
    });
  }

  // ==========================================
  // 7. Contact Form Simulation
  // ==========================================
  const contactForm = document.getElementById('portfolio-contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value;
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Loading State
      submitBtn.textContent = 'Transmitting Message...';
      submitBtn.disabled = true;
      formStatus.className = 'form-status-message';
      formStatus.textContent = '';
      
      // Simulate API call delay
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        formStatus.classList.add('success');
        formStatus.textContent = `Thank you, ${name}! Your transmission was successful. I'll connect with you shortly.`;
        
        // Reset form
        contactForm.reset();
      }, 1500);
    });
  }
});
