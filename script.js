// Global content storage
let siteContent = {};

// Load all JSON content files
async function loadContent() {
    try {
        const contentResponse = await fetch('content/content.json');
        const uiResponse = await fetch('content/ui-text.json');
        const testimonialsResponse = await fetch('content/testimonials.json');
        
        siteContent.main = await contentResponse.json();
        siteContent.ui = await uiResponse.json();
        siteContent.testimonials = await testimonialsResponse.json();
        
        // Initialize page content
        initializePage();
    } catch (error) {
        console.error('Error loading content:', error);
        // Fallback content if JSON files fail to load
        loadFallbackContent();
    }
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page.replace('.html', '');
}

// Initialize page-specific content
function initializePage() {
    const currentPage = getCurrentPage();
    
    // Load navigation for all pages
    loadNavigation();
    
    // Load footer for all pages
    loadFooter();
    
    // Load page-specific content
    switch (currentPage) {
        case 'index':
        case '':
            loadHomePage();
            break;
        case 'about':
            loadAboutPage();
            break;
        case 'testimonials':
            loadTestimonialsPage();
            break;
        case 'book':
            loadBookPage();
            break;
    }
}

// Load navigation
function loadNavigation() {
    const logoElement = document.getElementById('logo-text');
    const navMenu = document.getElementById('nav-menu');
    
    if (logoElement && siteContent.ui) {
        logoElement.textContent = siteContent.ui.logo;
    }
    
    if (navMenu && siteContent.ui && siteContent.ui.navigation) {
        navMenu.innerHTML = '';
        siteContent.ui.navigation.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${item.href}" class="nav-text">${item.text}</a>`;
            navMenu.appendChild(li);
        });
    }
}

// Load footer
function loadFooter() {
    const footerText = document.getElementById('footer-text');
    if (footerText && siteContent.main && siteContent.main.footer) {
        footerText.textContent = siteContent.main.footer.text;
    }
}

// Load homepage content
function loadHomePage() {
    if (!siteContent.main) return;
    
    // Hero section
    const heroCatchphrase = document.getElementById('hero-catchphrase');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroCatchphrase) heroCatchphrase.textContent = siteContent.main.hero.catchphrase;
    if (heroSubtitle) heroSubtitle.textContent = siteContent.main.hero.subtitle;
    
    // Book CTA section
    const bookCtaTitle = document.getElementById('book-cta-title');
    const bookCtaDescription = document.getElementById('book-cta-description');
    const bookCtaButton = document.getElementById('book-cta-button');
    
    if (bookCtaTitle) bookCtaTitle.textContent = siteContent.main.sections.book_cta.title;
    if (bookCtaDescription) bookCtaDescription.textContent = siteContent.main.sections.book_cta.description;
    if (bookCtaButton) bookCtaButton.textContent = siteContent.main.sections.book_cta.button_text;
    
    // Section titles
    const testimonialsSectionTitle = document.getElementById('testimonials-section-title');
    const whoIsTitle = document.getElementById('who-is-title');
    const galleryTitle = document.getElementById('gallery-title');
    
    if (testimonialsSectionTitle && siteContent.ui) {
        testimonialsSectionTitle.textContent = siteContent.ui.section_titles.testimonials;
    }
    if (whoIsTitle) whoIsTitle.textContent = siteContent.main.sections.who_is.title;
    if (galleryTitle) galleryTitle.textContent = siteContent.main.sections.gallery.title;
    
    // Who is section
    const whoIsDescription = document.getElementById('who-is-description');
    if (whoIsDescription) whoIsDescription.textContent = siteContent.main.sections.who_is.description;
    
    // Final CTA
    const finalCtaTitle = document.getElementById('final-cta-title');
    const finalCtaButton = document.getElementById('final-cta-button');
    
    if (finalCtaTitle) finalCtaTitle.textContent = siteContent.main.sections.final_cta.title;
    if (finalCtaButton) finalCtaButton.textContent = siteContent.main.sections.final_cta.button_text;
    
    // Load testimonials
    loadTestimonials();
    
    // Load gallery
    loadGallery();
}

