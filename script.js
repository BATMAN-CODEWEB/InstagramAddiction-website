// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const newsletterForm = document.getElementById('newsletter-form');
    const solutionQuizBtn = document.getElementById('solution-quiz-btn');
    const navItems = document.querySelectorAll('.nav-links a');

    // Add 'scrolled' class to header when scrolling
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
            
            // Hide header when scrolling down, show when scrolling up
            if (scrollTop > lastScrollTop && scrollTop > 150) {
                // Scrolling down
                navbar.style.top = '-80px';
            } else {
                // Scrolling up
                navbar.style.top = '0';
            }
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Mobile Menu Toggle
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');

        // Animate hamburger to X
        const bars = document.querySelectorAll('.bar');
        if (hamburger.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navbar.contains(event.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            
            const bars = document.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Smooth scrolling for navigation links
    navItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                
                const bars = document.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update active link
            navItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Navigation highlight on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Newsletter Form Submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (validateEmail(email)) {
                // Simulate form submission
                this.innerHTML = '<p class="success-message">Thank you for subscribing!</p>';
                
                // In a real application, you would send this data to a server
                console.log(`Email submitted: ${email}`);
            } else {
                // Show error if email is invalid
                const errorMsg = document.createElement('p');
                errorMsg.classList.add('error-message');
                errorMsg.textContent = 'Please enter a valid email address';
                errorMsg.style.color = '#ff6b6b';
                errorMsg.style.marginTop = '10px';
                
                // Remove any existing error messages
                const existingError = this.querySelector('.error-message');
                if (existingError) {
                    this.removeChild(existingError);
                }
                
                this.appendChild(errorMsg);
            }
        });
    }

    // Solution Quiz Button
    if (solutionQuizBtn) {
        solutionQuizBtn.addEventListener('click', function() {
            createQuizModal();
        });
    }

    // Create interactive chart in research section
    const researchChart = document.getElementById('research-chart');
    if (researchChart) {
        createSimpleChart(researchChart);
    }

    // Add animations for case studies
    const caseStudies = document.querySelectorAll('.case-study');
    caseStudies.forEach(study => {
        study.addEventListener('mouseover', function() {
            this.querySelector('.case-outcome').style.backgroundColor = '#efe9ff';
        });
        
        study.addEventListener('mouseout', function() {
            this.querySelector('.case-outcome').style.backgroundColor = 'var(--alt-bg-color)';
        });
    });

    // Videos section interactions
    const videoCards = document.querySelectorAll('.video-card');
    const videoContainers = document.querySelectorAll('.video-container');
    const videoElements = document.querySelectorAll('.video-container video');
    
    // Add interactions to videos
    videoCards.forEach((card, index) => {
        const videoContainer = card.querySelector('.video-container');
        const video = videoContainer.querySelector('video');
        
        // Play/pause video when clicking the container
        videoContainer.addEventListener('click', () => {
            if (video.paused) {
                // Stop all other videos
                videoElements.forEach((otherVideo, videoIndex) => {
                    const otherContainer = videoContainers[videoIndex];
                    if (videoIndex !== index) {
                        otherVideo.pause();
                        otherContainer.classList.remove('playing');
                    }
                });
                
                // Play this video
                video.play();
                videoContainer.classList.add('playing');
            } else {
                // Pause this video
                video.pause();
                videoContainer.classList.remove('playing');
            }
        });
        
        // Add playing class when video plays
        video.addEventListener('play', () => {
            videoContainer.classList.add('playing');
        });
        
        // Remove playing class when video ends or pauses
        video.addEventListener('pause', () => {
            videoContainer.classList.remove('playing');
        });
        
        video.addEventListener('ended', () => {
            videoContainer.classList.remove('playing');
        });
    });
    
    // Lazy load videos for better performance
    const lazyLoadVideos = () => {
        const videoContainers = document.querySelectorAll('.video-container');
        
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target.querySelector('video');
                        const source = video.querySelector('source');
                        
                        if (source && source.hasAttribute('data-src')) {
                            const src = source.getAttribute('data-src');
                            source.setAttribute('src', src);
                            video.load();
                            
                            // Remove data-src to avoid loading again
                            source.removeAttribute('data-src');
                        }
                        
                        videoObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '100px' });
            
            videoContainers.forEach(container => {
                videoObserver.observe(container);
            });
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            videoContainers.forEach(container => {
                const video = container.querySelector('video');
                const source = video.querySelector('source');
                
                if (source && source.hasAttribute('data-src')) {
                    const src = source.getAttribute('data-src');
                    source.setAttribute('src', src);
                    video.load();
                }
            });
        }
    };
    
    // Initialize lazy loading
    lazyLoadVideos();
});

