/**
 * app.js
 * JavaScript logic for Nivethika Sivagnanaseelan's Desert Urban Portfolio
 * Controls scroll navigation, interactive GIS simulator, stats counters, and contact form simulation.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 0. Fullscreen Preloader Logic
  // ==========================================
  const preloader = document.getElementById('preloader');
  const progressFill = document.getElementById('preloader-progress-fill');
  const percentText = document.getElementById('preloader-percent');
  const statusText = document.getElementById('preloader-status');
  const terminal = document.getElementById('preloader-terminal');
  const canvas = document.getElementById('preloader-canvas');
  const particleContainer = document.getElementById('preloader-particles');

  // GIS Story Stage Elements
  const layerScanner = document.getElementById('preloader-layer-scanner');
  const layerRoads = document.getElementById('preloader-layer-roads');
  const layerParcels = document.getElementById('preloader-layer-parcels');
  const layerHeatmap = document.getElementById('preloader-layer-heatmap');
  const layerOverlays = document.getElementById('preloader-layer-overlays');
  const isoBuildings = document.querySelectorAll('.iso-building');

  // Terminal commands output config
  const terminalCommands = [
    "Loading GIS Modules...",
    "Importing Spatial Database...",
    "Reading GeoJSON...",
    "Loading Shapefiles...",
    "Initializing Urban Model...",
    "Running Network Analysis...",
    "Generating DEM...",
    "Building Land Use Layers...",
    "Loading Satellite Imagery...",
    "Processing Transport Network...",
    "Importing Planning Regulations...",
    "Compiling Spatial Index...",
    "Detecting Urban Blocks...",
    "Computing Accessibility...",
    "Building Smart City Framework...",
    "Loading Environmental Layers...",
    "Preparing Planning Dashboard...",
    "Initializing Interactive Maps...",
    "Connecting Spatial Services...",
    "Finalizing Visualization..."
  ];

  if (preloader) {
    document.body.classList.add('loading');
    
    // Generate floating HUD particles
    if (particleContainer) {
      for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.className = 'preloader-particle';
        p.style.left = `${Math.random() * 100}vw`;
        p.style.top = `${Math.random() * 100}vh`;
        p.style.animationDelay = `${Math.random() * 5}s`;
        p.style.animationDuration = `${5 + Math.random() * 6}s`;
        particleContainer.appendChild(p);
      }
    }

    let progress = 0;
    let currentTermIndex = 0;
    
    // Config for isometric buildings base heights (setting transform-origin inline)
    isoBuildings.forEach(building => {
      const x = building.getAttribute('data-x');
      const y = building.getAttribute('data-y');
      building.style.transformOrigin = `${x}px ${y}px`;
    });

    const statusStories = [
      { max: 15, text: "Initializing Spatial Database..." },
      { max: 30, text: "Loading Road Network..." },
      { max: 45, text: "Processing Land Use Layers..." },
      { max: 60, text: "Generating Urban Fabric..." },
      { max: 75, text: "Running Spatial Analysis..." },
      { max: 90, text: "Optimizing Urban Systems..." },
      { max: 100, text: "Welcome Planner." }
    ];

    const updatePreloaderStage = (val) => {
      // 1. Update status text stories
      const stage = statusStories.find(s => val <= s.max);
      if (stage && statusText) {
        statusText.textContent = stage.text.toUpperCase();
      }

      // 2. Animate SVG layers depending on percentage threshold
      if (val >= 15 && layerRoads) {
        layerRoads.setAttribute('opacity', '1');
        layerRoads.style.opacity = '1';
        // Trigger path stroke dash offset drawing
        layerRoads.querySelectorAll('.road-path').forEach(path => path.classList.add('active'));
      }
      
      if (val >= 30 && layerParcels) {
        layerParcels.setAttribute('opacity', '1');
        layerParcels.style.opacity = '1';
      }

      if (val >= 45) {
        isoBuildings.forEach((b, index) => {
          setTimeout(() => {
            b.classList.add('active');
          }, index * 200); // Stagger building rise
        });
      }

      if (val >= 60 && layerHeatmap) {
        layerHeatmap.setAttribute('opacity', '1');
        layerHeatmap.style.opacity = '1';
      }

      if (val >= 75 && layerOverlays) {
        layerOverlays.setAttribute('opacity', '1');
        layerOverlays.style.opacity = '1';
      }

      if (val >= 90 && canvas) {
        canvas.style.transform = 'scale(0.95)';
        canvas.style.transition = 'transform 2s ease-in-out';
      }
    };

    const updateTerminal = (val) => {
      if (!terminal) return;
      
      // Calculate how many terminal lines should be printed based on progress
      const targetLines = Math.min(Math.floor((val / 100) * terminalCommands.length) + 1, terminalCommands.length);
      
      while (currentTermIndex < targetLines) {
        const cmd = terminalCommands[currentTermIndex];
        
        // Mark previous lines as completed with checkmarks
        const prevLines = terminal.querySelectorAll('.terminal-line');
        if (prevLines.length > 0) {
          const lastLine = prevLines[prevLines.length - 1];
          const checkSpan = lastLine.querySelector('.term-status');
          if (checkSpan) {
            checkSpan.innerHTML = '<span class="term-check">✓</span>';
          }
        }
        
        // Print new line
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="term-status">[ ]</span> <span class="term-text">${cmd}</span>`;
        terminal.appendChild(line);
        
        // Scroll terminal console
        terminal.scrollTop = terminal.scrollHeight;
        currentTermIndex++;
      }
    };

    // Increments smoothly over ~6 seconds
    const interval = setInterval(() => {
      // Add random small increments to keep it organic and smooth
      progress += Math.floor(Math.random() * 2) + 1.5;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Finalize HUD & Terminal
        if (progressFill) progressFill.style.width = '100%';
        if (percentText) percentText.textContent = '100%';
        updatePreloaderStage(100);
        updateTerminal(100);
        
        // Check final checkmark in terminal
        setTimeout(() => {
          const prevLines = terminal.querySelectorAll('.terminal-line');
          if (prevLines.length > 0) {
            const lastLine = prevLines[prevLines.length - 1];
            const checkSpan = lastLine.querySelector('.term-status');
            if (checkSpan) checkSpan.innerHTML = '<span class="term-check">✓</span>';
          }
        }, 100);

        // Zoom & Fade transition out
        setTimeout(() => {
          preloader.classList.add('fade-out');
          document.body.classList.remove('loading');
          
          // Trigger entry reveals for the hero elements
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
        updateTerminal(progress);
      }
    }, 35); // Snappy 35ms loop (~2.3 seconds total load)
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
