/* ============================================
   JeLanceMonApp.fr - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initAccordion();
    initFAQ();
    initScrollAnimations();
});

/* ============================================
   Navbar Scroll Effect
   ============================================ */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ============================================
   Mobile Menu Toggle
   ============================================ */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = menu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
}

/* ============================================
   Program Accordion
   ============================================ */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        if (!header) return;
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            accordionItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* ============================================
   FAQ Toggle
   ============================================ */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* ============================================
   Scroll Animations
   ============================================ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   Smooth Scroll for Anchor Links
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ============================================
   Form Validation (for contact page)
   ============================================ */
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        if (isValid) {
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'form-success';
            successMsg.textContent = 'Message envoyé avec succès !';
            form.appendChild(successMsg);
            
            // Reset form
            form.reset();
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMsg.remove();
            }, 3000);
        }
    });
}

/* ============================================
   Newsletter Form
   ============================================ */
function initNewsletter() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]');
            
            if (email && email.value.trim()) {
                // Show success
                const btn = form.querySelector('button');
                const originalText = btn.textContent;
                btn.textContent = 'Inscrit !';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    email.value = '';
                }, 2000);
            }
        });
    });
}

// Initialize newsletter on load
document.addEventListener('DOMContentLoaded', initNewsletter);