// Email validation helper function
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Create a simple chart visualization
function createSimpleChart(container) {
    // Create sample data for the chart
    const data = [
        { usage: '0-30 min', anxiety: 20, depression: 15 },
        { usage: '30-60 min', anxiety: 35, depression: 30 },
        { usage: '1-2 hours', anxiety: 50, depression: 45 },
        { usage: '2-3 hours', anxiety: 70, depression: 65 },
        { usage: '3+ hours', anxiety: 85, depression: 80 }
    ];
    
    // Clear container
    container.innerHTML = '';
    container.style.padding = '20px';
    
    // Create chart title
    const title = document.createElement('h4');
    title.textContent = 'Instagram Usage & Mental Health Correlation';
    title.style.marginBottom = '15px';
    title.style.color = 'white';
    container.appendChild(title);
    
    // Create chart description
    const desc = document.createElement('p');
    desc.textContent = 'Reported symptoms increase with longer daily usage';
    desc.style.marginBottom = '20px';
    desc.style.color = 'white';
    container.appendChild(desc);
    
    // Create chart container
    const chartDiv = document.createElement('div');
    chartDiv.style.height = '180px';
    chartDiv.style.display = 'flex';
    chartDiv.style.alignItems = 'flex-end';
    chartDiv.style.justifyContent = 'space-between';
    chartDiv.style.padding = '0 10px';
    container.appendChild(chartDiv);
    
    // Create bars for each data point
    data.forEach(item => {
        const barGroup = document.createElement('div');
        barGroup.style.display = 'flex';
        barGroup.style.flexDirection = 'column';
        barGroup.style.alignItems = 'center';
        barGroup.style.width = '18%';
        
        // Anxiety bar
        const anxietyBar = document.createElement('div');
        anxietyBar.style.width = '100%';
        anxietyBar.style.height = `${item.anxiety * 1.5}px`;
        anxietyBar.style.backgroundColor = '#8a6cde';
        anxietyBar.style.marginBottom = '5px';
        anxietyBar.style.borderRadius = '3px 3px 0 0';
        anxietyBar.style.transition = 'height 0.5s ease';
        anxietyBar.title = `Anxiety: ${item.anxiety}%`;
        
        // Depression bar
        const depressionBar = document.createElement('div');
        depressionBar.style.width = '100%';
        depressionBar.style.height = `${item.depression * 1.5}px`;
        depressionBar.style.backgroundColor = '#f5c7b8';
        depressionBar.style.borderRadius = '3px 3px 0 0';
        depressionBar.style.transition = 'height 0.5s ease';
        depressionBar.title = `Depression: ${item.depression}%`;
        
        // Label
        const label = document.createElement('div');
        label.textContent = item.usage;
        label.style.marginTop = '10px';
        label.style.fontSize = '0.8rem';
        label.style.color = 'white';
        label.style.textAlign = 'center';
        
        barGroup.appendChild(anxietyBar);
        barGroup.appendChild(depressionBar);
        barGroup.appendChild(label);
        chartDiv.appendChild(barGroup);
        
        // Add hover effect
        barGroup.addEventListener('mouseover', () => {
            anxietyBar.style.height = `${(item.anxiety * 1.5) + 10}px`;
            depressionBar.style.height = `${(item.depression * 1.5) + 10}px`;
        });
        
        barGroup.addEventListener('mouseout', () => {
            anxietyBar.style.height = `${item.anxiety * 1.5}px`;
            depressionBar.style.height = `${item.depression * 1.5}px`;
        });
    });
    
    // Add legend
    const legend = document.createElement('div');
    legend.style.display = 'flex';
    legend.style.justifyContent = 'center';
    legend.style.marginTop = '20px';
    legend.style.gap = '20px';
    
    const anxietyLegend = document.createElement('div');
    anxietyLegend.style.display = 'flex';
    anxietyLegend.style.alignItems = 'center';
    anxietyLegend.style.gap = '5px';
    
    const anxietyColor = document.createElement('div');
    anxietyColor.style.width = '15px';
    anxietyColor.style.height = '15px';
    anxietyColor.style.backgroundColor = '#8a6cde';
    anxietyColor.style.borderRadius = '3px';
    
    const anxietyText = document.createElement('span');
    anxietyText.textContent = 'Anxiety';
    anxietyText.style.color = 'white';
    anxietyText.style.fontSize = '0.9rem';
    
    anxietyLegend.appendChild(anxietyColor);
    anxietyLegend.appendChild(anxietyText);
    
    const depressionLegend = document.createElement('div');
    depressionLegend.style.display = 'flex';
    depressionLegend.style.alignItems = 'center';
    depressionLegend.style.gap = '5px';
    
    const depressionColor = document.createElement('div');
    depressionColor.style.width = '15px';
    depressionColor.style.height = '15px';
    depressionColor.style.backgroundColor = '#f5c7b8';
    depressionColor.style.borderRadius = '3px';
    
    const depressionText = document.createElement('span');
    depressionText.textContent = 'Depression';
    depressionText.style.color = 'white';
    depressionText.style.fontSize = '0.9rem';
    
    depressionLegend.appendChild(depressionColor);
    depressionLegend.appendChild(depressionText);
    
    legend.appendChild(anxietyLegend);
    legend.appendChild(depressionLegend);
    container.appendChild(legend);
}

