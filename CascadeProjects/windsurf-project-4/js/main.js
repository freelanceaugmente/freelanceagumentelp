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

function updateImage(imageSrc) {
    if (storyBgImage) {
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
    }
}

function showChat(conversation, animate = true) {
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
            gsap.to(badge, { scale: 1.1, duration: 0.3 });
        }
    });

    badge.addEventListener('mouseleave', () => {
        isHovering = false;
        gsap.to(badge, { scale: 1, duration: 0.3 });
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
        gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
        });
    }, delay);
}

// Démarrer la rotation automatique
startChatRotation();
