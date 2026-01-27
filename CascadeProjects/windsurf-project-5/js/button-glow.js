// Button glow animation on scroll
function initButtonGlowAnimation() {
    const buttons = document.querySelectorAll('.primary-button, .secondary-button');
    
    if (buttons.length === 0) {
        console.log('No primary buttons found for glow animation');
        return;
    }

    function updateButtonGlow() {
        buttons.forEach(button => {
            const rect = button.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Check if button is in viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
                
                // Angle driven by scroll position to keep rotating even for fixed elements
                const angle = (window.scrollY * 0.4) % 360;
                button.style.setProperty('--angle', `${angle}deg`);
                
                // Show light whenever the button is in viewport (no tight threshold to cover nav CTA)
                button.classList.add('light-active');
            } else {
                button.classList.remove('light-active');
            }
        });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateButtonGlow();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    updateButtonGlow();
    console.log(`Button glow animation initialized for ${buttons.length} buttons`);
}

// Initialize button glow animation
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initButtonGlowAnimation);
} else {
    initButtonGlowAnimation();
}