// Testimonials rotation state
let currentTestimonialIndex = 0;
let testimonialsRotationInterval = null;

// Load testimonials for homepage with rotation
function loadTestimonials() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (!testimonialsContainer || !siteContent.testimonials) return;
    
    // Create all testimonial cards initially hidden
    testimonialsContainer.innerHTML = '';
    
    siteContent.testimonials.testimonials.forEach((testimonial, index) => {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = `testimonial-card ${index < 3 ? 'visible' : 'hidden'}`;
        testimonialCard.innerHTML = `
            <p class="testimonial-quote quote-text">"${testimonial.quote}"</p>
            <div class="testimonial-author">${testimonial.name}</div>
            <div class="testimonial-title">${testimonial.title}</div>
        `;
        testimonialsContainer.appendChild(testimonialCard);
    });
    
    // Start auto-rotation if on homepage
    if (getCurrentPage() === 'index' || getCurrentPage() === '') {
        startTestimonialsRotation();
    }
}

// Start testimonials auto-rotation
function startTestimonialsRotation() {
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (!testimonialsContainer || !siteContent.testimonials) return;
    
    const totalTestimonials = siteContent.testimonials.testimonials.length;
    const visibleCount = 3;
    
    // Clear any existing interval
    if (testimonialsRotationInterval) {
        clearInterval(testimonialsRotationInterval);
    }
    
    // Rotate every 5 seconds
    testimonialsRotationInterval = setInterval(() => {
        const testimonialCards = testimonialsContainer.querySelectorAll('.testimonial-card');
        
        // Hide all cards first
        testimonialCards.forEach(card => {
            card.classList.remove('visible');
            card.classList.add('hidden');
        });
        
        // Show next set of 3 testimonials
        for (let i = 0; i < visibleCount; i++) {
            const index = (currentTestimonialIndex + i) % totalTestimonials;
            if (testimonialCards[index]) {
                testimonialCards[index].classList.remove('hidden');
                testimonialCards[index].classList.add('visible');
            }
        }
        
        // Update index for next rotation
        currentTestimonialIndex = (currentTestimonialIndex + visibleCount) % totalTestimonials;
    }, 5000); // 5 second intervals
}

// Stop testimonials rotation (useful when user interacts)
function stopTestimonialsRotation() {
    if (testimonialsRotationInterval) {
        clearInterval(testimonialsRotationInterval);
        testimonialsRotationInterval = null;
    }
}

// Load gallery for homepage
function loadGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    if (!galleryContainer || !siteContent.testimonials) return;
    
    galleryContainer.innerHTML = '';
    
    siteContent.testimonials.gallery_items.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${item.image}" alt="${item.caption}" />
            <div class="gallery-item-content">
                <p>${item.caption}</p>
            </div>
        `;
        galleryContainer.appendChild(galleryItem);
    });
}

// Load about page content
function loadAboutPage() {
    if (!siteContent.main || !siteContent.main.about) return;
    
    const about = siteContent.main.about;
    
    // Hero section
    const aboutTitle = document.getElementById('about-title');
    const aboutSubtitle = document.getElementById('about-subtitle');
    
    if (aboutTitle) aboutTitle.textContent = about.title;
    if (aboutSubtitle) aboutSubtitle.textContent = about.subtitle;
    
    // Bio section
    const aboutBio = document.getElementById('about-bio');
    const aboutPhoto = document.getElementById('about-photo');
    
    if (aboutBio) {
        aboutBio.innerHTML = '';
        about.bio_paragraphs.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            aboutBio.appendChild(p);
        });
    }
    
    if (aboutPhoto) aboutPhoto.src = about.photo;
    
    // Experience section
    const experienceTitle = document.getElementById('experience-title');
    const experienceContainer = document.getElementById('experience-container');
    
    if (experienceTitle && siteContent.ui) {
        experienceTitle.textContent = siteContent.ui.section_titles.experience;
    }
    
    if (experienceContainer && siteContent.main.experience) {
        experienceContainer.innerHTML = '';
        siteContent.main.experience.forEach(item => {
            const expItem = document.createElement('div');
            expItem.className = 'experience-item';
            expItem.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            `;
            experienceContainer.appendChild(expItem);
        });
    }
    
    // Credentials section
    const credentialsTitle = document.getElementById('credentials-title');
    const credentialsContainer = document.getElementById('credentials-container');
    
    if (credentialsTitle && siteContent.ui) {
        credentialsTitle.textContent = siteContent.ui.section_titles.credentials;
    }
    
    if (credentialsContainer && siteContent.main.credentials) {
        credentialsContainer.innerHTML = '';
        siteContent.main.credentials.forEach(credential => {
            const credItem = document.createElement('div');
            credItem.className = 'credential-item';
            credItem.innerHTML = `<p>${credential}</p>`;
            credentialsContainer.appendChild(credItem);
        });
    }
    
    // CTA section
    const aboutCtaTitle = document.getElementById('about-cta-title');
    const aboutCtaDescription = document.getElementById('about-cta-description');
    const aboutCtaButton = document.getElementById('about-cta-button');
    
    if (aboutCtaTitle) aboutCtaTitle.textContent = about.cta.title;
    if (aboutCtaDescription) aboutCtaDescription.textContent = about.cta.description;
    if (aboutCtaButton) aboutCtaButton.textContent = about.cta.button_text;
}

