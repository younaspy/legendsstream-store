/**
 * script.js - النسخة المحسنة
 * ملف الجافاسكريبت الرئيسي لمتجر legendsstream
 */

// ==================== التهيئة ====================
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    setupEventListeners();
    loadInitialData();
    startCountdown();
    animateStars();
    initializeSmoothInteractions();
});

// ==================== التهيئة المحسنة ====================
function initializeSmoothInteractions() {
    // تحسين أداء التمرير
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        });
    });

    // إضافة تأثيرات hover سلسة
    addSmoothHoverEffects();
}

function addSmoothHoverEffects() {
    const cards = document.querySelectorAll('.offer-card, .poster-item, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// ==================== معالجة الطلبات المحسنة ====================
window.handleOrder = function(offerId) {
    const offers = JSON.parse(localStorage.getItem('legendsstream_offers')) || [];
    const settings = JSON.parse(localStorage.getItem('legendsstream_settings')) || {
        whatsappNumber: '213675647764',
        whatsappMessage: 'مرحباً، أريد شراء [OFFER_NAME] بسعر [OFFER_PRICE] دج من متجر legendsstream.'
    };
    
    const offer = offers.find(o => o.id === offerId);
    if (!offer) {
        showNotification('❌ العرض غير متاح', 'error');
        return;
    }

    // إظهار تأثير التحميل
    showLoadingEffect(offerId);
    
    // تأخير بسيط لإظهار تأثير التحميل
    setTimeout(() => {
        // تحضير رسالة واتساب
        let message = settings.whatsappMessage
            .replace('[OFFER_NAME]', offer.name)
            .replace('[OFFER_PRICE]', offer.price);
        
        // توجيه إلى واتساب
        const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // إزالة تأثير التحميل
        removeLoadingEffect(offerId);
        
        // تسجيل الطلب
        recordOrder(offer);
        
        // إظهار إشعار نجاح
        showNotification(`✅ تم تحويلك إلى واتساب لشراء ${offer.name}`, 'success');
    }, 500);
};

function showLoadingEffect(offerId) {
    const button = document.querySelector(`.offer-card[data-id="${offerId}"] .offer-btn`);
    if (button) {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
        button.disabled = true;
        button.style.opacity = '0.8';
        button.style.cursor = 'wait';
    }
}

function removeLoadingEffect(offerId) {
    const button = document.querySelector(`.offer-card[data-id="${offerId}"] .offer-btn`);
    if (button) {
        button.innerHTML = '<i class="fab fa-whatsapp"></i> اطلب عبر واتساب';
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    }
}

function showNotification(message, type = 'success') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // تحديد الأيقونة حسب النوع
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const bgColor = type === 'success' ? '#4CAF50' : '#f44336';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    // تنسيق الإشعار المحسن
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: ${bgColor};
        color: white;
        padding: 15px 30px;
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        direction: rtl;
    `;
    
    document.body.appendChild(notification);
    
    // إظهار الإشعار بحركة سلسة
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // إخفاء الإشعار بعد 3 ثوان
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ==================== تحسين عرض العروض ====================
function loadOffers() {
    const offersGrid = document.getElementById('offersGrid');
    if (!offersGrid) return;
    
    const offers = JSON.parse(localStorage.getItem('legendsstream_offers')) || [];
    const settings = JSON.parse(localStorage.getItem('legendsstream_settings')) || { usdRate: 236 };
    
    offersGrid.innerHTML = '';
    offersGrid.style.opacity = '0';
    
    setTimeout(() => {
        offers.filter(offer => offer.active).forEach((offer, index) => {
            const usdPrice = (offer.price / settings.usdRate).toFixed(2);
            const card = createOfferCard(offer, usdPrice);
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s forwards`;
            card.style.opacity = '0';
            offersGrid.appendChild(card);
        });
        
        offersGrid.style.opacity = '1';
    }, 100);
}

function createOfferCard(offer, usdPrice) {
    const card = document.createElement('div');
    card.className = `offer-card ${offer.color} ${offer.isVip ? 'vip-pulse' : ''}`;
    card.dataset.id = offer.id;
    
    const featuresList = offer.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('');
    
    card.innerHTML = `
        ${offer.isVip ? '<span class="offer-badge">🌟 الأكثر طلباً</span>' : ''}
        <span class="offer-status ${offer.active ? 'active' : 'inactive'}"></span>
        <div class="offer-icon">${offer.icon}</div>
        <h3 class="offer-title">${offer.name}</h3>
        <div class="offer-price">
            ${offer.price} دج <small>| ${usdPrice}$</small>
        </div>
        <div class="offer-duration">${offer.duration}</div>
        <ul class="offer-features">
            ${featuresList}
        </ul>
        <button class="offer-btn" onclick="handleOrder('${offer.id}')">
            <i class="fab fa-whatsapp"></i> اطلب عبر واتساب
        </button>
    `;
    
    return card;
}

