/**
 * script.js
 * ملف الجافاسكريبت الرئيسي لمتجر legendsstream
 * يحتوي على جميع وظائف الصفحة الرئيسية والتفاعلات
 */

// ==================== تهيئة الصفحة ====================
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    setupEventListeners();
    loadInitialData();
    startCountdown();
    animateStars();
});

// ==================== التهيئة ====================
function initializePage() {
    // إنشاء النجوم المتحركة
    createStars();
    
    // تحميل البيانات من Local Storage
    loadOffers();
    loadPosters();
    loadLivePurchases();
    loadTestimonials();
    loadFaqs();
    
    // تحديث العملة
    updateCurrencyDisplay();
    
    // تفعيل التمرير السلس
    setupSmoothScroll();
}

function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.background = 'white';
        star.style.borderRadius = '50%';
        star.style.animation = `twinkling ${Math.random() * 3 + 2}s linear infinite`;
        star.style.opacity = Math.random();
        starsContainer.appendChild(star);
    }
}

function animateStars() {
    const stars = document.querySelectorAll('#stars div');
    stars.forEach(star => {
        setInterval(() => {
            star.style.opacity = Math.random();
        }, Math.random() * 3000 + 2000);
    });
}

// ==================== تحميل البيانات ====================
function loadInitialData() {
    // التأكد من وجود البيانات في Local Storage
    if (!localStorage.getItem('legendsstream_offers')) {
        initializeDefaultData();
    }
}

function initializeDefaultData() {
    const defaultOffers = [
        {
            id: 'offer1',
            icon: '🥉',
            name: 'BASIC',
            price: 1000,
            duration: 'شهر واحد',
            features: ['4K بريميوم', '4 أجهزة'],
            color: 'bronze',
            active: true,
            isVip: false
        },
        {
            id: 'offer2',
            icon: '🥈',
            name: 'PREMIUM',
            price: 1500,
            duration: 'شهران',
            features: ['4K بريميوم', '4 أجهزة'],
            color: 'silver',
            active: true,
            isVip: false
        },
        {
            id: 'offer3',
            icon: '👑',
            name: 'VIP ROYAL',
            price: 2500,
            duration: '3 أشهر',
            features: ['4K بريميوم VIP', '4 أجهزة', 'دعم VIP'],
            color: 'gold',
            active: true,
            isVip: true
        }
    ];
    
    localStorage.setItem('legendsstream_offers', JSON.stringify(defaultOffers));
}

