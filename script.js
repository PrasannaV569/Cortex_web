document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Reveal Animations on Scroll (Exclude Hero intro elements)
    const revealElements = document.querySelectorAll('section:not(.hero) .reveal-up, section:not(.hero) .reveal-left, section:not(.hero) .reveal-right, section:not(.hero) .reveal-scale');

    const revealObserverOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed navbar height
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero Intro Sequence
    const heroSection = document.getElementById('home');
    const typingIndicator = document.getElementById('intro-typing-indicator');
    const typingTextEl = document.getElementById('intro-typing-text');
    const taskDemo = document.getElementById('intro-task-demo');
    const mockup = document.querySelector('.hero-visual .mockup');

    if (heroSection && typingTextEl && heroSection.classList.contains('intro-state-1')) {
        // Wait to add active classes until the "throw" to avoid premature animations

        const fullText = "Hello! I'm Cortex. Waiting for your command...";
        let charIndex = 0;

        // 1. Start typing after a short delay
        setTimeout(() => {
            if (typingIndicator) typingIndicator.style.display = 'none';

            const typeInterval = setInterval(() => {
                typingTextEl.textContent += fullText.charAt(charIndex);
                charIndex++;

                if (charIndex >= fullText.length) {
                    clearInterval(typeInterval);

                    // 2. Show "Data loading complete"
                    setTimeout(() => {
                        if (taskDemo) {
                            taskDemo.style.transition = 'opacity 0.6s ease';
                            taskDemo.style.opacity = '1';
                        }

                        // 3. Slide panel to the right after 1s
                        setTimeout(() => {
                            heroSection.classList.remove('intro-state-1');

                            // 4. Once panel is set (after 1s slide), start the big reveal
                            setTimeout(() => {
                                const loadingCard = document.getElementById('task-data-loading');
                                const heroGhost = document.getElementById('hero-ghost');
                                const heroMainContent = document.getElementById('hero-main-content');
                                const sequenceCards = document.querySelectorAll('.sequence-card');

                                if (loadingCard && heroGhost && heroMainContent) {
                                    // 4. Wait 200ms after panel sliding is fully complete before starting migration
                                    setTimeout(() => {
                                        // 5. Ghost Migration: Get precise coordinates using Transforms
                                        const mockRect = loadingCard.getBoundingClientRect();
                                        const heroRect = heroSection.getBoundingClientRect();

                                        // Start ghost exactly at mockup card's position inside the viewport
                                        const startX = mockRect.left - heroRect.left;
                                        const startY = mockRect.top - heroRect.top;

                                        // Set initial position instantly without transition
                                        heroGhost.style.transition = 'none';
                                        heroGhost.style.transform = `translate(${startX}px, ${startY}px)`;
                                        heroGhost.style.opacity = '1';

                                        // Hide original mockup card instantly
                                        loadingCard.style.display = 'none';

                                        // Calculate destination (center of left content box)
                                        const destRect = heroMainContent.getBoundingClientRect();
                                        const destX = destRect.left - heroRect.left + (destRect.width / 2) - (mockRect.width / 2);
                                        const destY = destRect.top - heroRect.top + (destRect.height / 2) - (mockRect.height / 2);

                                        // Force reflow right before animating to ensure initial transform is applied instantly
                                        void heroGhost.offsetWidth;

                                        // Animate Ghost to the left using restored transition (Faster)
                                        heroGhost.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.3s ease';
                                        heroGhost.style.transform = `translate(${destX}px, ${destY}px)`;

                                        // 6. Wait for Ghost to arrive (Faster)
                                        setTimeout(() => {
                                            // Immediately fade out the ghost text card before expansion begins
                                            const ghostCard = heroGhost.querySelector('.ghost-card');
                                            if (ghostCard) {
                                                ghostCard.style.transition = 'opacity 0.2s ease';
                                                ghostCard.style.opacity = '0';
                                            }

                                            // 7. Container Expansion
                                            const expansionBox = heroGhost.querySelector('.ghost-expansion-box');
                                            if (expansionBox) {
                                                expansionBox.style.opacity = '1';

                                                // Reset any inline transform so CSS handles centering
                                                expansionBox.style.transform = '';

                                                expansionBox.style.width = `${destRect.width + 60}px`; // Match left content perfectly + padding
                                                expansionBox.style.height = `${destRect.height + 60}px`; // Match left content perfectly + padding
                                            }

                                            // 8. Wait for expansion, then Reveal Content (Faster)
                                            setTimeout(() => {
                                                // Fade out ghost box entirely, instantly without any transition
                                                heroGhost.style.transition = 'none';
                                                heroGhost.style.opacity = '0';
                                                heroGhost.style.display = 'none';

                                                // Ensure the main content animations start now
                                                document.querySelectorAll('.hero .reveal-scale').forEach(el => el.classList.add('active'));
                                                document.querySelectorAll('.hero .reveal-up').forEach(el => el.classList.add('active'));
                                                heroMainContent.classList.add('revealed');

                                                // Start Sequence Cards in mockup
                                                sequenceCards.forEach((card, index) => {
                                                    setTimeout(() => {
                                                        card.style.display = 'flex';
                                                        card.style.opacity = '0';
                                                        card.animate([
                                                            { opacity: 0, transform: 'translateY(10px)' },
                                                            { opacity: 1, transform: 'translateY(0)' }
                                                        ], { duration: 300, fill: 'forwards' });
                                                    }, index * 200);
                                                });

                                                // 9. Finalize
                                                setTimeout(() => {
                                                    heroSection.classList.add('intro-complete');
                                                    if (mockup) {
                                                        mockup.classList.add('glitch-effect');
                                                        setTimeout(() => mockup.classList.remove('glitch-effect'), 600);
                                                    }
                                                }, (sequenceCards.length * 200) + 300);

                                            }, 500); // Time for expansion box to grow matches CSS transition
                                        }, 500); // Time for migration to finish matches CSS transition
                                    }, 200); // 200ms delay AFTER panel finishes sliding
                                }
                            }, 1000); // Time for the slide transition to finish

                        }, 400); // Time to look at "Data loading complete" before slide

                    }, 200); // Wait after typing finishes
                }
            }, 20); // Typing speed
        }, 400); // Initial delay to show just the panel
    } else {
        // Fallback for immediate animation
        setTimeout(() => {
            document.querySelectorAll('.hero .reveal-up, .hero .reveal-scale').forEach(el => {
                el.classList.add('active');
            });
        }, 100);
    }

    // 5. GUI Showcase Tab Switching
    const guiTabs = document.querySelectorAll('.gui-tab');
    const guiPanels = document.querySelectorAll('.gui-panel');
    const tabIndicator = document.querySelector('.gui-tab-indicator');

    function updateIndicator(tab) {
        if (!tabIndicator || !tab) return;
        tabIndicator.style.width = `${tab.offsetWidth}px`;
        tabIndicator.style.height = `${tab.offsetHeight}px`;
        tabIndicator.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop}px)`;
    }

    const activeTab = document.querySelector('.gui-tab.active');
    if (activeTab) {
        setTimeout(() => updateIndicator(activeTab), 100);
        window.addEventListener('resize', () => updateIndicator(document.querySelector('.gui-tab.active')));
    }

    guiTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            // Remove active from all tabs and panels
            guiTabs.forEach(t => t.classList.remove('active'));
            guiPanels.forEach(p => p.classList.remove('active'));

            // Activate selected
            tab.classList.add('active');
            updateIndicator(tab);

            const targetPanel = document.getElementById('tab-' + target);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // 6. 3D Tilt Effect on GUI Panel Images
    const guiImages = document.querySelectorAll('.gui-panel-img');
    guiImages.forEach(imgContainer => {
        imgContainer.addEventListener('mousemove', (e) => {
            const rect = imgContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPct = x / rect.width - 0.5;
            const yPct = y / rect.height - 0.5;

            const tiltX = yPct * -15; // Max 15 degree tilt
            const tiltY = xPct * 15;

            imgContainer.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
            imgContainer.style.transition = 'transform 0.1s ease-out';
        });

        imgContainer.addEventListener('mouseleave', () => {
            imgContainer.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
            imgContainer.style.transition = 'transform 0.5s ease-out';
        });
    });
});

