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
  const percentText = document.getElementById('preloader-percent');
  const statusText = document.getElementById('preloader-status');
  const roadAsphalt = document.getElementById('road-asphalt');
  const roadMarkings = document.getElementById('road-markings');
  const assets = document.querySelectorAll('.city-asset');
  const vehicle1 = document.getElementById('preloader-vehicle-1');
  const vehicle2 = document.getElementById('preloader-vehicle-2');

  const logSteps = [
    { threshold: 10 },
    { threshold: 22 },
    { threshold: 35 },
    { threshold: 48 },
    { threshold: 60 },
    { threshold: 72 },
    { threshold: 84 },
    { threshold: 92 },
    { threshold: 100 }
  ];

  if (preloader && roadAsphalt) {
    document.body.classList.add('loading');

    // Get total Bezier road path length dynamically
    const totalLength = roadAsphalt.getTotalLength();
    
    // Set initial dasharray and offset to hide paths
    roadAsphalt.style.strokeDasharray = totalLength;
    roadAsphalt.style.strokeDashoffset = totalLength;
    if (roadMarkings) {
      roadMarkings.style.strokeDasharray = totalLength;
      roadMarkings.style.strokeDashoffset = totalLength;
    }

    let progress = 0;

    const statusStories = [
      { max: 20, text: "Initializing Spatial Data..." },
      { max: 40, text: "Loading Base Map..." },
      { max: 60, text: "Analyzing Urban Fabric..." },
      { max: 80, text: "Modeling Infrastructure..." },
      { max: 95, text: "Optimizing Environment..." },
      { max: 100, text: "Building Better Futures..." }
    ];

    const updatePreloaderStage = (val) => {
      // 1. Update big center status text
      const activeStory = statusStories.find(s => val <= s.max);
      if (activeStory && statusText) {
        statusText.textContent = activeStory.text.toUpperCase();
      }

      // 2. Animate Winding Road Line Growth
      const currentOffset = totalLength - (val / 100) * totalLength;
      roadAsphalt.style.strokeDashoffset = currentOffset;
      if (roadMarkings) {
        roadMarkings.style.strokeDashoffset = currentOffset;
        if (val > 10) {
          roadMarkings.style.opacity = '1';
        }
      }

      // 3. Activate Milestones (0, 20, 40, 60, 80, 100)
      const milestoneThresholds = [0, 20, 40, 60, 80, 100];
      milestoneThresholds.forEach(th => {
        const milestoneElement = document.getElementById(`milestone-${th}`);
        if (milestoneElement) {
          if (val >= th) {
            milestoneElement.classList.add('active');
          } else {
            milestoneElement.classList.remove('active');
          }
        }
      });

      // 4. Reveal vector city assets progressively
      assets.forEach(asset => {
        const triggerPercent = parseFloat(asset.getAttribute('data-progress'));
        if (val >= triggerPercent) {
          asset.classList.add('active');
          
          // Trigger streetlight glows
          const lightGlow = asset.querySelector('.streetlight-glow');
          if (lightGlow) lightGlow.classList.add('active');
        } else {
          asset.classList.remove('active');
        }
      });

      // 5. Windows light-up (above 75%)
      if (val >= 75) {
        document.querySelectorAll('.window-glow').forEach(w => w.classList.add('active'));
      } else {
        document.querySelectorAll('.window-glow').forEach(w => w.classList.remove('active'));
      }

      // 6. Translate vehicles along winding Bezier curve coordinates
      if (val >= 12) {
        if (vehicle1) {
          vehicle1.setAttribute('opacity', '1');
          const dist1 = totalLength * (val / 100);
          const pt1 = roadAsphalt.getPointAtLength(dist1);
          vehicle1.setAttribute('transform', `translate(${pt1.x}, ${pt1.y})`);
        }
      }
      if (val >= 25) {
        if (vehicle2) {
          vehicle2.setAttribute('opacity', '0.85');
          const dist2 = totalLength * ((val - 10) / 100);
          const pt2 = roadAsphalt.getPointAtLength(Math.max(0, dist2));
          vehicle2.setAttribute('transform', `translate(${pt2.x}, ${pt2.y})`);
        }
      }

      // 7. Update bottom terminal console logs list
      const terminalLines = document.querySelectorAll('.preloader-terminal .terminal-log-line');
      logSteps.forEach((step, idx) => {
        const line = terminalLines[idx];
        if (line) {
          const statusSpan = line.querySelector('.status-tag');
          if (val >= step.threshold) {
            line.className = 'terminal-log-line ok';
            statusSpan.textContent = '[ OK ]';
            statusSpan.className = 'status-tag ok';
          } else if (idx === 0 || val >= logSteps[idx - 1].threshold) {
            line.className = 'terminal-log-line active';
            statusSpan.textContent = '[ ... ]';
            statusSpan.className = 'status-tag active';
          } else {
            line.className = 'terminal-log-line';
            statusSpan.textContent = '[ PENDING ]';
            statusSpan.className = 'status-tag pending';
          }
        }
      });
    };

    // Increment progress loops
    const loadInterval = setInterval(() => {
      progress += Math.random() * 2.8 + 1.5; // Faster snappy steps
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadInterval);
        
        if (percentText) percentText.textContent = '100%';
        updatePreloaderStage(100);
        
        // Handle cinematic forward zoom transition and reveal homepage
        setTimeout(() => {
          preloader.classList.add('fade-out');
          document.body.classList.remove('loading');
          
          setTimeout(() => {
            preloader.style.display = 'none';
            const heroContent = document.querySelector('.hero-content');
            const heroImg = document.querySelector('.hero-image-container');
            if (heroContent) heroContent.classList.add('active');
            if (heroImg) heroImg.classList.add('active');
          }, 1000);
        }, 1000);
      } else {
        if (percentText) percentText.textContent = `${Math.round(progress)}%`;
        updatePreloaderStage(progress);
      }
    }, 32); // Snappy ~1.2 seconds sequence length
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
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1500; // ms
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);
      const currentVal = easeProgress * target;
      
      let formattedVal;
      if (progress === 1) {
        // Format final value with commas and correct decimal digits
        formattedVal = target.toLocaleString('en-US', { 
          minimumFractionDigits: decimals, 
          maximumFractionDigits: decimals 
        });
      } else {
        // Format intermediate value
        const roundedVal = parseFloat(currentVal.toFixed(decimals));
        formattedVal = roundedVal.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
      }
      
      el.textContent = formattedVal + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
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

  // ==========================================
  // 8. Competencies Toolkit Tab Switcher
  // ==========================================
  const tabButtons = document.querySelectorAll('.skills-tab-btn');
  const tabContents = document.querySelectorAll('.skills-tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      // Hide all tab contents
      tabContents.forEach(content => content.classList.remove('active'));
      // Show clicked tab content
      const tabId = `tab-content-${btn.getAttribute('data-tab')}`;
      const targetContent = document.getElementById(tabId);
      if (targetContent) {
        targetContent.classList.add('active');
        
        // Force browser to recalculate layout so progress bar scale transitions replay
        const fills = targetContent.querySelectorAll('.skill-progress-fill');
        fills.forEach(fill => {
          fill.style.transform = 'scaleX(0)';
          fill.getBoundingClientRect(); // Trigger layout reflow
          fill.style.transform = '';
        });
      }
    });
  });

  // ==========================================
  // 9. Project Card Details Lightbox Modal Logic
  // ==========================================
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('project-modal-body');
  const modalClose = document.getElementById('project-modal-close');

  if (projectCards.length && modal && modalBody && modalClose) {
    projectCards.forEach(card => {
      card.style.cursor = 'pointer';
      
      card.addEventListener('click', (e) => {
        // Prevent click if clicking a direct link or badge inside the card
        if (e.target.closest('a') || e.target.closest('button')) {
          return;
        }

        const dataSrc = card.querySelector('.project-details-data');
        if (!dataSrc) return;
        
        // Inject content
        modalBody.innerHTML = dataSrc.innerHTML;
        
        // Open modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // If there is a video in the modal, make sure it starts playing
        const video = modalBody.querySelector('video');
        if (video) {
          video.play().catch(err => console.log("Video auto-play failed", err));
        }
      });
    });

    const closeModal = () => {
      modal.classList.remove('active');
      document.body.classList.remove('modal-open');
      
      // Stop any playing video
      const video = modalBody.querySelector('video');
      if (video) {
        video.pause();
      }
      modalBody.innerHTML = '';
    };

    modalClose.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ==========================================
  // 10. Leaflet Project Geographic Map Index
  // ==========================================
  const mapElement = document.getElementById('project-leaflet-map');
  if (mapElement && typeof L !== 'undefined') {
    // Sri Lanka Centered coordinates [7.8731, 80.7718], Zoom 7.5
    const map = L.map('project-leaflet-map', {
      zoomSnap: 0.1,
      scrollWheelZoom: false // Disable zoom on scroll for page usability
    }).setView([7.9, 80.7], 7.5);

    // Esri World Imagery (Satellite) tiles
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

    // Overlay light map labels/borders for high readability on standard satellite map
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    // Add scale bar to bottom left
    L.control.scale({
      position: 'bottomleft',
      metric: true,
      imperial: false
    }).addTo(map);

    // Add custom North Arrow Control to bottom left
    const NorthArrowControl = L.Control.extend({
      options: {
        position: 'bottomleft'
      },
      onAdd: function(map) {
        const div = L.DomUtil.create('div', 'leaflet-north-arrow');
        div.innerHTML = `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width: 42px; height: 42px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#222" stroke-width="1.5" opacity="0.4" />
            <polygon points="50,15 57,44 50,40" fill="#fca311" />
            <polygon points="50,15 43,44 50,40" fill="#e0900f" />
            <polygon points="50,85 57,56 50,60" fill="#ffffff" />
            <polygon points="50,85 43,56 50,60" fill="#dddddd" />
            <polygon points="15,50 44,57 40,50" fill="#ffffff" />
            <polygon points="15,50 44,43 40,50" fill="#dddddd" />
            <polygon points="85,50 56,57 60,50" fill="#ffffff" />
            <polygon points="85,50 56,43 60,50" fill="#dddddd" />
            <circle cx="50" cy="50" r="4" fill="#222" />
            <text x="50" y="10" font-family="'Manrope', sans-serif" font-size="12" font-weight="900" text-anchor="middle" fill="#fca311">N</text>
          </svg>
        `;
        return div;
      }
    });
    map.addControl(new NorthArrowControl());

    // Projects geographic coordinate data
    const projects = [
      {
        coords: [9.6615, 80.0255], // Jaffna
        title: "Local Identity, Collective Memory & Culture in Post-War Urban Development",
        zone: "Jaffna, Northern Province",
        category: "Jaffna Case Study",
        tags: ["Qualitative", "Mapping", "Design"],
        cardIndex: 0
      },
      {
        coords: [6.9686, 80.7845], // Nuwara Eliya
        title: "Heritage Conservation & Sustainable Development",
        zone: "Nuwara Eliya Municipal Area",
        category: "Heritage Planning",
        tags: ["ArcGIS Pro", "MCDM", "Weighted Overlay"],
        cardIndex: 1
      },
      {
        coords: [7.8731, 80.7718], // National / Sri Lanka Center
        title: "Mitigating Human–Elephant Conflict Through Sustainable Wild Elephant Tourism",
        zone: "Sri Lanka (National Scale Study)",
        category: "Regional Planning",
        tags: ["Wildlife Tourism", "Policy", "CBT Models"],
        cardIndex: 2
      },
      {
        coords: [6.9271, 79.8612], // Colombo
        title: "Traffic Monitoring & Decision Support System",
        zone: "Colombo Traffic Corridor",
        category: "Urban Informatics",
        tags: ["Python", "YOLO", "OpenCV"],
        cardIndex: 3
      },
      {
        coords: [7.8602, 80.6516], // Dambulla
        title: "Land Use/Land Cover Classification of Dambulla DSD",
        zone: "Dambulla Divisional Secretariat Division",
        category: "Remote Sensing",
        tags: ["Landsat 7", "Supervised", "ArcGIS Pro"],
        cardIndex: 5 // Dambulla is Card 6 (index 5)
      },
      {
        coords: [9.6800, 80.0070], // Jaffna Coastline
        title: "Land Use Change Detection in the Coastal Areas of Jaffna Using Remote Sensing",
        zone: "Jaffna Coastal Areas",
        category: "Remote Sensing",
        tags: ["Landsat", "ArcMap", "Change Detection"],
        cardIndex: 6 // Jaffna Coastline is Card 7 (index 6)
      },
      {
        coords: [6.9150, 79.8800], // Colombo Air Quality
        title: "Air Quality Modelling and PM2.5 Analysis for Colombo Using Python",
        zone: "Colombo Municipal Area",
        category: "Environmental Modelling",
        tags: ["Python", "Colab", "PM2.5 Analysis"],
        cardIndex: 7 // Air Quality is Card 8 (index 7)
      }
    ];

    // Global helper function to trigger the lightbox modal open from map popup click
    window.openProjectModalFromMap = function(cardIndex) {
      const cards = document.querySelectorAll('.project-card');
      if (cards[cardIndex]) {
        cards[cardIndex].click();
      }
    };

    // Custom marker icon creation using DivIcon to allow custom CSS styling
    const customIcon = L.divIcon({
      html: '<div class="map-marker-pin"></div>',
      className: 'custom-map-marker',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    // Populate markers on Leaflet map
    projects.forEach(project => {
      const marker = L.marker(project.coords, { icon: customIcon }).addTo(map);

      // Bind custom themed popup
      const popupContent = `
        <div class="map-popup-card">
          <span class="map-popup-tag">${project.category}</span>
          <h4 class="map-popup-title">${project.title}</h4>
          <div class="map-popup-location">
            <svg class="map-popup-loc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Zone: ${project.zone}</span>
          </div>
          <div class="map-popup-tags">
            ${project.tags.map(tag => `<span class="map-popup-badge">${tag}</span>`).join('')}
          </div>
          <a href="javascript:void(0);" onclick="openProjectModalFromMap(${project.cardIndex})" class="map-popup-link">View details &rarr;</a>
        </div>
      `;

      marker.bindPopup(popupContent, {
        closeButton: true,
        offset: L.point(0, -6)
      });
    });
  }
});