// ==================== عرض العروض ====================
function loadOffers() {
    const offersGrid = document.getElementById('offersGrid');
    if (!offersGrid) return;
    
    const offers = JSON.parse(localStorage.getItem('legendsstream_offers')) || [];
    const settings = JSON.parse(localStorage.getItem('legendsstream_settings')) || { usdRate: 236 };
    
    offersGrid.innerHTML = '';
    
    offers.filter(offer => offer.active).forEach(offer => {
        const usdPrice = (offer.price / settings.usdRate).toFixed(2);
        const card = createOfferCard(offer, usdPrice);
        offersGrid.appendChild(card);
    });
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

// ==================== معالجة الطلبات ====================
window.handleOrder = function(offerId) {
    const offers = JSON.parse(localStorage.getItem('legendsstream_offers')) || [];
    const settings = JSON.parse(localStorage.getItem('legendsstream_settings')) || {
        whatsappNumber: '213675647764',
        whatsappMessage: 'مرحباً، أريد شراء [OFFER_NAME] بسعر [OFFER_PRICE] دج من متجر legendsstream.'
    };
    
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;
    
    // تحضير رسالة واتساب
    let message = settings.whatsappMessage
        .replace('[OFFER_NAME]', offer.name)
        .replace('[OFFER_PRICE]', offer.price);
    
    // توجيه إلى واتساب
    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // تسجيل الطلب
    recordOrder(offer);
};

function recordOrder(offer) {
    const orders = JSON.parse(localStorage.getItem('legendsstream_orders')) || [];
    
    const newOrder = {
        id: 'order_' + Date.now(),
        customer: 'زبون جديد',
        offer: offer.name,
        price: offer.price,
        time: 'الآن',
        timestamp: Date.now()
    };
    
    orders.push(newOrder);
    localStorage.setItem('legendsstream_orders', JSON.stringify(orders));
    
    // تحديث الإحصائيات
    updateStats();
    
    // تحديث آخر المشتريات
    loadLivePurchases();
    
    // إظهار إشعار
    showNotification(`✅ تم تسجيل طلب ${offer.name}`);
}

function updateStats() {
    const orders = JSON.parse(localStorage.getItem('legendsstream_orders')) || [];
    
    const stats = {
        totalOrders: orders.length,
        totalSales: orders.reduce((sum, order) => sum + order.price, 0),
        topSelling: calculateTopSelling(orders)
    };
    
    localStorage.setItem('legendsstream_stats', JSON.stringify(stats));
}

function calculateTopSelling(orders) {
    const offerCounts = {};
    orders.forEach(order => {
        offerCounts[order.offer] = (offerCounts[order.offer] || 0) + 1;
    });
    
    let topOffer = null;
    let maxCount = 0;
    
    for (const [offer, count] of Object.entries(offerCounts)) {
        if (count > maxCount) {
            maxCount = count;
            topOffer = offer;
        }
    }
    
    return topOffer || '-';
}

function showNotification(message) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // تنسيق الإشعار
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    notification.style.color = 'white';
    notification.style.padding = '15px 30px';
    notification.style.borderRadius = '50px';
    notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideUp 0.3s ease';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    
    document.body.appendChild(notification);
    
    // إزالة الإشعار بعد 3 ثوان
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ==================== معرض البوسترات ====================
function loadPosters() {
    const postersSlider = document.getElementById('postersSlider');
    if (!postersSlider) return;
    
    const posters = JSON.parse(localStorage.getItem('legendsstream_posters')) || [];
    
    postersSlider.innerHTML = '';
    
    posters.forEach(poster => {
        const posterItem = document.createElement('div');
        posterItem.className = 'poster-item';
        posterItem.innerHTML = `
            <img src="${poster.url}" alt="${poster.title}" loading="lazy" onload="this.classList.add('loaded')">
        `;
        postersSlider.appendChild(posterItem);
    });
}

// ==================== آخر المشتريات الحية ====================
function loadLivePurchases() {
    const purchasesTicker = document.getElementById('purchasesTicker');
    if (!purchasesTicker) return;
    
    const orders = JSON.parse(localStorage.getItem('legendsstream_orders')) || [];
    
    // أخذ آخر 5 طلبات
    const recentOrders = orders.slice(-5).reverse();
    
    let tickerContent = '<div class="purchases-ticker-content">';
    
    recentOrders.forEach(order => {
        tickerContent += `
            <span class="purchase-item">
                <i class="fas fa-circle" style="color: #4CAF50; font-size: 8px;"></i>
                ${order.customer || 'زبون'} اشترى ${order.offer} ${order.time}
            </span>
        `;
    });
    
    tickerContent += '</div>';
    purchasesTicker.innerHTML = tickerContent;
    
    // إضافة نسخة مكررة للتمرير المستمر
    setTimeout(() => {
        if (purchasesTicker.firstChild) {
            const clone = purchasesTicker.firstChild.cloneNode(true);
            purchasesTicker.appendChild(clone);
        }
    }, 100);
}

// ==================== آراء الزبائن ====================
function loadTestimonials() {
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    if (!testimonialsGrid) return;
    
    const defaultTestimonials = [
        { id: 'test1', name: 'محمد', text: 'خدمة خرافية', stars: 5 },
        { id: 'test2', name: 'سارة', text: 'أفضل متجر', stars: 5 },
        { id: 'test3', name: 'يوسف', text: 'العرض الذهبي يستاهل', stars: 5 }
    ];
    
    testimonialsGrid.innerHTML = '';
    
    defaultTestimonials.forEach(testimonial => {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        
        const stars = '★'.repeat(testimonial.stars) + '☆'.repeat(5 - testimonial.stars);
        
        card.innerHTML = `
            <div class="testimonial-stars">${stars}</div>
            <div class="testimonial-text">"${testimonial.text}"</div>
            <div class="testimonial-author">- ${testimonial.name}</div>
        `;
        
        testimonialsGrid.appendChild(card);
    });
}

// ==================== الأسئلة الشائعة ====================
function loadFaqs() {
    const faqContainer = document.getElementById('faqContainer');
    if (!faqContainer) return;
    
    const defaultFaqs = [
        { id: 'faq1', question: '❓ كيف أستلم الحساب؟', answer: 'بعد الدفع، سيتم إرسال بيانات الحساب عبر واتساب فوراً.' },
        { id: 'faq2', question: '❓ هل يوجد ضمان؟', answer: 'نعم، ضمان لمدة شهر كامل ضد أي مشكلة.' },
        { id: 'faq3', question: '❓ ماذا لو واجهت مشكلة؟', answer: 'تواصل مع الدعم الفني عبر واتساب وسيتم حل المشكلة فوراً.' },
        { id: 'faq4', question: '❓ كم جهاز مسموح؟', answer: 'يمكنك استخدام الحساب على 4 أجهزة في نفس الوقت.' },
        { id: 'faq5', question: '❓ هل أستطيع تغيير كلمة السر؟', answer: 'لا، يمنع تغيير كلمة السر للحفاظ على الضمان.' }
    ];
    
    faqContainer.innerHTML = '';
    
    defaultFaqs.forEach(faq => {
        const item = document.createElement('div');
        item.className = 'faq-item';
        item.innerHTML = `
            <div class="faq-question">
                <i class="fas fa-question-circle"></i>
                ${faq.question}
                <i class="fas fa-chevron-down" style="margin-right: auto;"></i>
            </div>
            <div class="faq-answer">${faq.answer}</div>
        `;
        
        item.addEventListener('click', () => {
            item.classList.toggle('active');
            const icon = item.querySelector('.fa-chevron-down');
            if (icon) {
                icon.style.transform = item.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
            }
        });
        
        faqContainer.appendChild(item);
    });
}

// ==================== العداد التنازلي ====================
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
            
            // تحديث كل دقيقة للتأكد من الدقة
            setTimeout(updateCountdown, 60000);
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // تحديث عدد الحسابات المتبقية (يتناقص مع الوقت)
        const remainingVIP = Math.max(0, 5 - Math.floor((24 - hours) / 4));
        vipCount.textContent = remainingVIP;
        
        if (remainingVIP <= 2) {
            countdownContainer.classList.add('low-stock');
        }
        
        // التحديث كل ثانية
        setTimeout(updateCountdown, 1000);
    }
    
    updateCountdown();
}