// ==================== تحسين معرض البوسترات ====================
function loadPosters() {
    const postersSlider = document.getElementById('postersSlider');
    if (!postersSlider) return;
    
    const posters = JSON.parse(localStorage.getItem('legendsstream_posters')) || [];
    
    postersSlider.innerHTML = '';
    postersSlider.style.scrollBehavior = 'smooth';
    
    posters.forEach((poster, index) => {
        const posterItem = document.createElement('div');
        posterItem.className = 'poster-item';
        posterItem.style.animation = `slideIn 0.5s ease ${index * 0.1}s forwards`;
        posterItem.style.opacity = '0';
        posterItem.innerHTML = `
            <img src="${poster.url}" alt="${poster.title}" loading="lazy" onload="this.classList.add('loaded')">
        `;
        postersSlider.appendChild(posterItem);
    });
    
    // إضافة أزرار التنقل للمعرض
    addPosterNavigation();
}

function addPosterNavigation() {
    const postersSection = document.querySelector('.posters-section');
    const postersSlider = document.getElementById('postersSlider');
    
    // إزالة الأزرار القديمة إن وجدت
    const oldNav = document.querySelector('.poster-nav');
    if (oldNav) oldNav.remove();
    
    const navButtons = document.createElement('div');
    navButtons.className = 'poster-nav';
    navButtons.style.cssText = `
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
    `;
    
    navButtons.innerHTML = `
        <button class="poster-nav-btn" id="posterPrev" style="background: var(--primary-red); color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; transition: all 0.3s;">
            <i class="fas fa-chevron-right"></i> السابق
        </button>
        <button class="poster-nav-btn" id="posterNext" style="background: var(--primary-red); color: white; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; transition: all 0.3s;">
            التالي <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    postersSection.appendChild(navButtons);
    
    // إضافة وظائف الأزرار
    document.getElementById('posterPrev').addEventListener('click', () => {
        postersSlider.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    document.getElementById('posterNext').addEventListener('click', () => {
        postersSlider.scrollBy({ left: 300, behavior: 'smooth' });
    });
}

// ==================== تحسين قائمة الهاتف ====================
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navItems = document.getElementById('navItems');
    const overlay = document.createElement('div');
    
    if (!menuToggle || !navItems) return;
    
    // إنشاء طبقة تغطية للخلفية
    overlay.className = 'menu-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 98;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);
    
    menuToggle.addEventListener('click', () => {
        navItems.classList.toggle('active');
        
        if (navItems.classList.contains('active')) {
            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.style.opacity = '1';
            }, 10);
            document.body.style.overflow = 'hidden';
        } else {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 300);
            document.body.style.overflow = '';
        }
    });
    
    overlay.addEventListener('click', () => {
        navItems.classList.remove('active');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
    });
    
    // تحسين للشاشات الأكبر
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767) {
            navItems.classList.remove('active');
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// ==================== تحسين العداد التنازلي ====================
function startCountdown() {
    const countdownTimer = document.getElementById('countdownTimer');
    const vipCount = document.getElementById('vipCount');
    const countdownContainer = document.getElementById('countdownContainer');
    
    if (!countdownTimer || !vipCount) return;
    
    // تحديد وقت النهاية (23:59:59 من اليوم الحالي)
    const now = new Date();
    const endTime = new Date(now);
    endTime.setHours(23, 59, 59, 999);
    
    function updateCountdown() {
        const now = new Date();
        const diff = endTime - now;
        
        if (diff <= 0) {
            // انتهى الوقت
            countdownTimer.textContent = '00:00:00';
            vipCount.textContent = '0';
            countdownContainer.classList.add('low-stock');
            
            // إضافة تأثير اهتزاز
            countdownContainer.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                countdownContainer.style.animation = '';
            }, 500);
            
            setTimeout(updateCountdown, 60000);
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // تحديث مع تأثير رقمي
        if (countdownTimer.textContent !== `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`) {
            countdownTimer.style.transform = 'scale(1.1)';
            setTimeout(() => {
                countdownTimer.style.transform = 'scale(1)';
            }, 200);
        }
        
        countdownTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // تحديث عدد الحسابات المتبقية
        const remainingVIP = Math.max(0, 5 - Math.floor((24 - hours) / 4));
        
        if (vipCount.textContent !== remainingVIP.toString()) {
            vipCount.style.transform = 'scale(1.2)';
            setTimeout(() => {
                vipCount.style.transform = 'scale(1)';
            }, 200);
        }
        
        vipCount.textContent = remainingVIP;
        
        if (remainingVIP <= 2) {
            countdownContainer.classList.add('low-stock');
        } else {
            countdownContainer.classList.remove('low-stock');
        }
        
        // التحديث كل ثانية
        setTimeout(updateCountdown, 1000);
    }
    
    updateCountdown();
}

// ==================== إضافة تأثيرات CSS جديدة ====================
function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .offer-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .offer-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 40px rgba(229, 9, 20, 0.3);
        }
        
        .offer-btn {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .offer-btn::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        
        .offer-btn:active::after {
            width: 300px;
            height: 300px;
        }
        
        .poster-item {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
        }
        
        .poster-item:hover {
            transform: scale(1.05) translateY(-5px);
            box-shadow: 0 15px 30px rgba(229, 9, 20, 0.4);
        }
        
        .vip-pulse {
            animation: pulse 2s ease-in-out infinite;
        }
        
        .offer-badge {
            animation: pulse 2s ease-in-out infinite;
        }
        
        .countdown-timer {
            transition: all 0.2s ease;
            font-feature-settings: "tnum";
            font-variant-numeric: tabular-nums;
        }
        
        #vipCount {
            transition: all 0.2s ease;
            display: inline-block;
        }
        
        @media (max-width: 767px) {
            .nav-items.active {
                position: fixed;
                top: 80px;
                right: 0;
                width: 80%;
                height: 100vh;
                background: var(--darker-black);
                z-index: 99;
                padding: 30px;
                box-shadow: -5px 0 20px rgba(0, 0, 0, 0.5);
                animation: slideInRight 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                }
                to {
                    transform: translateX(0);
                }
            }
            
            .poster-nav {
                position: sticky;
                bottom: 20px;
                background: var(--glass-bg);
                backdrop-filter: blur(10px);
                padding: 10px;
                border-radius: 50px;
                z-index: 10;
            }
        }
        
        /* تحسين التمرير */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--glass-bg);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--primary-red);
            border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #ff0a16;
        }
        
        /* تحسين النصوص */
        h1, h2, h3, h4, h5, h6 {
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
        }
        
        /* تحسين الأداء */
        .offer-card, .poster-item, .testimonial-card {
            will-change: transform;
            backface-visibility: hidden;
        }
    `;
    
    document.head.appendChild(style);
}

