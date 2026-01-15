/**
* Template Name: Personal
* Updated: Aug 30 2023 with Bootstrap v5.3.1
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)

    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    const navbar = select('#navbar')
    const icon = this.querySelector('i')
    
    navbar.classList.toggle('navbar-mobile')
    icon.classList.toggle('bi-list')
    icon.classList.toggle('bi-x')
    
    // Update ARIA expanded state
    const isExpanded = navbar.classList.contains('navbar-mobile')
    this.setAttribute('aria-expanded', isExpanded)
  })

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '#navbar .nav-link', function(e) {
    let section = select(this.hash)
    if (section) {
      e.preventDefault()

      let navbar = select('#navbar')
      let header = select('#header')
      let sections = select('section', true)
      let navlinks = select('#navbar .nav-link', true)

      navlinks.forEach((item) => {
        item.classList.remove('active')
      })

      this.classList.add('active')

      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        let icon = navbarToggle.querySelector('i')
        icon.classList.toggle('bi-list')
        icon.classList.toggle('bi-x')
        navbarToggle.setAttribute('aria-expanded', 'false')
      }

      if (this.hash == '#header') {
        header.classList.remove('header-top')
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        return;
      }

      if (!header.classList.contains('header-top')) {
        header.classList.add('header-top')
        setTimeout(function() {
          sections.forEach((item) => {
            item.classList.remove('section-show')
          })
          section.classList.add('section-show')

        }, 350);
      } else {
        sections.forEach((item) => {
          item.classList.remove('section-show')
        })
        section.classList.add('section-show')
      }

      scrollto(this.hash)
    }
  }, true)

  /**
   * Activate/show sections on load with hash links
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      let initial_nav = select(window.location.hash)

      if (initial_nav) {
        let header = select('#header')
        let navlinks = select('#navbar .nav-link', true)

        header.classList.add('header-top')

        navlinks.forEach((item) => {
          if (item.getAttribute('href') == window.location.hash) {
            item.classList.add('active')
          } else {
            item.classList.remove('active')
          }
        })

        setTimeout(function() {
          initial_nav.classList.add('section-show')
        }, 350);

        scrollto(window.location.hash)
      }
    }
  });

  /**
   * High Contrast Mode Toggle
   */
  const contrastToggle = select('#high-contrast-toggle')
  
  // Check for saved contrast preference or system preference
  const savedContrast = localStorage.getItem('high-contrast-mode')
  const systemPrefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches
  
  if (savedContrast === 'enabled' || (savedContrast === null && systemPrefersHighContrast)) {
    document.body.classList.add('high-contrast')
    updateContrastButton(true)
  }
  
  // Listen for system contrast preference changes
  if (window.matchMedia) {
    const contrastMediaQuery = window.matchMedia('(prefers-contrast: high)')
    contrastMediaQuery.addEventListener('change', function(e) {
      // Only auto-update if user hasn't manually set a preference
      const savedContrast = localStorage.getItem('high-contrast-mode')
      if (savedContrast === null) {
        if (e.matches) {
          document.body.classList.add('high-contrast')
          updateContrastButton(true)
        } else {
          document.body.classList.remove('high-contrast')
          updateContrastButton(false)
        }
      }
    })
  }
  
  // Keyboard shortcut for high contrast (Ctrl/Cmd + Shift + C)
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
      e.preventDefault()
      if (contrastToggle) {
        contrastToggle.click()
      }
    }
  })
  
  // Toggle high contrast mode
  if (contrastToggle) {
    on('click', '#high-contrast-toggle', function(e) {
      document.body.classList.toggle('high-contrast')
      const isHighContrast = document.body.classList.contains('high-contrast')
      
      // Save preference
      localStorage.setItem('high-contrast-mode', isHighContrast ? 'enabled' : 'disabled')
      
      // Update button appearance and label
      updateContrastButton(isHighContrast)
      
      // Announce change to screen readers
      announceContrastChange(isHighContrast)
    })
  }
  
  // Update contrast button appearance and accessibility
  function updateContrastButton(isHighContrast) {
    const button = select('#high-contrast-toggle')
    const icon = button.querySelector('i')
    
    if (isHighContrast) {
      button.setAttribute('aria-label', 'Disable high contrast mode (Ctrl+Shift+C)')
      button.setAttribute('title', 'Disable high contrast mode (Ctrl+Shift+C)')
      icon.className = 'bi bi-brightness-high'
    } else {
      button.setAttribute('aria-label', 'Enable high contrast mode (Ctrl+Shift+C)')
      button.setAttribute('title', 'Enable high contrast mode (Ctrl+Shift+C)')
      icon.className = 'bi bi-circle-half'
    }
  }
  
  // Announce contrast mode change to screen readers
  function announceContrastChange(isHighContrast) {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.style.position = 'absolute'
    announcement.style.left = '-10000px'
    announcement.style.width = '1px'
    announcement.style.height = '1px'
    announcement.style.overflow = 'hidden'
    
    announcement.textContent = isHighContrast ? 
      'High contrast mode enabled' : 
      'High contrast mode disabled'
    
    document.body.appendChild(announcement)
    
    // Remove the announcement after screen readers have had time to read it
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  /**
   * Initialize Content Manager
   */
  window.addEventListener('load', async () => {
    if (window.ContentManager) {
      const contentManager = new ContentManager();
      
      // Check for saved language preference
      const savedLanguage = localStorage.getItem('preferred-language') || 'en';
      
      try {
        await contentManager.init(savedLanguage);
        console.log('Content Manager initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Content Manager:', error);
      }
    }
  });

})()