// Create quiz modal
function createQuizModal() {
    // Create modal container
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '2000';
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '15px';
    modalContent.style.padding = '30px';
    modalContent.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.3)';
    modalContent.style.transform = 'translateY(20px)';
    modalContent.style.transition = 'transform 0.3s ease';
    
    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.style.display = 'flex';
    modalHeader.style.justifyContent = 'space-between';
    modalHeader.style.alignItems = 'center';
    modalHeader.style.marginBottom = '20px';
    
    const modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Instagram Habit Assessment Quiz';
    modalTitle.style.color = 'var(--primary-color)';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '1.5rem';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = 'var(--text-color)';
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeBtn);
    
    // Create quiz content
    const quizContent = document.createElement('div');
    
    const quizIntro = document.createElement('p');
    quizIntro.textContent = 'Answer these 5 questions to assess your Instagram habits and get personalized recommendations.';
    quizIntro.style.marginBottom = '20px';
    
    const quizForm = document.createElement('form');
    quizForm.id = 'habit-quiz';
    
    // Add quiz questions
    const questions = [
        {
            id: 'q1',
            text: 'How much time do you spend on Instagram daily?',
            options: [
                'Less than 30 minutes',
                '30-60 minutes',
                '1-2 hours',
                '2-3 hours',
                'More than 3 hours'
            ]
        },
        {
            id: 'q2',
            text: 'How often do you check Instagram without a specific purpose?',
            options: [
                'Rarely',
                'A few times a day',
                'Several times a day',
                'Almost every hour',
                'Constantly throughout the day'
            ]
        },
        {
            id: 'q3',
            text: 'Do you feel anxious when you can\'t check Instagram?',
            options: [
                'Not at all',
                'Slightly anxious',
                'Moderately anxious',
                'Very anxious',
                'Extremely anxious'
            ]
        },
        {
            id: 'q4',
            text: 'How important are likes and comments to your mood?',
            options: [
                'Not important at all',
                'Slightly important',
                'Moderately important',
                'Very important',
                'Extremely important'
            ]
        },
        {
            id: 'q5',
            text: 'How often do you compare yourself to others on Instagram?',
            options: [
                'Never',
                'Rarely',
                'Sometimes',
                'Often',
                'Almost always'
            ]
        }
    ];
    
    // Create question elements
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.style.marginBottom = '25px';
        
        const questionText = document.createElement('p');
        questionText.textContent = `${index + 1}. ${question.text}`;
        questionText.style.fontWeight = '500';
        questionText.style.marginBottom = '10px';
        
        questionDiv.appendChild(questionText);
        
        // Create options
        question.options.forEach((option, optIndex) => {
            const optionLabel = document.createElement('label');
            optionLabel.style.display = 'block';
            optionLabel.style.margin = '10px 0';
            optionLabel.style.cursor = 'pointer';
            
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = question.id;
            optionInput.value = optIndex + 1;
            optionInput.style.marginRight = '10px';
            
            const optionText = document.createTextNode(option);
            
            optionLabel.appendChild(optionInput);
            optionLabel.appendChild(optionText);
            questionDiv.appendChild(optionLabel);
        });
        
        quizForm.appendChild(questionDiv);
    });
    
    // Create submit button
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Get Results';
    submitBtn.type = 'submit';
    submitBtn.className = 'btn primary-btn';
    submitBtn.style.width = '100%';
    
    quizForm.appendChild(submitBtn);
    
    // Create results div (initially hidden)
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'quiz-results';
    resultsDiv.style.display = 'none';
    
    quizContent.appendChild(quizIntro);
    quizContent.appendChild(quizForm);
    quizContent.appendChild(resultsDiv);
    
    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(quizContent);
    modal.appendChild(modalContent);
    
    // Add to body
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 10);
    
    // Close button functionality
    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    
    // Close when clicking outside the modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            modalContent.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
    });
    
    // Form submission
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(quizForm);
        let totalScore = 0;
        let answeredQuestions = 0;
        
        // Calculate score
        questions.forEach(question => {
            const value = formData.get(question.id);
            if (value) {
                totalScore += parseInt(value);
                answeredQuestions++;
            }
        });
        
        // Check if all questions are answered
        if (answeredQuestions < questions.length) {
            alert('Please answer all questions to get your results.');
            return;
        }
        
        // Hide form and show results
        quizForm.style.display = 'none';
        resultsDiv.style.display = 'block';
        
        // Determine user category based on score
        let category, description, recommendations;
        const averageScore = totalScore / questions.length;
        
        if (averageScore < 2) {
            category = 'Healthy User';
            description = 'You show minimal signs of Instagram addiction. Your usage appears to be well-balanced.';
            recommendations = [
                'Continue maintaining healthy boundaries with social media',
                'Be mindful of any changes in your usage patterns',
                'Consider setting a good example for friends and family'
            ];
        } else if (averageScore < 3) {
            category = 'Moderate User';
            description = 'You show some signs of dependency on Instagram, but it\'s not severely impacting your life.';
            recommendations = [
                'Consider implementing screen time limits (try 1 hour daily)',
                'Turn off push notifications',
                'Try a weekend "digital detox" once a month'
            ];
        } else if (averageScore < 4) {
            category = 'At-Risk User';
            description = 'Your Instagram usage shows significant signs of problematic patterns that could lead to addiction.';
            recommendations = [
                'Set strict daily time limits (30-45 minutes maximum)',
                'Delete the app from your phone for periods of time',
                'Establish phone-free zones in your home',
                'Schedule specific times to check Instagram rather than checking randomly'
            ];
        } else {
            category = 'Heavy Dependency';
            description = 'Your responses indicate a strong dependency on Instagram that is likely affecting your wellbeing.';
            recommendations = [
                'Consider a 30-day break from Instagram',
                'Delete the app from your phone completely',
                'Seek support from friends, family or a professional counselor',
                'Replace Instagram time with offline activities that bring you joy',
                'Use screen time tracking apps to hold yourself accountable'
            ];
        }
        
        // Create results content
        const categoryHeading = document.createElement('h3');
        categoryHeading.textContent = category;
        categoryHeading.style.color = 'var(--primary-color)';
        categoryHeading.style.marginBottom = '15px';
        
        const scoreDisplay = document.createElement('div');
        scoreDisplay.style.margin = '20px 0';
        scoreDisplay.style.padding = '15px';
        scoreDisplay.style.backgroundColor = 'var(--alt-bg-color)';
        scoreDisplay.style.borderRadius = '10px';
        scoreDisplay.style.textAlign = 'center';
        scoreDisplay.innerHTML = `<strong>Your score: ${totalScore}/${questions.length * 5}</strong>`;
        
        const descriptionText = document.createElement('p');
        descriptionText.textContent = description;
        descriptionText.style.marginBottom = '20px';
        
        const recommendationsHeading = document.createElement('h4');
        recommendationsHeading.textContent = 'Recommendations:';
        recommendationsHeading.style.marginBottom = '10px';
        
        const recommendationsList = document.createElement('ul');
        recommendationsList.style.marginLeft = '20px';
        
        recommendations.forEach(rec => {
            const recItem = document.createElement('li');
            recItem.textContent = rec;
            recItem.style.marginBottom = '8px';
            recommendationsList.appendChild(recItem);
        });
        
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Retake Quiz';
        restartButton.className = 'btn secondary-btn';
        restartButton.style.marginTop = '20px';
        restartButton.style.width = '100%';
        
        // Add all elements to results div
        resultsDiv.appendChild(categoryHeading);
        resultsDiv.appendChild(scoreDisplay);
        resultsDiv.appendChild(descriptionText);
        resultsDiv.appendChild(recommendationsHeading);
        resultsDiv.appendChild(recommendationsList);
        resultsDiv.appendChild(restartButton);
        
        // Restart functionality
        restartButton.addEventListener('click', () => {
            quizForm.reset();
            resultsDiv.style.display = 'none';
            quizForm.style.display = 'block';
            resultsDiv.innerHTML = '';
        });
    });
} 