// ==================== تحديث أحداث المستخدم ====================
function setupEventListeners() {
    setupMobileMenu();
    
    // زر العودة للأعلى المحسن
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
            backToTop.style.transform = 'translateY(0)';
        } else {
            backToTop.classList.remove('visible');
            backToTop.style.transform = 'translateY(100px)';
        }
    }, { passive: true });
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        });
    }
    
    // شريط تقدم التمرير المحسن
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
        scrollProgress.style.opacity = scrolled > 0 ? '1' : '0';
    }, { passive: true });
    
    // زر كتم الصوت المحسن
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            const icon = soundToggle.querySelector('i');
            if (icon.classList.contains('fa-volume-up')) {
                icon.classList.remove('fa-volume-up');
                icon.classList.add('fa-volume-mute');
                soundToggle.style.background = '#f44336';
            } else {
                icon.classList.remove('fa-volume-mute');
                icon.classList.add('fa-volume-up');
                soundToggle.style.background = '';
            }
        });
    }
    
    // إخفاء رسالة الترحيب بعد 5 ثوان
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        setTimeout(() => {
            welcomeMessage.style.animation = 'slideDown 0.5s ease forwards';
        }, 5000);
    }
    
    // تبديل العملة المحسن
    const currencyItems = document.querySelectorAll('.currency-dropdown div');
    const currencyDisplay = document.getElementById('currencyDisplay');
    
    currencyItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const currency = e.target.dataset.currency;
            if (currency === 'dzd') {
                currencyDisplay.innerHTML = '🇩🇿 الدينار الجزائري ▼';
            } else {
                currencyDisplay.innerHTML = '🇺🇸 الدولار الأمريكي ▼';
            }
            updateCurrencyDisplay(currency);
            
            // إظهار إشعار
            showNotification(`تم تغيير العملة إلى ${currency === 'dzd' ? 'الدينار الجزائري' : 'الدولار الأمريكي'}`, 'success');
        });
    });
}

// ==================== التهيئة النهائية ====================
function initializePage() {
    // إنشاء النجوم المتحركة
    createStars();
    
    // إضافة الأنماط المخصصة
    addCustomStyles();
    
    // تحميل البيانات
    loadOffers();
    loadPosters();
    loadLivePurchases();
    loadTestimonials();
    loadFaqs();
    
    // تحديث العملة
    updateCurrencyDisplay();
    
    // إضافة تأثيرات التمرير
    initializeSmoothInteractions();
}

// تنفيذ التهيئة
initializePage();
