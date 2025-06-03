// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loader
    setTimeout(function() {
        const loader = document.querySelector('.loader');
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 2500);

    // Header scroll effect
    const header = document.querySelector('header');
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll to target section
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Add active class to nav links on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to corresponding link
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });

    // Gallery lightbox functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentImageIndex = 0;
    
    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').getAttribute('src');
            lightboxImg.setAttribute('src', imgSrc);
            currentImageIndex = index;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    closeLightbox.addEventListener('click', function() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Close lightbox on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Navigate through gallery with arrow keys
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
    
    // Previous image
    prevBtn.addEventListener('click', showPrevImage);
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        const imgSrc = galleryItems[currentImageIndex].querySelector('img').getAttribute('src');
        lightboxImg.style.opacity = 0;
        setTimeout(() => {
            lightboxImg.setAttribute('src', imgSrc);
            lightboxImg.style.opacity = 1;
        }, 300);
    }
    
    // Next image
    nextBtn.addEventListener('click', showNextImage);
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        const imgSrc = galleryItems[currentImageIndex].querySelector('img').getAttribute('src');
        lightboxImg.style.opacity = 0;
        setTimeout(() => {
            lightboxImg.setAttribute('src', imgSrc);
            lightboxImg.style.opacity = 1;
        }, 300);
    }

    // Parallax scrolling effect
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Hero parallax
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        }
        
        // Specs section parallax
        const specs = document.querySelector('.specs');
        if (specs) {
            specs.style.backgroundPositionY = -scrollPosition * 0.05 + 'px';
        }
    });

    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.history-content, .specs-cards, .gallery-grid, .features-grid');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px"
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
    
    // Engine Sound Button Functionality
    const engineSoundBtn = document.getElementById('engineSound');
    const engineAudio = document.getElementById('engineAudio');
    let isPlaying = false;

    engineSoundBtn.addEventListener('click', function() {
        if (!isPlaying) {
            engineAudio.currentTime = 0; // Reset audio to start
            engineAudio.play();
            engineSoundBtn.classList.add('playing');
            isPlaying = true;
            
            // Update button text while playing
            engineSoundBtn.querySelector('span').textContent = 'STOP ENGINE';
            
            // When audio ends
            engineAudio.onended = function() {
                engineSoundBtn.classList.remove('playing');
                engineSoundBtn.querySelector('span').textContent = 'START ENGINE';
                isPlaying = false;
            };
        } else {
            engineAudio.pause();
            engineAudio.currentTime = 0;
            engineSoundBtn.classList.remove('playing');
            engineSoundBtn.querySelector('span').textContent = 'START ENGINE';
            isPlaying = false;
        }
    });

    // Add hover sound effect
    engineSoundBtn.addEventListener('mouseenter', function() {
        if (!isPlaying) {
            engineSoundBtn.classList.add('hover');
        }
    });

    engineSoundBtn.addEventListener('mouseleave', function() {
        engineSoundBtn.classList.remove('hover');
    });
});

