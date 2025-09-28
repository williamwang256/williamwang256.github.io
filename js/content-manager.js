/**
 * Content Manager - Handles loading and rendering dynamic content
 * Supports multiple languages and easy content updates
 */

class ContentManager {
  constructor() {
    this.currentLanguage = 'en';
    this.content = null;
    this.availableLanguages = [];
  }

  /**
   * Initialize the content manager
   * @param {string} language - Initial language to load
   */
  async init(language = 'en') {
    try {
      await this.loadContent();
      this.currentLanguage = language;
      this.availableLanguages = Object.keys(this.content.languages);
      this.renderContent();
      this.setupLanguageSwitcher();
    } catch (error) {
      console.error('Failed to initialize ContentManager:', error);
    }
  }

  /**
   * Load content from embedded JavaScript data
   */
  async loadContent() {
    try {
      // Check if embedded content is available
      if (window.siteContent) {
        this.content = window.siteContent;
        return;
      }
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  }

  /**
   * Get content for current language
   * @param {string} path - Dot notation path to content (e.g., 'header.name')
   * @returns {any} - Content value
   */
  getText(path) {
    const keys = path.split('.');
    let value = this.content.content[this.currentLanguage];
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Fallback to English if content not found in current language
        value = this.content.content['en'];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            console.warn(`Content not found for path: ${path}`);
            return path; // Return path as fallback
          }
        }
        break;
      }
    }
    
    return value;
  }

  /**
   * Switch to a different language
   * @param {string} language - Language code
   */
  switchLanguage(language) {
    if (this.availableLanguages.includes(language)) {
      this.currentLanguage = language;
      this.renderContent();
      localStorage.setItem('preferred-language', language);
    }
  }

  /**
   * Render all content on the page
   */
  renderContent() {
    this.renderMeta();
    this.renderHeader();
    this.renderAbout();
    this.renderExperience();
    this.renderEducation();
    this.renderPortfolio();
    this.renderResume();
    this.renderHobbies();
    this.renderFooter();
    this.updateAccessibilityLabels();
  }

  /**
   * Render meta tags
   */
  renderMeta() {
    const meta = this.getText('meta');
    document.title = meta.title;
    
    const descriptionMeta = document.getElementById('meta-description');
    if (descriptionMeta) descriptionMeta.setAttribute('content', meta.description);
    
    const keywordsMeta = document.getElementById('meta-keywords');
    if (keywordsMeta) keywordsMeta.setAttribute('content', meta.keywords);
  }

  /**
   * Render header content
   */
  renderHeader() {
    const header = this.getText('header');
    
    // Name and subtitle
    const nameElement = document.getElementById('header-name');
    if (nameElement) nameElement.textContent = header.name;
    
    const subtitleElement = document.getElementById('header-subtitle');
    if (subtitleElement) subtitleElement.textContent = header.subtitle;
    
    // Navigation
    const navLinks = document.querySelectorAll('#navbar .nav-link');
    navLinks.forEach((link, index) => {
      if (header.navigation[index]) {
        link.textContent = header.navigation[index].label;
      }
    });
    
    // Social links
    const linkedinLink = document.getElementById('linkedin-link');
    if (linkedinLink && header.social.linkedin) {
      linkedinLink.setAttribute('aria-label', header.social.linkedin.arialabel);
      linkedinLink.setAttribute('href', header.social.linkedin.url);
    }
    
    const githubLink = document.getElementById('github-link');
    if (githubLink && header.social.github) {
      githubLink.setAttribute('aria-label', header.social.github.arialabel);
      githubLink.setAttribute('href', header.social.github.url);
    }
  }

  /**
   * Render about section
   */
  renderAbout() {
    const about = this.getText('about');
    
    // Section title
    const titleElement = document.getElementById('about-title');
    if (titleElement) titleElement.textContent = about.title;
    
    // Description
    const descElement = document.getElementById('about-description');
    if (descElement) descElement.textContent = about.description;
    
    // Profile image
    const profileImg = document.getElementById('pfp');
    if (profileImg && about.profileImage) {
      profileImg.setAttribute('src', about.profileImage.src);
      profileImg.setAttribute('alt', about.profileImage.alt);
    }
    
    // Contact info
    const phoneLabel = document.getElementById('phone-label');
    if (phoneLabel) phoneLabel.textContent = about.contact.phone.label;
    const phoneLink = document.getElementById('phone-link');
    if (phoneLink) {
      phoneLink.textContent = about.contact.phone.value;
      phoneLink.setAttribute('href', `tel:${about.contact.phone.tel}`);
    }
    const emailLabel = document.getElementById('email-label');
    if (emailLabel) emailLabel.textContent = about.contact.email.label;
    const emailLink = document.getElementById('email-link');
    if (emailLink) {
      emailLink.textContent = about.contact.email.value;
      emailLink.setAttribute('href', `mailto:${about.contact.email.value}`);
    }
  }

  /**
   * Render experience section
   */
  renderExperience() {
    const experience = this.getText('experience');
    
    // Section title
    const titleElement = document.getElementById('experience-title');
    if (titleElement) titleElement.textContent = experience.title;
    
    // Experience items
    const container = document.getElementById('experience-items');
    if (container && experience.items) {
      container.innerHTML = '';
      experience.items.forEach(item => {
        const itemElement = this.createExperienceItem(item);
        container.appendChild(itemElement);
      });
    }
  }

  /**
   * Create experience item element
   */
  createExperienceItem(item) {
    const div = document.createElement('div');
    div.className = 'resume-item pb-0';
    
    let html = `
      <br>
      <h4>${item.title}</h4>
      <h5>${item.company} | ${item.location}</h5>
      <p><em>${item.period}</em></p>
      <p>${item.description}`;

    if (item.achievements) {
      html += '<ul>';
      item.achievements.forEach(achievement => {
        html += `<li>${achievement}</li>`;
      });
      html += '</ul>';
    }
    
    if (item.links) {
      item.links.forEach(link => {
        const linkText = link.text;
        const linkUrl = link.url;
        const regex = new RegExp(linkText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        html = html.replace(regex,
          `<a href="${linkUrl}" target="_blank" rel="noopener">${linkText}</a>`);
      });
    }

    div.innerHTML = html;
    return div;
  }

  /**
   * Render education section
   */
  renderEducation() {
    const education = this.getText('education');
    
    // Section title
    const titleElement = document.getElementById('education-title');
    if (titleElement) titleElement.textContent = education.title;
    
    // Education items
    const container = document.getElementById('education-items');
    if (container && education.items) {
      container.innerHTML = '';
      education.items.forEach(item => {
        const itemElement = this.createEducationItem(item);
        container.appendChild(itemElement);
      });
    }
  }

  /**
   * Create education item element
   */
  createEducationItem(item) {
    const div = document.createElement('div');
    div.className = 'resume-item pb-0';
    
    div.innerHTML = `
      <br>
      <h4>${item.title}</h4>
      <h5>${item.institution}</h5>
      <p><em>${item.period}</em></p>
      <p>${item.description}</p>
    `;
    
    return div;
  }

  /**
   * Render portfolio section
   */
  renderPortfolio() {
    const portfolio = this.getText('portfolio');
    
    // Section title
    const titleElement = document.getElementById('portfolio-title');
    if (titleElement) titleElement.textContent = portfolio.title;
    
    // Portfolio items
    const container = document.getElementById('portfolio-items');
    if (container && portfolio.items) {
      container.innerHTML = '';
      portfolio.items.forEach(item => {
        const itemElement = this.createPortfolioItem(item);
        container.appendChild(itemElement);
      });
    }
  }

  /**
   * Create portfolio item element
   */
  createPortfolioItem(item) {
    const div = document.createElement('div');
    div.className = 'resume-item pb-0';
    
    let html = `
      <br>
      <h4>${item.title}</h4>
      <h5>${item.note}</h5>
      <p>${item.description}</p>`;
    
    if (item.image) {
      html += `<img src="${item.image.src}" class="${item.image.class || 'project_image'}" alt="${item.image.alt}">`;
    }

    if (item.links) {
      item.links.forEach(link => {
        const linkText = link.text;
        const linkUrl = link.url;
        const regex = new RegExp(linkText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        html = html.replace(regex, 
          `<a href="${linkUrl}" target="_blank" rel="noopener">${linkText}</a>`);
      });
    }

    div.innerHTML = html;
    return div;
  }

  /**
   * Render resume section
   */
  renderResume() {
    const resume = this.getText('resume');
    
    // Section title
    const titleElement = document.getElementById('resume-title');
    if (titleElement) titleElement.textContent = resume.title;
    
    // Resume content
    const subtitleElement = document.getElementById('resume-subtitle');
    if (subtitleElement) subtitleElement.textContent = resume.subtitle;
  }

  /**
   * Render hobbies section
   */
  renderHobbies() {
    const hobbies = this.getText('hobbies');
    
    // Section title
    const titleElement = document.getElementById('hobbies-title');
    if (titleElement) titleElement.textContent = hobbies.title;
    
    // Hobbies content
    const container = document.getElementById('hobbies-content');
    if (container && hobbies.sections) {
      container.innerHTML = '';
      hobbies.sections.forEach(section => {
        const sectionElement = this.createHobbiesSection(section);
        container.appendChild(sectionElement);
      });
    }
  }

  /**
   * Create hobbies section element
   */
  createHobbiesSection(section) {
    const fragment = document.createDocumentFragment();
    
    // Section title
    const title = document.createElement('h3');
    title.className = 'resume-title';
    title.textContent = section.title;
    fragment.appendChild(title);
    
    // Section description
    const description = document.createElement('p');
    description.textContent = section.description;
    fragment.appendChild(description);
    
    // Images
    if (section.images) {
      section.images.forEach(image => {
        const img = document.createElement('img');
        img.src = image.src;
        img.className = 'photo';
        img.alt = image.alt;
        fragment.appendChild(img);
        
        if (image.caption) {
          const caption = document.createElement('p');
          caption.className = 'caption';
          caption.textContent = image.caption;
          fragment.appendChild(caption);
        }
        
        const hr = document.createElement('hr');
        fragment.appendChild(hr);
      });
    }
    
    return fragment;
  }

  /**
   * Render footer
   */
  renderFooter() {
    const footer = this.getText('footer');
    
    const creditsElement = document.querySelector('.credits');
    if (creditsElement) {
      creditsElement.innerHTML = `${footer.credit} <a href="${footer.creditUrl}">${footer.creditText}</a>`;
    }
  }

  /**
   * Update accessibility labels
   */
  updateAccessibilityLabels() {
    const accessibility = this.getText('accessibility');
    
    // // Skip link
    // const skipLink = document.querySelector('.skip-link');
    // if (skipLink) skipLink.textContent = accessibility.skipToMain;
    
    // Mobile nav toggle
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-label', accessibility.toggleNavigation);
    }
    
    // Contrast toggle
    const contrastToggle = document.querySelector('#high-contrast-toggle');
    if (contrastToggle) {
      const isHighContrast = document.body.classList.contains('high-contrast');
      const label = `${accessibility.toggleContrast} (${accessibility.toggleContrastShortcut})`;
      contrastToggle.setAttribute('aria-label', label);
      contrastToggle.setAttribute('title', label);
    }
  }

  /**
   * Setup language switcher
   */
  setupLanguageSwitcher() {
    // Create language switcher if it doesn't exist
    let langSwitcher = document.querySelector('.language-switcher');
    if (!langSwitcher) {
      langSwitcher = document.createElement('div');
      langSwitcher.className = 'language-switcher';
      
      const accessibilityControls = document.querySelector('.accessibility-controls');
      if (accessibilityControls) {
        accessibilityControls.appendChild(langSwitcher);
      }
    }
    
    // Clear existing content
    langSwitcher.innerHTML = '';
    
    // Add language buttons
    this.availableLanguages.forEach(lang => {
      const button = document.createElement('button');
      button.className = 'lang-button';
      button.textContent = this.content.languages[lang];
      button.setAttribute('aria-label', `Switch to ${this.content.languages[lang]}`);
      button.setAttribute('title', `Switch to ${this.content.languages[lang]}`);
      
      if (lang === this.currentLanguage) {
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      } else {
        button.setAttribute('aria-pressed', 'false');
      }
      
      button.addEventListener('click', () => {
        this.switchLanguage(lang);
        this.updateLanguageButtons();
      });
      
      langSwitcher.appendChild(button);
    });
  }

  /**
   * Update language button states
   */
  updateLanguageButtons() {
    const buttons = document.querySelectorAll('.lang-button');
    buttons.forEach((button, index) => {
      const lang = this.availableLanguages[index];
      if (lang === this.currentLanguage) {
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      } else {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
      }
    });
  }
}

// Export for use in main.js
window.ContentManager = ContentManager;