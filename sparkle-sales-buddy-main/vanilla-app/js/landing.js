/**
 * SalesPredix Landing Page Interactivity
 * Handles animations, smooth scrolling, and user interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.querySelector('.navbar');
    
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Check on load

    // ============================================
    // MOBILE MENU TOGGLE
    // ============================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

    // ============================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#home') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // STATS COUNTER ANIMATION
    // ============================================
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        statsObserver.observe(statsBar);
    }

    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const isPercentage = text.includes('%');
            const hasPlus = text.includes('+');
            const hasK = text.includes('K');
            const hasM = text.includes('M');
            
            // Handle special case for 24/7
            if (text.includes('/')) return;
            
            let target = parseInt(text.replace(/[^\d]/g, ''));
            let suffix = '';
            
            if (isPercentage) suffix = '%';
            else if (hasK) {
                suffix = 'K+';
                target = target * 1000;
            } else if (hasM) {
                suffix = 'M+';
                target = target * 1000000;
            } else if (hasPlus) {
                suffix = '+';
            }
            
            animateCount(stat, target, suffix, hasK, hasM);
        });
    }

    function animateCount(element, target, suffix, useK, useM) {
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;
        
        const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuart(frame / totalFrames);
            let current = Math.round(target * progress);
            
            if (useM) {
                element.textContent = (current / 1000000).toFixed(current >= 1000000 ? 0 : 1) + suffix;
            } else if (useK) {
                element.textContent = Math.round(current / 1000) + suffix;
            } else {
                element.textContent = current + suffix;
            }
            
            if (frame === totalFrames) {
                clearInterval(counter);
                // Ensure final value is correct
                if (useM) {
                    element.textContent = (target / 1000000) + suffix;
                } else if (useK) {
                    element.textContent = (target / 1000) + suffix;
                } else {
                    element.textContent = target + suffix;
                }
            }
        }, frameDuration);
    }

    // Easing function for smooth animation
    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }

    // ============================================
    // FEATURE CARDS ANIMATION
    // ============================================
    const featureCards = document.querySelectorAll('.feature-card');
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                featureObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        featureObserver.observe(card);
    });

    // ============================================
    // STEPS ANIMATION
    // ============================================
    const steps = document.querySelectorAll('.step');
    const stepsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                stepsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    steps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(20px)';
        step.style.transition = 'all 0.5s ease';
        stepsObserver.observe(step);
    });

    // ============================================
    // TESTIMONIALS ANIMATION
    // ============================================
    const testimonials = document.querySelectorAll('.testimonial-card');
    const testimonialObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                testimonialObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    testimonials.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        testimonialObserver.observe(card);
    });

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    const backToTop = document.getElementById('backToTop');
    
    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', handleBackToTop);
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ============================================
    // SEARCH BAR DEMO
    // ============================================
    const demoSearch = document.getElementById('demoSearch');
    if (demoSearch) {
        demoSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    // Redirect to dashboard with search
                    window.location.href = `index.html#/upload`;
                }
            }
        });
    }

    // ============================================
    // WEATHER WIDGET (Mock)
    // ============================================
    function updateWeather() {
        const weatherDisplay = document.getElementById('weatherDisplay');
        if (!weatherDisplay) return;
        
        const weatherData = [
            { temp: 20, condition: 'Partly sunny', icon: 'fa-cloud-sun' },
            { temp: 22, condition: 'Sunny', icon: 'fa-sun' },
            { temp: 18, condition: 'Cloudy', icon: 'fa-cloud' },
            { temp: 21, condition: 'Clear', icon: 'fa-sun' },
            { temp: 19, condition: 'Mostly sunny', icon: 'fa-cloud-sun' }
        ];
        
        const weather = weatherData[Math.floor(Math.random() * weatherData.length)];
        weatherDisplay.textContent = `${weather.temp}°C ${weather.condition}`;
        
        const weatherIcon = weatherDisplay.parentElement.querySelector('i');
        if (weatherIcon) {
            weatherIcon.className = `fas ${weather.icon}`;
        }
    }
    
    // Update weather every 10 minutes
    updateWeather();
    setInterval(updateWeather, 600000);

    // ============================================
    // NEWSLETTER FORM
    // ============================================
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                // Show success message
                showNotification('Thanks for subscribing! Check your email for confirmation.', 'success');
                this.reset();
            }
        });
    }

    // ============================================
    // NOTIFICATION SYSTEM
    // ============================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            background: type === 'success' ? '#10b981' : '#2563eb',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: '10000',
            animation: 'slideIn 0.3s ease',
            fontSize: '0.95rem',
            fontWeight: '500'
        });
        
        document.body.appendChild(notification);
        
        // Add animation keyframes if not exists
        if (!document.getElementById('notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // ============================================
    // CTA BUTTON TRACKING
    // ============================================
    document.querySelectorAll('.primary-cta, .cta-btn, .cta-button-large, .footer-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Analytics tracking (console for demo)
            console.log('CTA clicked:', this.textContent.trim());
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // ============================================
    // PARALLAX EFFECT FOR HERO
    // ============================================
    const heroShapes = document.querySelectorAll('.floating-shape');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        heroShapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
        });
    });

    // ============================================
    // TYPING EFFECT FOR HERO TITLE (Optional)
    // ============================================
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Uncomment to enable typing effect
    // const heroTitle = document.querySelector('.hero-title');
    // if (heroTitle) {
    //     typeWriter(heroTitle, heroTitle.textContent, 50);
    // }

    // ============================================
    // PRELOADER (Optional)
    // ============================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger initial animations
        setTimeout(() => {
            document.querySelectorAll('.hero-content > *').forEach((el, i) => {
                el.style.animation = `fadeInUp 0.6s ease ${i * 0.1}s both`;
            });
        }, 100);
    });

    console.log('🚀 SalesPredix Landing Page loaded successfully!');
});
