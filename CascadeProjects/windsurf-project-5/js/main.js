// Main JavaScript - Scripts personnalisés

// Badge Hover Animation - Change image AND chat on hover
const badgeData = {
    creativity: {
        image: "images/pastilles/pastille1.png",
        chat: [
            { type: 'user', text: "Crée une plateforme de galerie photo alimentée par l'IA avec génération d'images, édition intelligente et organisation automatique des collections. Design moderne et épuré style PhotoSpace." },
            { type: 'bot', text: "Parfait ! Je crée une interface élégante avec des fonctionnalités IA avancées pour la gestion de photos..." }
        ]
    },
    innovation: {
        image: "images/pastilles/pastille2.png",
        chat: [
            { type: 'user', text: "Développe une application de contrôle d'éclairage intelligent avec interface intuitive, scènes personnalisables et intégration domotique. Style minimaliste comme Lumoo Light." },
            { type: 'bot', text: "Excellent ! Je conçois une app moderne avec des animations fluides pour contrôler l'éclairage..." }
        ]
    },
    strategy: {
        image: "images/pastilles/pastille3.png",
        chat: [
            { type: 'user', text: "Crée une plateforme SaaS de productivité avec IA intégrée, automatisation des tâches et analytics avancés. Design professionnel et moderne style Rypple." },
            { type: 'bot', text: "Génial ! Je développe une interface puissante avec des outils IA pour booster la productivité..." }
        ]
    }
};
const defaultBadge = 'creativity';

const badges = document.querySelectorAll('.badge-hover');
const storyBgImage = document.querySelector('.story-bg-image');
const chatMessagesContainer = document.getElementById('chat-messages');
let chatAnimationTimeout = null;
let isHovering = false;
const hasGsap = typeof window !== 'undefined' && typeof window.gsap !== 'undefined';

function updateImage(imageSrc) {
    if (storyBgImage) {
        if (hasGsap) {
            gsap.to(storyBgImage, {
                opacity: 0,
                scale: 1.05,
                duration: 0.3,
                onComplete: () => {
                    storyBgImage.src = imageSrc;
                    gsap.to(storyBgImage, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.4
                    });
                }
            });
        } else {
            storyBgImage.style.opacity = '0';
            storyBgImage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            storyBgImage.style.transform = 'scale(1.05)';
            setTimeout(() => {
                storyBgImage.src = imageSrc;
                requestAnimationFrame(() => {
                    storyBgImage.style.opacity = '1';
                    storyBgImage.style.transform = 'scale(1)';
                });
            }, 200);
        }
    }
}

function showChat(conversation, animate = true) {
    if (!chatMessagesContainer) return;
    // Clear existing messages
    const existingMessages = chatMessagesContainer.querySelectorAll('.chat-message');
    existingMessages.forEach(msg => msg.remove());
    
    conversation.forEach((message, index) => {
        const element = createMessageElement(message);
        chatMessagesContainer.appendChild(element);
        if (animate) {
            animateMessage(element, index * 400);
        } else {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

function updateBadgeContent(badgeType) {
    const data = badgeData[badgeType];
    if (data) {
        updateImage(data.image);
        showChat(data.chat, true);
    }
}

badges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        const type = badge.dataset.badge;
        if (badgeData[type]) {
            isHovering = true;
            if (chatAnimationTimeout) {
                clearTimeout(chatAnimationTimeout);
                chatAnimationTimeout = null;
            }
            updateBadgeContent(type);
            if (hasGsap) {
                gsap.to(badge, { scale: 1.1, duration: 0.3 });
            } else {
                badge.style.transform = 'scale(1.05)';
            }
        }
    });

    badge.addEventListener('mouseleave', () => {
        isHovering = false;
        if (hasGsap) {
            gsap.to(badge, { scale: 1, duration: 0.3 });
        } else {
            badge.style.transform = 'scale(1)';
        }
        // Restart auto-rotation after a delay
        chatAnimationTimeout = setTimeout(() => {
            if (!isHovering) {
                startChatRotation();
            }
        }, 2000);
    });
});

// Chat Animation - Auto-rotation when not hovering
let currentBadgeIndex = 0;
const badgeTypes = ['creativity', 'innovation', 'strategy'];