// Load testimonials page content
function loadTestimonialsPage() {
    if (!siteContent.main || !siteContent.testimonials) return;
    
    const testimonialsPage = siteContent.main.testimonials_page;
    
    // Hero section
    const pageTitle = document.getElementById('testimonials-page-title');
    const pageSubtitle = document.getElementById('testimonials-page-subtitle');
    
    if (pageTitle) pageTitle.textContent = testimonialsPage.title;
    if (pageSubtitle) pageSubtitle.textContent = testimonialsPage.subtitle;
    
    // All testimonials
    const allTestimonialsContainer = document.getElementById('all-testimonials-container');
    if (allTestimonialsContainer) {
        allTestimonialsContainer.innerHTML = '';
        siteContent.testimonials.testimonials.forEach(testimonial => {
            const testimonialCard = document.createElement('div');
            testimonialCard.className = 'testimonial-card';
            testimonialCard.innerHTML = `
                <p class="testimonial-quote quote-text">"${testimonial.quote}"</p>
                <div class="testimonial-author">${testimonial.name}</div>
                <div class="testimonial-title">${testimonial.title}</div>
            `;
            allTestimonialsContainer.appendChild(testimonialCard);
        });
    }
    
    // Philosophy section
    const philosophyTitle = document.getElementById('philosophy-title');
    const philosophyText = document.getElementById('philosophy-text');
    
    if (philosophyTitle) philosophyTitle.textContent = siteContent.main.philosophy.title;
    if (philosophyText) philosophyText.textContent = siteContent.main.philosophy.content;
    
    // Video testimonials
    const videoTestimonialsTitle = document.getElementById('video-testimonials-title');
    const videoTestimonialsContainer = document.getElementById('video-testimonials-container');
    
    if (videoTestimonialsTitle && siteContent.ui) {
        videoTestimonialsTitle.textContent = siteContent.ui.section_titles.video_testimonials;
    }
    
    if (videoTestimonialsContainer && siteContent.testimonials.video_testimonials) {
        videoTestimonialsContainer.innerHTML = '';
        siteContent.testimonials.video_testimonials.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-testimonial-item';
            videoItem.innerHTML = `
                <video controls>
                    <source src="${video.video_url}" type="video/mp4">
                </video>
                <h4>${video.name}</h4>
                <p>${video.title}</p>
            `;
            videoTestimonialsContainer.appendChild(videoItem);
        });
    }
    
    // CTA section
    const testimonialsCtaTitle = document.getElementById('testimonials-cta-title');
    const testimonialsCtaDescription = document.getElementById('testimonials-cta-description');
    const testimonialsCtaButton = document.getElementById('testimonials-cta-button');
    
    if (testimonialsCtaTitle) testimonialsCtaTitle.textContent = testimonialsPage.cta.title;
    if (testimonialsCtaDescription) testimonialsCtaDescription.textContent = testimonialsPage.cta.description;
    if (testimonialsCtaButton) testimonialsCtaButton.textContent = testimonialsPage.cta.button_text;
}

