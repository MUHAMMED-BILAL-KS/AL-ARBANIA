document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('active');

        // Burger Animation (optional)
        hamburger.classList.toggle('toggle');
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 3. Scroll Reveal Animations
    const reveals = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    // Run once on load
    revealOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', revealOnScroll);

    // 4. Polaroid Gallery Physics (Draggable + Swipe to Dismiss)
    const galleryItems = document.querySelectorAll('.gallery-item');
    const polaroidOverlay = document.createElement('div');
    polaroidOverlay.classList.add('polaroid-overlay');
    document.body.appendChild(polaroidOverlay);

    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const imgEl = item.querySelector('img');
            if(!imgEl) return;
            
            const polaroid = document.createElement('div');
            polaroid.classList.add('polaroid-card');
            
            const img = document.createElement('img');
            img.src = imgEl.src;
            polaroid.appendChild(img);
            document.body.appendChild(polaroid);
            polaroidOverlay.classList.add('active');
            
            // Drag Physics
            let isDragging = false;
            let startX, startY, currentX = window.innerWidth/2, currentY = window.innerHeight/2;
            let rot = (Math.random() - 0.5) * 15; // Random initial rotation
            
            polaroid.style.left = `${currentX}px`;
            polaroid.style.top = `${currentY}px`;
            polaroid.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;

            const startDrag = (clientX, clientY) => {
                isDragging = true;
                startX = clientX - currentX;
                startY = clientY - currentY;
                polaroid.style.transition = 'none'; // Disable spring for raw drag
            };

            const doDrag = (clientX, clientY) => {
                if (!isDragging) return;
                currentX = clientX - startX;
                currentY = clientY - startY;
                polaroid.style.left = `${currentX}px`;
                polaroid.style.top = `${currentY}px`;
            };

            const stopDrag = () => {
                if (!isDragging) return;
                isDragging = false;
                polaroid.style.transition = 'transform 0.2s, left 0.4s ease-out, top 0.4s ease-out';
                
                // Throw physics (swipe off edge to dismiss)
                if(currentX < window.innerWidth * 0.1 || currentX > window.innerWidth * 0.9 || currentY < window.innerHeight * 0.1 || currentY > window.innerHeight * 0.9) {
                    polaroid.style.top = currentY > window.innerHeight/2 ? '150vh' : '-50vh';
                    polaroidOverlay.classList.remove('active');
                    setTimeout(() => polaroid.remove(), 400);
                } else {
                    // Snap back to center
                    currentX = window.innerWidth/2;
                    currentY = window.innerHeight/2;
                    polaroid.style.left = `${currentX}px`;
                    polaroid.style.top = `${currentY}px`;
                }
            };

            // Touch events
            polaroid.addEventListener('touchstart', e => startDrag(e.touches[0].clientX, e.touches[0].clientY), {passive: false});
            window.addEventListener('touchmove', e => { if(isDragging) e.preventDefault(); doDrag(e.touches[0].clientX, e.touches[0].clientY); }, {passive: false});
            window.addEventListener('touchend', stopDrag);

            // Mouse events
            polaroid.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
            window.addEventListener('mousemove', e => doDrag(e.clientX, e.clientY));
            window.addEventListener('mouseup', stopDrag);

            // Click overlay to close
            polaroidOverlay.addEventListener('click', () => {
                polaroid.style.top = '150vh'; // fall down
                polaroidOverlay.classList.remove('active');
                setTimeout(() => polaroid.remove(), 400);
            }, {once: true});
        });
    });

    // 5. Custom Cursor (Chattakam) & Steam Tap Animation
    const chattakam = document.getElementById('chattakam-cursor');
    
    if (chattakam) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            // Updating left/top avoids overriding CSS transforms on hover
            chattakam.style.left = `${posX}px`;
            chattakam.style.top = `${posY}px`;
        });

        // Add hover tilt effect to interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .gallery-item, .category-header, .jump-pill');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => chattakam.classList.add('hovering'));
            el.addEventListener('mouseleave', () => chattakam.classList.remove('hovering'));
        });
    }

    // Steam Generator
    const createSteam = (x, y) => {
        // Create 6 heavy puffs of steam staggered
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const steam = document.createElement('div');
                steam.classList.add('steam-particle');
                
                // Wider spread and exponentially larger size for dense steam
                const offsetX = (Math.random() - 0.5) * 40;
                const offsetY = (Math.random() - 0.5) * 20;
                const size = 1.5 + Math.random() * 2.5; 
                
                steam.style.left = `${x + offsetX}px`;
                steam.style.top = `${y + offsetY}px`;
                steam.style.transform = `scale(${size})`;
                
                document.body.appendChild(steam);
                setTimeout(() => steam.remove(), 1200);
            }, i * 80);
        }
    };

    window.addEventListener('click', (e) => createSteam(e.clientX, e.clientY));
    window.addEventListener('touchstart', (e) => {
        if(e.touches.length > 0) createSteam(e.touches[0].clientX, e.touches[0].clientY);
    }, {passive: true});

    // Localized Dish Steam on Tap/Hover
    document.querySelectorAll('.dish-list li').forEach(dish => {
        const triggerDishSteam = () => {
            const rect = dish.getBoundingClientRect();
            // Emit steam specifically from the right side (where the price is)
            createSteam(rect.right - 20, rect.top + rect.height/2);
        };
        dish.addEventListener('mouseenter', triggerDishSteam);
        dish.addEventListener('touchstart', triggerDishSteam, {passive: true});
    });

    // 6. Smooth Scrolling for anchor links (fallback for browsers without CSS scroll-behavior)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 7. Parallax Scroll Effect
    const parallaxElements = document.querySelectorAll('.hero-bg, .parallax-img');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        parallaxElements.forEach(el => {
            const speed = 0.35;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // 8. Late Night Mode Toggle (2:00 AM Cravings)
    const neonToggle = document.getElementById('neon-toggle');
    if (neonToggle) {
        neonToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent jump to top if nested in weird link structure
            document.body.classList.toggle('neon-mode');
            if(document.body.classList.contains('neon-mode')) {
                neonToggle.textContent = '☀️ Day Mode';
            } else {
                neonToggle.textContent = '🌙 2:00 AM Cravings';
            }
        });
    }
});