function startChatRotation() {
    if (!chatMessagesContainer) return;
    if (isHovering) return;
    
    const badgeType = badgeTypes[currentBadgeIndex];
    updateBadgeContent(badgeType);
    currentBadgeIndex = (currentBadgeIndex + 1) % badgeTypes.length;
    
    chatAnimationTimeout = setTimeout(() => {
        if (!isHovering) {
            startChatRotation();
        }
    }, 5000);
}

function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${message.type}`;
    
    if (message.type === 'bot') {
        messageDiv.innerHTML = `
            <div class="chat-avatar">🤖</div>
            <div class="chat-bubble">${message.text}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="chat-bubble">${message.text}<button class="voir-plus-btn">Voir plus</button></div>
        `;
    }
    
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    return messageDiv;
}

function animateMessage(element, delay) {
    setTimeout(() => {
        if (hasGsap) {
            gsap.to(element, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            });
        } else {
            element.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    }, delay);
}

// Démarrer la rotation automatique
startChatRotation();

function initModularLight() {
    const timeline = document.querySelector('.modular_timeline');
    const progressBar = document.querySelector('.modular_timeline-line');
    
    if (!timeline || !progressBar) return;
    
    let ticking = false;
    
    const updateProgressBar = () => {
        const rect = timeline.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        
        const isInView = rect.bottom > 0 && rect.top < viewportHeight;
        if (!isInView) {
            progressBar.style.height = '0px';
            return;
        }
        
        const progress = Math.min(
            Math.max((viewportHeight * 0.3 - rect.top) / rect.height, 0),
            1
        );
        
        const progressHeight = progress * rect.height;
        progressBar.style.height = `${progressHeight}px`;
    };
    
    const requestTick = () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                updateProgressBar();
                ticking = false;
            });
        }
    };
    
    updateProgressBar();
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
}

function initEnhancements() {
    initModularLight();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancements);
} else {
    initEnhancements();
}

function initModuleInteraction() {
    const moduleListItems = document.querySelectorAll('.module_list-item');
    const moduleDetailCards = document.querySelectorAll('.module_detail-card');
    const moduleSection = document.querySelector('.section_modules');
    
    // Check if elements exist
    if (moduleListItems.length === 0 || moduleDetailCards.length === 0) {
        console.log('Module elements not found, retrying...');
        setTimeout(initModuleInteraction, 100);
        return;
    }

    let currentModuleIndex = 0;
    const totalModules = moduleListItems.length;
    let moduleSwitchCooldown = false;
    let moduleScrollLocked = false;
    let moduleScrollCompleted = false;
    let touchStartY = null;

    function switchModule(moduleId, triggeredByScroll = false) {
        if (!moduleId) return;
        console.log(`Switching to module: ${moduleId} - via ${triggeredByScroll ? 'scroll' : 'click'}`);
        const parsedIndex = parseInt(moduleId, 10) - 1;
        if (!Number.isNaN(parsedIndex)) {
            currentModuleIndex = Math.min(Math.max(parsedIndex, 0), totalModules - 1);
        }

        // Remove active class from all list items and cards
        moduleListItems.forEach(item => item.classList.remove('active'));
        moduleDetailCards.forEach(card => card.classList.remove('active'));
        
        // Add active class to selected list item and corresponding card
        const selectedListItem = document.querySelector(`[data-module="${moduleId}"]`);
        const selectedCard = document.getElementById(`module-${moduleId}`);
        
        console.log('Found elements:', selectedListItem, selectedCard);
        
        if (selectedListItem && selectedCard) {
            selectedListItem.classList.add('active');
            selectedCard.classList.add('active');
            console.log('Module switched successfully');
        } else {
            console.error('Module elements not found for ID:', moduleId);
        }
    }
    
    // Add click event listeners to list items
    moduleListItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const moduleId = this.dataset.module;
            console.log('Clicked module:', moduleId);
            switchModule(moduleId);
            if (!moduleScrollCompleted && moduleSection && isElementMostlyInViewport(moduleSection)) {
                moduleScrollLocked = true;
            }
        });
    });

    function handleModuleScrollDelta(delta) {
        if (moduleSwitchCooldown) return;
        if (delta > 0) {
            if (currentModuleIndex < totalModules - 1) {
                currentModuleIndex += 1;
                switchModule(String(currentModuleIndex + 1), true);
                startModuleCooldown();
                if (currentModuleIndex === totalModules - 1) {
                    moduleScrollCompleted = true;
                }
            } else {
                moduleScrollLocked = false;
            }
        } else if (delta < 0) {
            if (currentModuleIndex > 0) {
                currentModuleIndex -= 1;
                switchModule(String(currentModuleIndex + 1), true);
                startModuleCooldown();
                moduleScrollCompleted = false;
            } else {
                moduleScrollLocked = false;
            }
        }
    }

    function startModuleCooldown() {
        moduleSwitchCooldown = true;
        setTimeout(() => {
            moduleSwitchCooldown = false;
        }, 450);
    }

    function handleWheelScroll(event) {
        if (!moduleScrollLocked) return;
        event.preventDefault();
        handleModuleScrollDelta(event.deltaY);
    }

    function handleTouchStart(event) {
        if (!moduleScrollLocked) return;
        touchStartY = event.touches[0].clientY;
    }

    function handleTouchMove(event) {
        if (!moduleScrollLocked || touchStartY === null) return;
        const currentY = event.touches[0].clientY;
        const delta = touchStartY - currentY;
        if (Math.abs(delta) > 10) {
            event.preventDefault();
            handleModuleScrollDelta(delta);
            touchStartY = currentY;
        }
    }

    function isElementMostlyInViewport(element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const elementCenter = rect.top + rect.height / 2;
        return elementCenter > viewportHeight * 0.15 && elementCenter < viewportHeight * 0.85;
    }

    if (moduleSection && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !moduleScrollCompleted) {
                    moduleScrollLocked = true;
                } else if (!entry.isIntersecting) {
                    moduleScrollLocked = false;
                }
            });
        }, { threshold: 0.6 });
        sectionObserver.observe(moduleSection);
    }

    window.addEventListener('wheel', handleWheelScroll, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Initialize with first module active
    switchModule('1');
    
    console.log('Module interaction initialized');
}

// Try to initialize immediately, and also on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModuleInteraction);
} else {
    initModuleInteraction();
}

// Animated border light effect for method cards
function initMethodCardLights() {
    const methodCards = document.querySelectorAll('.method_step-card');
    
    if (methodCards.length === 0) {
        console.log('No method cards found');
        return;
    }
    
    console.log(`Found ${methodCards.length} method cards`);
    
    function updateCardLights() {
        const scrollY = window.scrollY || window.pageYOffset;
        
        methodCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Check if card is in viewport
            if (rect.top < viewportHeight && rect.bottom > 0) {
                // Calculate how far the card has scrolled through the viewport
                // When card enters from bottom: progress = 0
                // When card is centered: progress = 0.5
                // When card exits from top: progress = 1
                const cardTop = rect.top;
                const cardHeight = rect.height;
                const scrollProgress = Math.max(0, Math.min(1, 
                    (viewportHeight - cardTop) / (viewportHeight + cardHeight)
                ));
                
                // Calculate angle (0deg to 360deg)
                // The light will make a full rotation as the card scrolls through viewport
                const angle = scrollProgress * 360;
                
                // Apply the angle
                card.style.setProperty('--angle', `${angle}deg`);
                
                // Show light when card is visible
                if (scrollProgress > 0.1 && scrollProgress < 0.9) {
                    card.classList.add('light-active');
                } else {
                    card.classList.remove('light-active');
                }
            } else {
                card.classList.remove('light-active');
            }
        });
    }
    
    // Update on scroll with throttle
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateCardLights();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Initial update
    updateCardLights();
    
    console.log('Method card lights initialized');
}

// Initialize method card lights
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMethodCardLights);
} else {
    initMethodCardLights();
}

// Animated border light effect for modular cards
function initModularCardLights() {
    const modularCards = document.querySelectorAll('.modular_card');
    
    if (modularCards.length === 0) {
        console.log('No modular cards found');
        return;
    }
    
    console.log(`Found ${modularCards.length} modular cards`);
    
    function updateCardLights() {
        modularCards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            if (rect.top < viewportHeight && rect.bottom > 0) {
                const cardTop = rect.top;
                const cardHeight = rect.height;
                const scrollProgress = Math.max(0, Math.min(1, 
                    (viewportHeight - cardTop) / (viewportHeight + cardHeight)
                ));
                
                const angle = scrollProgress * 360;
                card.style.setProperty('--angle', `${angle}deg`);
                
                if (scrollProgress > 0.1 && scrollProgress < 0.9) {
                    card.classList.add('light-active');
                } else {
                    card.classList.remove('light-active');
                }
            } else {
                card.classList.remove('light-active');
            }
        });
    }
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateCardLights();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    updateCardLights();
    console.log('Modular card lights initialized');
}

// Initialize modular card lights
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModularCardLights);
} else {
    initModularCardLights();
}

// Animated border light effect for testimonial cards
function initTestimonialCardLights() {
    const testimonialCards = document.querySelectorAll('.testimonial-scroll-card');
    
    if (testimonialCards.length === 0) {
        console.log('No testimonial cards found');
        return;
    }
    
    console.log(`Found ${testimonialCards.length} testimonial cards`);
    
    function updateCardLights() {
        testimonialCards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            if (rect.top < viewportHeight && rect.bottom > 0) {
                const cardTop = rect.top;
                const cardHeight = rect.height;
                const scrollProgress = Math.max(0, Math.min(1, 
                    (viewportHeight - cardTop) / (viewportHeight + cardHeight)
                ));
                
                const angle = scrollProgress * 360;
                card.style.setProperty('--angle', `${angle}deg`);
                
                if (scrollProgress > 0.1 && scrollProgress < 0.9) {
                    card.classList.add('light-active');
                } else {
                    card.classList.remove('light-active');
                }
            } else {
                card.classList.remove('light-active');
            }
        });
    }
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateCardLights();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    updateCardLights();
    console.log('Testimonial card lights initialized');
}

// Initialize testimonial card lights
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonialCardLights);
} else {
    initTestimonialCardLights();
}

// Generate Trustpilot-style stars
function initTrustpilotStars() {
    const starContainers = document.querySelectorAll('.testimonial-scroll-role');
    
    starContainers.forEach(container => {
        // Create 5 stars
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('span');
            star.className = 'trustpilot-star';
            star.textContent = '★';
            container.appendChild(star);
        }
    });
    
    console.log(`Generated Trustpilot stars for ${starContainers.length} testimonials`);
}

// Initialize Trustpilot stars
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrustpilotStars);
} else {
    initTrustpilotStars();
}

// Animated border light effect for applications showcase
function initApplicationsShowcaseLight() {
    const appShowcases = document.querySelectorAll('.applications_showcase');
    
    if (appShowcases.length === 0) {
        console.log('No applications showcases found');
        return;
    }
    
    console.log(`Applications showcases found: ${appShowcases.length}`);
    
    function updateShowcaseLight() {
        const viewportHeight = window.innerHeight;

        appShowcases.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            
            if (rect.top < viewportHeight && rect.bottom > 0) {
                const cardTop = rect.top;
                const cardHeight = rect.height;
                const scrollProgress = Math.max(0, Math.min(1,
                    (viewportHeight - cardTop) / (viewportHeight + cardHeight)
                ));
                
                const angle = scrollProgress * 360;
                card.style.setProperty('--angle', `${angle}deg`);

                if (scrollProgress > 0.1 && scrollProgress < 0.9) {
                    card.classList.add('light-active');
                } else {
                    card.classList.remove('light-active');
                }

                // Reveal hidden card when it enters viewport
                if (card.classList.contains('is-hidden') && scrollProgress > 0.1) {
                    card.classList.remove('is-hidden');
                    card.classList.add('is-visible');
                }
            } else {
                card.classList.remove('light-active');
            }
        });
    }
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateShowcaseLight();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    updateShowcaseLight();
    console.log('Applications showcase light initialized');
}

// Initialize applications showcase light
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApplicationsShowcaseLight);
} else {
    initApplicationsShowcaseLight();
}

// Animated border light effect for hero video placeholder
function initHeroVideoLight() {
    const heroVideo = document.querySelector('.hero_video-wrapper');

    if (!heroVideo) {
        console.log('No hero video placeholder found');
        return;
    }

    console.log('Hero video placeholder found');

    function updateHeroLight() {
        const rect = heroVideo.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (rect.top < viewportHeight && rect.bottom > 0) {
            const cardTop = rect.top;
            const cardHeight = rect.height;
            const scrollProgress = Math.max(0, Math.min(1,
                (viewportHeight - cardTop) / (viewportHeight + cardHeight)
            ));

            const angle = scrollProgress * 360;
            heroVideo.style.setProperty('--angle', `${angle}deg`);

            if (scrollProgress > 0.1 && scrollProgress < 0.9) {
                heroVideo.classList.add('light-active');
            } else {
                heroVideo.classList.remove('light-active');
            }
        } else {
            heroVideo.classList.remove('light-active');
        }
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateHeroLight();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    updateHeroLight();
    console.log('Hero video light initialized');
}

// Initialize hero video light
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroVideoLight);
} else {
    initHeroVideoLight();
}

// GSAP ScrollTrigger animation for method cards - Stacking effect (Nexark style)
function initMethodCardsScrollAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    const methodCards = document.querySelectorAll('.method_step-card');
    const methodSection = document.querySelector('.section_method');
    const stepsGrid = document.querySelector('.method_steps-grid');

    if (methodCards.length === 0 || !methodSection || !stepsGrid) {
        console.log('Method cards or section not found for GSAP animation');
        return;
    }

    // Kill previous triggers for this animation only
    ScrollTrigger.getAll()
        .filter(t => (t.vars?.id || '').startsWith('card-'))
        .forEach(t => t.kill());

    console.log(`Initializing stacking cards animation for ${methodCards.length} method cards`);

    // Configuration
    const headerOffset = 100;
    const cardSpacing = 30;

    // Set z-index for proper stacking (later cards on top)
    methodCards.forEach((card, index) => {
        card.style.zIndex = index + 1;
    });

    // Measure max height across cards (fallback to 420 if images not loaded yet)
    const cardHeights = Array.from(methodCards).map(c => c.getBoundingClientRect().height || 0);
    const cardHeight = Math.max(420, ...cardHeights);
    const totalStackTravel = (cardHeight + cardSpacing) * (methodCards.length - 1);

    // Reduce extra void: minimal safety padding (just one gap)
    const minimalPadding = Math.max(0, cardSpacing);
    stepsGrid.style.paddingBottom = `${minimalPadding}px`;

    // Create ScrollTrigger for each card except the last
    methodCards.forEach((card, index) => {
        const topPosition = headerOffset + (index * cardSpacing);

        if (index < methodCards.length - 1) {
            const remainingCards = methodCards.length - 1 - index;
            // Ensure unpin before end of stack: remaining travel after this card's start
            const pinDuration = Math.max(
                0,
                totalStackTravel - (index * (cardHeight + cardSpacing))
            );

            ScrollTrigger.create({
                trigger: card,
                start: `top ${topPosition}px`,
                end: `+=${pinDuration}`,
                pin: true,
                pinSpacing: false,
                markers: false,
                id: `card-${index}`,
                invalidateOnRefresh: true
            });
        }
    });

    // Force recalculation after a short delay to ensure layout is stable
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
    
    console.log('Stacking cards animation initialized');
}

// Initialize GSAP animation and refresh after assets load
function setupMethodCardsAnimation() {
    initMethodCardsScrollAnimation();
    
    // Refresh after images/fonts load
    window.addEventListener('load', () => {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 200);
    });
    
    window.addEventListener('resize', gsap.utils.debounce(initMethodCardsScrollAnimation, 200));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMethodCardsAnimation);
} else {
    setupMethodCardsAnimation();
}

// Ensure Stripe ticker loops seamlessly without gaps
function initStripeTickerLoop() {
    const tickerList = document.querySelector('.stripe_ticker-list');
    if (!tickerList) return;

    const items = Array.from(tickerList.children);
    if (items.length === 0) return;

    // Duplicate entire set to make a seamless loop
    items.forEach(item => {
        tickerList.appendChild(item.cloneNode(true));
    });

    // Adjust speed relative to content length
    const totalItems = tickerList.children.length;
    const durationSeconds = Math.max(12, totalItems * 2.5); // slower when more items
    tickerList.style.setProperty('--ticker-duration', `${durationSeconds}s`);
    tickerList.style.setProperty('--ticker-translate', '-50%');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStripeTickerLoop);
} else {
    initStripeTickerLoop();
}
