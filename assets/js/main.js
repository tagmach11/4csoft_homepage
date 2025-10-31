/* 토스 스타일 JavaScript - 4CSoft 홈페이지 */

// 이미지 슬라이드쇼 초기화
function initImageSlideshow() {
    const slideshow = document.querySelector('.image-slideshow');
    if (!slideshow) return;
    
    const images = slideshow.querySelectorAll('.slide-image');
    if (images.length <= 1) return;
    
    let currentIndex = 0;
    
    function showNextImage() {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }
    
    // 3초마다 이미지 전환 (GIF처럼)
    setInterval(showNextImage, 3000);
}

document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 스크롤 효과
    const header = document.querySelector('#header') || document.querySelector('.header');
    const navLinks = document.querySelectorAll('.navmenu a');
    
    // 현재 페이지에 맞는 메뉴 활성화
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 4px 24px rgba(0, 100, 255, 0.12)';
            } else {
                header.style.boxShadow = '0 2px 20px rgba(0, 100, 255, 0.08)';
            }
        });
    }
    
    // 부드러운 스크롤 (앵커 링크만)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // #으로 시작하는 앵커 링크만 처리
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // 다른 링크(features.html 등)는 정상 동작
        });
    });
    
    // 이미지 슬라이드쇼 초기화
    initImageSlideshow();
    
    // 탭 기능
    const tabButtons = document.querySelectorAll('.system_tab button');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    console.log('탭 버튼 개수:', tabButtons.length);
    console.log('탭 패널 개수:', tabPanes.length);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.getAttribute('data-tab');
            console.log('클릭된 탭:', targetTab);
            
            // 모든 탭 버튼에서 active 클래스 제거
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // 모든 탭 패널 숨기기
            tabPanes.forEach(pane => pane.classList.remove('show'));
            
            // 클릭된 버튼에 active 클래스 추가
            this.classList.add('active');
            
            // 해당 탭 패널 보이기
            const targetPane = document.querySelector(`[data-content="${targetTab}"]`);
            console.log('타겟 패널:', targetPane);
            if (targetPane) {
                targetPane.classList.add('show');
            } else {
                console.error('탭 패널을 찾을 수 없습니다:', targetTab);
            }
        });
    });
    
    // FAQ 아코디언
    const faqButtons = document.querySelectorAll('.ud-faq-btn');
    
    faqButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target');
            const targetCollapse = document.querySelector(targetId);
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // 모든 FAQ 닫기
            faqButtons.forEach(btn => {
                btn.setAttribute('aria-expanded', 'false');
                const collapseId = btn.getAttribute('data-bs-target');
                const collapse = document.querySelector(collapseId);
                if (collapse) {
                    collapse.classList.remove('show');
                }
            });
            
            // 클릭된 FAQ 토글
            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
                if (targetCollapse) {
                    targetCollapse.classList.add('show');
                }
            }
        });
    });
    
    // 스크롤 탑 버튼
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 모바일 메뉴 토글
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.navmenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // 애니메이션 대상 요소들 관찰
    const animateElements = document.querySelectorAll('.article_item, .ban, .ud-single-faq, .lx_client_li li');
    animateElements.forEach(el => observer.observe(el));
    
    // 카운터 애니메이션 (통계가 있다면)
    const counters = document.querySelectorAll('.counter');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2초
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => counterObserver.observe(counter));
    
    // 패럴랙스 효과 (히어로 섹션)
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            heroImage.style.transform = `translateY(${parallax}px)`;
        });
    }
    
    // 로딩 애니메이션
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // 히어로 섹션 애니메이션
        const heroElements = document.querySelectorAll('.hero h2, .hero .lead, .hero .cta-buttons');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });
    
    // 초기 히어로 요소 숨기기
    const heroElements = document.querySelectorAll('.hero h2, .hero .lead, .hero .cta-buttons');
    heroElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

// 유틸리티 함수들
const utils = {
    // 디바운스 함수
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 스로틀 함수
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // 요소가 뷰포트에 있는지 확인
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // 스크롤 위치 가져오기
    getScrollPosition: function() {
        return window.pageYOffset || document.documentElement.scrollTop;
    },
    
    // 요소로 스크롤
    scrollToElement: function(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// 전역으로 유틸리티 함수 노출
window.utils = utils;

// FAQ 아코디언 토글 (고객문의 섹션)
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                // 다른 아코디언 닫기
                const isActive = item.classList.contains('active');
                faqItems.forEach(faq => faq.classList.remove('active'));
                
                // 클릭한 항목 토글
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
});