// Load book page content
function loadBookPage() {
    if (!siteContent.main || !siteContent.ui) return;
    
    const booking = siteContent.main.booking;
    
    // Hero section
    const bookTitle = document.getElementById('book-title');
    const bookSubtitle = document.getElementById('book-subtitle');
    
    if (bookTitle) bookTitle.textContent = booking.title;
    if (bookSubtitle) bookSubtitle.textContent = booking.subtitle;
    
    // Booking info
    const bookingInfoTitle = document.getElementById('booking-info-title');
    const bookingInfoContent = document.getElementById('booking-info-content');
    
    if (bookingInfoTitle) bookingInfoTitle.textContent = booking.info_title;
    if (bookingInfoContent) {
        bookingInfoContent.innerHTML = '';
        booking.info_content.forEach(info => {
            const p = document.createElement('p');
            p.textContent = info;
            bookingInfoContent.appendChild(p);
        });
    }
    
    // Form
    const formTitle = document.getElementById('form-title');
    if (formTitle) formTitle.textContent = booking.form_title;
    
    // Form labels
    const labels = siteContent.ui.form_labels;
    Object.keys(labels).forEach(key => {
        const element = document.getElementById(`${key}-label`);
        if (element) element.textContent = labels[key];
    });
    
    // Event type options
    const eventTypeSelect = document.getElementById('event-type');
    if (eventTypeSelect && siteContent.ui.event_types) {
        siteContent.ui.event_types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            eventTypeSelect.appendChild(option);
        });
    }
    
    // Submit button
    const submitButton = document.getElementById('submit-button');
    if (submitButton) submitButton.textContent = labels.submit;
    
    // Speaking topics
    const topicsTitle = document.getElementById('topics-title');
    const topicsContainer = document.getElementById('topics-container');
    
    if (topicsTitle && siteContent.ui) {
        topicsTitle.textContent = siteContent.ui.section_titles.topics;
    }
    
    if (topicsContainer && siteContent.main.speaking_topics) {
        topicsContainer.innerHTML = '';
        siteContent.main.speaking_topics.forEach(topic => {
            const topicItem = document.createElement('div');
            topicItem.className = 'topic-item';
            topicItem.innerHTML = `
                <h4>${topic.title}</h4>
                <p>${topic.description}</p>
            `;
            topicsContainer.appendChild(topicItem);
        });
    }
}

// Fallback content if JSON files fail to load
function loadFallbackContent() {
    console.log('Loading fallback content...');
    
    // Basic fallback for hero
    const heroCatchphrase = document.getElementById('hero-catchphrase');
    const heroSubtitle = document.getElementById('hero-subtitle');
    
    if (heroCatchphrase) heroCatchphrase.textContent = 'Transform Your Leadership, Transform Your Business';
    if (heroSubtitle) heroSubtitle.textContent = 'Keynote speaker inspiring teams across the globe';
    
    // Basic navigation fallback
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
        navMenu.innerHTML = `
            <li><a href="index.html" class="nav-text">Home</a></li>
            <li><a href="about.html" class="nav-text">About</a></li>
            <li><a href="testimonials.html" class="nav-text">Testimonials</a></li>
            <li><a href="book.html" class="nav-text">Book Now</a></li>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    
    // Form submission handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your inquiry! We will contact you soon.');
            // Here you would typically send the form data to a server
        });
    }
    
    // Pause testimonials rotation when user hovers over testimonials section
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (testimonialsContainer) {
        testimonialsContainer.addEventListener('mouseenter', stopTestimonialsRotation);
        testimonialsContainer.addEventListener('mouseleave', () => {
            if (getCurrentPage() === 'index' || getCurrentPage() === '') {
                startTestimonialsRotation();
            }
        });
    }
});

// Clean up intervals when page unloads
window.addEventListener('beforeunload', function() {
    stopTestimonialsRotation();
});