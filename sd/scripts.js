/* ===== SHARED JAVASCRIPT FOR ALL AQUASAFE PAGES ===== */

// Mobile Navigation Toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('mobile-open');
}

// Testimonial functionality - used on all pages
let testimonialIndex = 1;
const totalTestimonials = 3;

function showTestimonial(n) {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    
    if (n > totalTestimonials) testimonialIndex = 1;
    if (n < 1) testimonialIndex = totalTestimonials;
    
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    testimonials[testimonialIndex - 1].classList.add('active');
    dots[testimonialIndex - 1].classList.add('active');
}

function currentTestimonial(n) {
    testimonialIndex = n;
    showTestimonial(testimonialIndex);
}

function nextTestimonial() {
    testimonialIndex++;
    showTestimonial(testimonialIndex);
}

// Auto-rotate testimonials every 5 seconds
setInterval(nextTestimonial, 5000);

// Back to top button functionality
window.addEventListener('scroll', function() {
    const backToTop = document.querySelector('.back-to-top');
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Calculate years in business dynamically
function updateYearsInBusiness() {
    const foundingYear = 1991;
    const currentYear = new Date().getFullYear();
    const yearsInBusiness = currentYear - foundingYear;
    
    const element = document.getElementById('years-in-business');
    if (element) {
        element.textContent = yearsInBusiness;
    }
}

// Update years in business when page loads
document.addEventListener('DOMContentLoaded', updateYearsInBusiness);

// Smooth scrolling for navigation links - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Check if href is just '#' or empty - if so, don't try to scroll
            if (href === '#' || href === '' || href.length <= 1) {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});