// ==================== أحداث المستخدم ====================
function setupEventListeners() {
    // قائمة الهاتف المحمول
    const menuToggle = document.getElementById('menuToggle');
    const navItems = document.getElementById('navItems');
    
    if (menuToggle && navItems) {
        menuToggle.addEventListener('click', () => {
            navItems.classList.toggle('active');
        });
    }
    
    // زر العودة للأعلى
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // شريط تقدم التمرير
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });
    
    // تبديل العملة
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
        });
    });
    
    // زر كتم الصوت (تأثير بصري)
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            const icon = soundToggle.querySelector('i');
            if (icon.classList.contains('fa-volume-up')) {
                icon.classList.remove('fa-volume-up');
                icon.classList.add('fa-volume-mute');
            } else {
                icon.classList.remove('fa-volume-mute');
                icon.classList.add('fa-volume-up');
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
}

function updateCurrencyDisplay(currency = 'dzd') {
    const offers = JSON.parse(localStorage.getItem('legendsstream_offers')) || [];
    const settings = JSON.parse(localStorage.getItem('legendsstream_settings')) || { usdRate: 236 };
    
    const priceElements = document.querySelectorAll('.offer-price');
    
    offers.forEach((offer, index) => {
        if (priceElements[index]) {
            const priceDZD = offer.price;
            const priceUSD = (priceDZD / settings.usdRate).toFixed(2);
            
            if (currency === 'dzd') {
                priceElements[index].innerHTML = `${priceDZD} دج <small>| ${priceUSD}$</small>`;
            } else {
                priceElements[index].innerHTML = `${priceUSD}$ <small>| ${priceDZD} دج</small>`;
            }
        }
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ==================== تحديث الصفحة من لوحة التحكم ====================
window.updateMainPageOffers = function() {
    loadOffers();
};

window.updateMainPagePosters = function() {
    loadPosters();
};

// ==================== تصدير الدوال ====================
window.refreshMainPage = function() {
    loadOffers();
    loadPosters();
    loadLivePurchases();
};