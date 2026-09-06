document.addEventListener('DOMContentLoaded', () => {

    // 1. Remove Page Loader
    const loader = document.querySelector('.loader');
    if(loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }

    // 2. Mobile Menu Navigation Trigger
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if(menuToggle && closeMenu && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
        });
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    // 3. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-icon').textContent = '+';
                }
            });
            item.classList.toggle('active');
            const icon = item.querySelector('.faq-icon');
            icon.textContent = item.classList.contains('active') ? '−' : '+';
        });
    });

    // 4. Testimonial Slider Mechanics (with swipe & dots)
    function initTestimonialsSlider() {
        const track = document.querySelector('.testimonial-track');
        if(!track) return;
        const cards = Array.from(track.querySelectorAll('.testimonial-card'));
        const nextBtn = document.querySelector('.testimonial-next');
        const prevBtn = document.querySelector('.testimonial-prev');
        const dotsContainer = document.querySelector('.testimonial-dots');
        let currentIndex = 0;
        const totalCards = cards.length;

        let dots = [];
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalCards; i++) {
                const dot = document.createElement('div');
                dot.classList.add('slider-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                });
                dotsContainer.appendChild(dot);
                dots.push(dot);
            }
        }

        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            cards.forEach((card, index) => {
                card.classList.toggle('active', index === currentIndex);
            });
            dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentIndex));
        }

        if(nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalCards;
                updateSlider();
            });
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                updateSlider();
            });
        }

        let startX = 0;
        track.addEventListener('touchstart', (e) => startX = e.changedTouches[0].screenX, { passive: true });
        track.addEventListener('touchend', (e) => {
            let endX = e.changedTouches[0].screenX;
            if (endX < startX - 40) {
                currentIndex = (currentIndex + 1) % totalCards;
                updateSlider();
            } else if (endX > startX + 40) {
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                updateSlider();
            }
        }, { passive: true });
    }

    // 5. Statistics Incremental Counters
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target'));
                const duration = 4000; 
                const increment = endValue / (duration / 16); 
                let currentValue = 0;
                
                const updateCounter = () => {
                    currentValue += increment;
                    if (currentValue < endValue) {
                        target.innerText = Math.ceil(currentValue);
                        requestAnimationFrame(updateCounter);
                    } else {
                        target.innerText = endValue;
                    }
                };
                updateCounter();
                observer.unobserve(target); 
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // 6. Responsive Services Carousel (Desktop Accordion / Mobile Arc Carousel)
    function initServicesArcCarousel() {
        const track = document.querySelector('.services-track');
        if (!track) return;
        const cards = Array.from(track.querySelectorAll('.service-card'));
        const nextBtn = document.querySelector('.slider-btn.service-next');
        const prevBtn = document.querySelector('.slider-btn.service-prev');
        const dotsContainer = document.querySelector('.services-dots');
        let activeIndex = 0;
        const totalCards = cards.length;

        let dots = [];
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalCards; i++) {
                const dot = document.createElement('div');
                dot.classList.add('slider-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    activeIndex = i;
                    updateServicesAccordion();
                });
                dotsContainer.appendChild(dot);
                dots.push(dot);
            }
        }

        function updateServicesAccordion() {
            const isMobile = window.innerWidth <= 768;

            cards.forEach((card, i) => {
                card.classList.remove('active', 'mobile-visible-prev', 'mobile-visible-next');
                card.style.transform = '';
                card.style.opacity = '';
                card.style.zIndex = '';
                card.style.pointerEvents = '';

                if (i === activeIndex) {
                    card.classList.add('active');
                    if (isMobile) {
                        card.style.opacity = '1';
                        card.style.pointerEvents = 'auto';
                        card.style.transform = 'translateX(0px) translateY(0px) scale(1.05)';
                        card.style.zIndex = '20';
                    }
                } else if (isMobile) {
                    const prevIndex = (activeIndex - 1 + totalCards) % totalCards;
                    const nextIndex = (activeIndex + 1) % totalCards;
                    
                    if (i === prevIndex) {
                        card.classList.add('mobile-visible-prev');
                        card.style.opacity = '0.5';
                        card.style.pointerEvents = 'auto';
                        card.style.transform = 'translateX(-120px) translateY(12px) rotate(-8deg) scale(0.82)';
                        card.style.zIndex = '10';
                    } else if (i === nextIndex) {
                        card.classList.add('mobile-visible-next');
                        card.style.opacity = '0.5';
                        card.style.pointerEvents = 'auto';
                        card.style.transform = 'translateX(120px) translateY(12px) rotate(8deg) scale(0.82)';
                        card.style.zIndex = '10';
                    }
                }
            });

            if (dots.length > 0) {
                dots.forEach((dot, idx) => dot.classList.toggle('active', idx === activeIndex));
            }
        }

        updateServicesAccordion();
        window.addEventListener('resize', updateServicesAccordion);

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                activeIndex = (activeIndex + 1) % totalCards;
                updateServicesAccordion();
            });
            prevBtn.addEventListener('click', () => {
                activeIndex = (activeIndex - 1 + totalCards) % totalCards;
                updateServicesAccordion();
            });
        }

        // Allow clicking directly on any card strip to expand it instantly
        cards.forEach((card, i) => {
            card.addEventListener('click', () => {
                activeIndex = i;
                updateServicesAccordion();
            });
        });

        // Touch swipe support
        let startX = 0;
        track.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            let endX = e.changedTouches[0].screenX;
            if (endX < startX - 40) {
                activeIndex = (activeIndex + 1) % totalCards;
                updateServicesAccordion();
            } else if (endX > startX + 40) {
                activeIndex = (activeIndex - 1 + totalCards) % totalCards;
                updateServicesAccordion();
            }
        }, { passive: true });
    }

    // 7. Why Choose Us Mobile Arc Carousel
    function initArcCarousel() {
        const track = document.querySelector('.arc-track');
        if (!track) return;
        const cards = Array.from(track.querySelectorAll('.arc-card'));
        const nextBtn = document.querySelector('.arc-next');
        const prevBtn = document.querySelector('.arc-prev');
        const dotsContainer = document.querySelector('.arc-dots');
        let activeIndex = 0;
        const totalCards = cards.length;

        let dots = [];
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalCards; i++) {
                const dot = document.createElement('div');
                dot.classList.add('slider-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    activeIndex = i;
                    updateArc();
                });
                dotsContainer.appendChild(dot);
                dots.push(dot);
            }
        }

        function updateArc() {
            cards.forEach((card, i) => {
                let offset = i - activeIndex;
                if (offset > totalCards / 2) offset -= totalCards;
                if (offset < -totalCards / 2) offset += totalCards;

                if (Math.abs(offset) <= 2) {
                    card.style.opacity = '1';
                    card.style.pointerEvents = 'auto';
                    const x = offset * 70; 
                    const y = Math.abs(offset) * 22; 
                    const rotate = offset * 14; 
                    const scale = 1 - Math.abs(offset) * 0.15; 
                    card.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${rotate}deg) scale(${scale})`;
                    card.style.zIndex = 10 - Math.abs(offset);
                    card.style.filter = offset === 0 ? 'brightness(1.1)' : 'brightness(0.5) blur(1px)';
                } else {
                    card.style.opacity = '0';
                    card.style.pointerEvents = 'none';
                }
            });

            dots.forEach((dot, idx) => dot.classList.toggle('active', idx === activeIndex));
        }
        updateArc();

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                activeIndex = (activeIndex + 1) % totalCards;
                updateArc();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                activeIndex = (activeIndex - 1 + totalCards) % totalCards;
                updateArc();
            });
        }

        let startX = 0;
        track.addEventListener('touchstart', (e) => startX = e.changedTouches[0].screenX, { passive: true });
        track.addEventListener('touchend', (e) => {
            let endX = e.changedTouches[0].screenX;
            if (endX < startX - 40) {
                activeIndex = (activeIndex + 1) % totalCards;
                updateArc();
            } else if (endX > startX + 40) {
                activeIndex = (activeIndex - 1 + totalCards) % totalCards;
                updateArc();
            }
        }, { passive: true });
    }

    // 8. 3D COVERFLOW PANORAMA ENGINE (Our Process)
    function initPanoramaProcess() {
        const track = document.querySelector('.process-panorama-track');
        if (!track) return;
        const cards = Array.from(track.querySelectorAll('.process-pano-card'));
        const nextBtn = document.querySelector('.pano-next');
        const prevBtn = document.querySelector('.pano-prev');
        const dotsContainer = document.querySelector('.process-panorama-dots');
        let activeIndex = 0;
        const totalCards = cards.length;

        let dots = [];
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalCards; i++) {
                const dot = document.createElement('div');
                dot.classList.add('slider-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    activeIndex = i;
                    updateCoverflow();
                });
                dotsContainer.appendChild(dot);
                dots.push(dot);
            }
        }

        function updateCoverflow() {
            const isDesktop = window.innerWidth > 768;
            const spacing = isDesktop ? 220 : 160; 
            
            cards.forEach((card, i) => {
                let offset = i - activeIndex;
                
                if (offset > totalCards / 2) offset -= totalCards;
                if (offset < -totalCards / 2) offset += totalCards;

                if (Math.abs(offset) <= 3) {
                    card.style.opacity = '1';
                    card.style.pointerEvents = 'auto';

                    const x = offset * spacing;
                    const depth = Math.abs(offset) * 120; 
                    const rotateY = offset * -25;         
                    
                    const scale = offset === 0 ? (isDesktop ? 1.15 : 1.08) : (1 - Math.abs(offset) * 0.1);
                    const zIndex = 20 - Math.abs(offset);

                    card.style.transform = `translateX(${x}px) translateZ(-${depth}px) rotateY(${rotateY}deg) scale(${scale})`;
                    card.style.zIndex = zIndex;

                    if (offset === 0) {
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                } else {
                    card.style.opacity = '0';
                    card.style.pointerEvents = 'none';
                    card.style.transform = 'translateX(0px) translateZ(-500px) rotateY(0deg) scale(0.4)';
                    card.style.zIndex = '0';
                }
            });

            dots.forEach((dot, idx) => dot.classList.toggle('active', idx === activeIndex));
        }

        updateCoverflow();
        window.addEventListener('resize', updateCoverflow);

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                activeIndex = (activeIndex + 1) % totalCards;
                updateCoverflow();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                activeIndex = (activeIndex - 1 + totalCards) % totalCards;
                updateCoverflow();
            });
        }

        cards.forEach((card, i) => {
            card.addEventListener('click', () => {
                activeIndex = i;
                updateCoverflow();
            });
        });

        let startX = 0;
        track.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            let endX = e.changedTouches[0].screenX;
            if (endX < startX - 40) {
                activeIndex = (activeIndex + 1) % totalCards;
                updateCoverflow();
            } else if (endX > startX + 40) {
                activeIndex = (activeIndex - 1 + totalCards) % totalCards;
                updateCoverflow();
            }
        }, { passive: true });
    }

    // Initialize all sliders
    initServicesArcCarousel();
    initArcCarousel();
    initPanoramaProcess();
    initTestimonialsSlider();

});