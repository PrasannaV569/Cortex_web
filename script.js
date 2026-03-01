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

    // 3. Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

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

    // Add initial active class to hero elements for immediate animation on load
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal-up, .hero .reveal-scale').forEach(el => {
            el.classList.add('active');
        });
    }, 100);

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

