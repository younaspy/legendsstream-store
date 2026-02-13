/**
 * admin-panel.js
 * لوحة التحكم السرية لمتجر legendsstream
 * تحتوي على جميع وظائف الإدارة والتخزين المحلي
 */

// ==================== المتغيرات العامة ====================
const ADMIN_PASSWORD = 'alg12alg12alg';
let clickCount = 0;
let isAdminPanelOpen = false;

// مفاتيح التخزين المحلي
const STORAGE_KEYS = {
    OFFERS: 'legendsstream_offers',
    POSTERS: 'legendsstream_posters',
    ORDERS: 'legendsstream_orders',
    SETTINGS: 'legendsstream_settings',
    STATS: 'legendsstream_stats'
};

// ==================== البيانات الافتراضية ====================
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

const defaultPosters = [
    { id: 'poster1', title: 'Stranger Things', url: 'https://via.placeholder.com/200x300/E50914/ffffff?text=Stranger+Things' },
    { id: 'poster2', title: 'Squid Game', url: 'https://via.placeholder.com/200x300/8B0000/ffffff?text=Squid+Game' },
    { id: 'poster3', title: 'The Witcher', url: 'https://via.placeholder.com/200x300/1A1A1A/ffffff?text=The+Witcher' },
    { id: 'poster4', title: 'Money Heist', url: 'https://via.placeholder.com/200x300/E50914/ffffff?text=Money+Heist' },
    { id: 'poster5', title: 'Wednesday', url: 'https://via.placeholder.com/200x300/000000/ffffff?text=Wednesday' },
    { id: 'poster6', title: 'Dark', url: 'https://via.placeholder.com/200x300/2C3E50/ffffff?text=Dark' }
];

const defaultOrders = [
    { id: 'order1', customer: 'محمد', offer: 'VIP ROYAL', price: 2500, time: 'قبل دقيقة', timestamp: Date.now() - 60000 },
    { id: 'order2', customer: 'سارة', offer: 'PREMIUM', price: 1500, time: 'قبل 3 دقائق', timestamp: Date.now() - 180000 },
    { id: 'order3', customer: 'يوسف', offer: 'BASIC', price: 1000, time: 'قبل 7 دقائق', timestamp: Date.now() - 420000 }
];

const defaultTestimonials = [
    { id: 'test1', name: 'محمد', text: 'خدمة خرافية', stars: 5 },
    { id: 'test2', name: 'سارة', text: 'أفضل متجر', stars: 5 },
    { id: 'test3', name: 'يوسف', text: 'العرض الذهبي يستاهل', stars: 5 }
];

const defaultFaqs = [
    { id: 'faq1', question: '❓ كيف أستلم الحساب؟', answer: 'بعد الدفع، سيتم إرسال بيانات الحساب عبر واتساب فوراً.' },
    { id: 'faq2', question: '❓ هل يوجد ضمان؟', answer: 'نعم، ضمان لمدة شهر كامل ضد أي مشكلة.' },
    { id: 'faq3', question: '❓ ماذا لو واجهت مشكلة؟', answer: 'تواصل مع الدعم الفني عبر واتساب وسيتم حل المشكلة فوراً.' },
    { id: 'faq4', question: '❓ كم جهاز مسموح؟', answer: 'يمكنك استخدام الحساب على 4 أجهزة في نفس الوقت.' },
    { id: 'faq5', question: '❓ هل أستطيع تغيير كلمة السر؟', answer: 'لا، يمنع تغيير كلمة السر للحفاظ على الضمان.' }
];

const defaultSettings = {
    usdRate: 236,
    whatsappMessage: 'مرحباً، أريد شراء [OFFER_NAME] بسعر [OFFER_PRICE] دج من متجر legendsstream.',
    seasonalColors: true,
    whatsappNumber: '213675647764'
};

// ==================== التهيئة والتخزين المحلي ====================
function initializeStorage() {
    // تهيئة العروض
    if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
        localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(defaultOffers));
    }
    
    // تهيئة البوسترات
    if (!localStorage.getItem(STORAGE_KEYS.POSTERS)) {
        localStorage.setItem(STORAGE_KEYS.POSTERS, JSON.stringify(defaultPosters));
    }
    
    // تهيئة الطلبات
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(defaultOrders));
    }
    
    // تهيئة الإعدادات
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }
    
    // تهيئة الإحصائيات
    if (!localStorage.getItem(STORAGE_KEYS.STATS)) {
        initializeStats();
    }
}

function initializeStats() {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    const stats = {
        totalOrders: orders.length,
        totalSales: orders.reduce((sum, order) => sum + order.price, 0),
        topSelling: calculateTopSelling(orders),
        daily: [],
        weekly: [],
        monthly: []
    };
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
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

// ==================== نظام المصادقة ====================
function setupAdminAuth() {
    const logoTrigger = document.getElementById('logoTrigger');
    const passwordOverlay = document.getElementById('passwordOverlay');
    const adminPassword = document.getElementById('adminPassword');
    const submitPassword = document.getElementById('submitPassword');
    const cancelPassword = document.getElementById('cancelPassword');
    
    let clickTimer;
    
    logoTrigger.addEventListener('click', () => {
        clickCount++;
        
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 3000);
        
        if (clickCount === 7) {
            passwordOverlay.style.display = 'flex';
            clickCount = 0;
        }
    });
    
    submitPassword.addEventListener('click', () => {
        const password = adminPassword.value;
        if (password === ADMIN_PASSWORD) {
            passwordOverlay.style.display = 'none';
            openAdminPanel();
            adminPassword.value = '';
        } else {
            alert('❌ كلمة السر خطأ!');
            adminPassword.value = '';
        }
    });
    
    cancelPassword.addEventListener('click', () => {
        passwordOverlay.style.display = 'none';
        adminPassword.value = '';
    });
    
    // إغلاق عند الضغط على Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && passwordOverlay.style.display === 'flex') {
            passwordOverlay.style.display = 'none';
            adminPassword.value = '';
        }
    });
}

// ==================== فتح وإغلاق لوحة التحكم ====================
function openAdminPanel() {
    const adminPanel = document.getElementById('adminPanelOverlay');
    adminPanel.style.display = 'flex';
    isAdminPanelOpen = true;
    loadAdminData();
}

function closeAdminPanel() {
    const adminPanel = document.getElementById('adminPanelOverlay');
    adminPanel.style.display = 'none';
    isAdminPanelOpen = false;
}

// ==================== تحميل البيانات في لوحة التحكم ====================
function loadAdminData() {
    loadOffersManagement();
    loadStatsManagement();
    loadPostersManagement();
    loadSettingsManagement();
    loadReportManagement();
}

// إدارة العروض
function loadOffersManagement() {
    const offers = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS)) || [];
    const offersList = document.getElementById('offersList');
    
    if (!offersList) return;
    
    offersList.innerHTML = '';
    
    offers.forEach(offer => {
        const offerItem = document.createElement('div');
        offerItem.className = 'offer-item';
        offerItem.innerHTML = `
            <div>
                <span style="font-size: 24px; margin-left: 10px;">${offer.icon}</span>
                <strong>${offer.name}</strong> - ${offer.price} دج - ${offer.duration}
                <span class="offer-status ${offer.active ? 'active' : 'inactive'}" style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 10px;"></span>
            </div>
            <div class="offer-actions">
                <button onclick="editOffer('${offer.id}')" title="تعديل"><i class="fas fa-edit"></i></button>
                <button onclick="toggleOffer('${offer.id}')" title="${offer.active ? 'تعطيل' : 'تفعيل'}">
                    <i class="fas ${offer.active ? 'fa-eye-slash' : 'fa-eye'}"></i>
                </button>
                <button onclick="deleteOffer('${offer.id}')" title="حذف"><i class="fas fa-trash"></i></button>
            </div>
        `;
        offersList.appendChild(offerItem);
    });
}

window.editOffer = function(offerId) {
    const offers = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS)) || [];
    const offer = offers.find(o => o.id === offerId);
    
    if (offer) {
        document.getElementById('offerName').value = offer.name;
        document.getElementById('offerPrice').value = offer.price;
        document.getElementById('offerDuration').value = offer.duration;
        document.getElementById('offerFeatures').value = offer.features.join('، ');
        document.getElementById('offerIcon').value = offer.icon;
        document.getElementById('offerColor').value = offer.color;
        document.getElementById('offerActive').checked = offer.active;
        
        document.getElementById('offerForm').style.display = 'block';
        document.getElementById('offerFormTitle').textContent = 'تعديل العرض';
        
        // تخزين ID للتحديث
        document.getElementById('offerForm').dataset.editId = offerId;
    }
};

window.toggleOffer = function(offerId) {
    const offers = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS)) || [];
    const offerIndex = offers.findIndex(o => o.id === offerId);
    
    if (offerIndex !== -1) {
        offers[offerIndex].active = !offers[offerIndex].active;
        localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
        loadOffersManagement();
        
        // تحديث الصفحة الرئيسية
        if (window.updateMainPageOffers) {
            window.updateMainPageOffers();
        }
    }
};

window.deleteOffer = function(offerId) {
    if (confirm('هل أنت متأكد من حذف هذا العرض؟')) {
        const offers = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS)) || [];
        const filteredOffers = offers.filter(o => o.id !== offerId);
        localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(filteredOffers));
        loadOffersManagement();
        
        // تحديث الصفحة الرئيسية
        if (window.updateMainPageOffers) {
            window.updateMainPageOffers();
        }
    }
};

// إضافة عرض جديد
document.addEventListener('DOMContentLoaded', function() {
    const addOfferBtn = document.getElementById('addOfferBtn');
    const offerForm = document.getElementById('offerForm');
    const cancelOffer = document.getElementById('cancelOffer');
    const saveOffer = document.getElementById('saveOffer');
    
    if (addOfferBtn) {
        addOfferBtn.addEventListener('click', () => {
            document.getElementById('offerForm').reset();
            document.getElementById('offerActive').checked = true;
            document.getElementById('offerForm').style.display = 'block';
            document.getElementById('offerFormTitle').textContent = 'إضافة عرض جديد';
            delete document.getElementById('offerForm').dataset.editId;
        });
    }
    
    if (cancelOffer) {
        cancelOffer.addEventListener('click', () => {
            offerForm.style.display = 'none';
            offerForm.reset();
        });
    }
    
    if (saveOffer) {
        saveOffer.addEventListener('click', () => {
            saveOfferHandler();
        });
    }
});

function saveOfferHandler() {
    const offerName = document.getElementById('offerName').value;
    const offerPrice = document.getElementById('offerPrice').value;
    const offerDuration = document.getElementById('offerDuration').value;
    const offerFeatures = document.getElementById('offerFeatures').value;
    const offerIcon = document.getElementById('offerIcon').value;
    const offerColor = document.getElementById('offerColor').value;
    const offerActive = document.getElementById('offerActive').checked;
    const editId = document.getElementById('offerForm').dataset.editId;
    
    if (!offerName || !offerPrice || !offerDuration) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return;
    }
    
    const offers = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS)) || [];
    
    const newOffer = {
        id: editId || 'offer_' + Date.now(),
        name: offerName,
        price: parseInt(offerPrice),
        duration: offerDuration,
        features: offerFeatures.split('،').map(f => f.trim()),
        icon: offerIcon || '🛒',
        color: offerColor,
        active: offerActive,
        isVip: offerColor === 'gold'
    };
    
    if (editId) {
        // تعديل عرض موجود
        const index = offers.findIndex(o => o.id === editId);
        if (index !== -1) {
            offers[index] = newOffer;
        }
    } else {
        // إضافة عرض جديد
        offers.push(newOffer);
    }
    
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    
    document.getElementById('offerForm').style.display = 'none';
    document.getElementById('offerForm').reset();
    loadOffersManagement();
    
    // تحديث الصفحة الرئيسية
    if (window.updateMainPageOffers) {
        window.updateMainPageOffers();
    }
}

// إحصائيات الطلبات
function loadStatsManagement() {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    const stats = JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS)) || {
        totalOrders: 0,
        totalSales: 0,
        topSelling: '-'
    };
    
    // تحديث العدادات
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('totalSales').textContent = orders.reduce((sum, o) => sum + o.price, 0) + ' دج';
    document.getElementById('topSelling').textContent = calculateTopSelling(orders);
    
    // تحديث جدول الطلبات
    const ordersList = document.getElementById('ordersList');
    if (ordersList) {
        ordersList.innerHTML = '';
        
        orders.slice().reverse().forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.offer}</td>
                <td>${order.price} دج</td>
                <td>${new Date(order.timestamp).toLocaleString('ar-EG')}</td>
                <td><button onclick="showWhatsappMessage('${order.offer}', ${order.price})"><i class="fas fa-eye"></i></button></td>
            `;
            ordersList.appendChild(row);
        });
    }
}

window.showWhatsappMessage = function(offerName, price) {
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || defaultSettings;
    let message = settings.whatsappMessage
        .replace('[OFFER_NAME]', offerName)
        .replace('[OFFER_PRICE]', price);
    alert(`رسالة واتساب: ${message}`);
};

// إدارة البوسترات
function loadPostersManagement() {
    const posters = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTERS)) || [];
    const postersGrid = document.getElementById('postersGridAdmin');
    
    if (!postersGrid) return;
    
    postersGrid.innerHTML = '';
    
    posters.forEach(poster => {
        const posterItem = document.createElement('div');
        posterItem.className = 'poster-item';
        posterItem.draggable = true;
        posterItem.dataset.id = poster.id;
        posterItem.innerHTML = `
            <img src="${poster.url}" alt="${poster.title}" loading="lazy">
            <div class="poster-delete" onclick="deletePoster('${poster.id}')">
                <i class="fas fa-times"></i>
            </div>
        `;
        postersGrid.appendChild(posterItem);
    });
    
    // تفعيل السحب والإفلات
    enableDragAndDrop();
}

window.deletePoster = function(posterId) {
    if (confirm('هل أنت متأكد من حذف هذا البوستر؟')) {
        const posters = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTERS)) || [];
        const filteredPosters = posters.filter(p => p.id !== posterId);
        localStorage.setItem(STORAGE_KEYS.POSTERS, JSON.stringify(filteredPosters));
        loadPostersManagement();
        
        // تحديث الصفحة الرئيسية
        if (window.updateMainPagePosters) {
            window.updateMainPagePosters();
        }
    }
};

function enableDragAndDrop() {
    const posters = document.querySelectorAll('#postersGridAdmin .poster-item');
    let draggedItem = null;
    
    posters.forEach(poster => {
        poster.addEventListener('dragstart', (e) => {
            draggedItem = poster;
            e.dataTransfer.setData('text/plain', poster.dataset.id);
        });
        
        poster.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        poster.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedItem && draggedItem !== poster) {
                const postersGrid = document.getElementById('postersGridAdmin');
                const items = [...postersGrid.children];
                const draggedIndex = items.indexOf(draggedItem);
                const targetIndex = items.indexOf(poster);
                
                if (draggedIndex < targetIndex) {
                    postersGrid.insertBefore(draggedItem, poster.nextSibling);
                } else {
                    postersGrid.insertBefore(draggedItem, poster);
                }
                
                // حفظ الترتيب الجديد
                savePostersOrder();
            }
        });
    });
}

function savePostersOrder() {
    const postersGrid = document.getElementById('postersGridAdmin');
    const posterItems = [...postersGrid.children];
    const posters = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTERS)) || [];
    
    const orderedPosters = [];
    posterItems.forEach(item => {
        const poster = posters.find(p => p.id === item.dataset.id);
        if (poster) {
            orderedPosters.push(poster);
        }
    });
    
    localStorage.setItem(STORAGE_KEYS.POSTERS, JSON.stringify(orderedPosters));
    
    // تحديث الصفحة الرئيسية
    if (window.updateMainPagePosters) {
        window.updateMainPagePosters();
    }
}

// رفع البوسترات
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const posterUpload = document.getElementById('posterUpload');
    const uploadPreview = document.getElementById('uploadPreview');
    
    if (uploadArea && posterUpload) {
        uploadArea.addEventListener('click', () => {
            posterUpload.click();
        });
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#E50914';
            uploadArea.style.background = 'rgba(229, 9, 20, 0.1)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '';
            uploadArea.style.background = '';
            
            const files = e.dataTransfer.files;
            handlePosterUpload(files);
        });
        
        posterUpload.addEventListener('change', (e) => {
            handlePosterUpload(e.target.files);
        });
    }
});

function handlePosterUpload(files) {
    const uploadPreview = document.getElementById('uploadPreview');
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                // عرض معاينة
                const preview = document.createElement('div');
                preview.className = 'poster-item';
                preview.style.minWidth = '100px';
                preview.style.height = '150px';
                preview.innerHTML = `<img src="${e.target.result}" alt="معاينة">`;
                uploadPreview.appendChild(preview);
                
                // حفظ في Local Storage
                const posters = JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTERS)) || [];
                const newPoster = {
                    id: 'poster_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    title: file.name,
                    url: e.target.result
                };
                posters.push(newPoster);
                localStorage.setItem(STORAGE_KEYS.POSTERS, JSON.stringify(posters));
                
                // تحديث المعرض
                loadPostersManagement();
                
                // تحديث الصفحة الرئيسية
                if (window.updateMainPagePosters) {
                    window.updateMainPagePosters();
                }
            };
            
            reader.readAsDataURL(file);
        }
    });
}

// إعدادات المتجر
function loadSettingsManagement() {
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || defaultSettings;
    
    document.getElementById('usdRate').value = settings.usdRate;
    document.getElementById('whatsappMessage').value = settings.whatsappMessage;
    document.getElementById('seasonalColors').checked = settings.seasonalColors;
}

// حفظ الإعدادات
document.addEventListener('DOMContentLoaded', function() {
    const usdRate = document.getElementById('usdRate');
    const whatsappMessage = document.getElementById('whatsappMessage');
    const seasonalColors = document.getElementById('seasonalColors');
    const resetStats = document.getElementById('resetStats');
    const exportBackup = document.getElementById('exportBackup');
    const importBackup = document.getElementById('importBackup');
    const backupFile = document.getElementById('backupFile');
    
    if (usdRate) {
        usdRate.addEventListener('change', () => {
            saveSettings();
        });
    }
    
    if (whatsappMessage) {
        whatsappMessage.addEventListener('change', () => {
            saveSettings();
        });
    }
    
    if (seasonalColors) {
        seasonalColors.addEventListener('change', () => {
            saveSettings();
        });
    }
    
    if (resetStats) {
        resetStats.addEventListener('click', () => {
            if (confirm('هل أنت متأكد من إعادة تعيين جميع الإحصائيات؟')) {
                localStorage.removeItem(STORAGE_KEYS.ORDERS);
                localStorage.removeItem(STORAGE_KEYS.STATS);
                initializeStats();
                loadStatsManagement();
                alert('تم إعادة تعيين الإحصائيات بنجاح');
            }
        });
    }
    
    if (exportBackup) {
        exportBackup.addEventListener('click', () => {
            exportBackupData();
        });
    }
    
    if (importBackup) {
        importBackup.addEventListener('click', () => {
            backupFile.click();
        });
    }
    
    if (backupFile) {
        backupFile.addEventListener('change', (e) => {
            importBackupData(e.target.files[0]);
        });
    }
});

function saveSettings() {
    const settings = {
        usdRate: parseInt(document.getElementById('usdRate').value) || 236,
        whatsappMessage: document.getElementById('whatsappMessage').value,
        seasonalColors: document.getElementById('seasonalColors').checked,
        whatsappNumber: '213675647764'
    };
    
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    
    // تطبيق الألوان الموسمية
    if (settings.seasonalColors) {
        applySeasonalColors();
    }
}

function applySeasonalColors() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    document.body.className = '';
    
    // رمضان (التاريخ التقريبي)
    if ((month === 3 && day >= 10) || (month === 4 && day <= 10)) {
        document.body.classList.add('ramadan');
    }
    // العيد
    else if ((month === 4 && day >= 1 && day <= 5) || (month === 6 && day >= 28)) {
        document.body.classList.add('eid');
    }
    // الشتاء
    else if (month === 12 || month === 1 || month === 2) {
        document.body.classList.add('winter');
    }
    // الصيف
    else if (month === 6 || month === 7 || month === 8) {
        document.body.classList.add('summer');
    }
}

// تصدير واستيراد النسخ الاحتياطية
function exportBackupData() {
    const backup = {
        offers: JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS)),
        posters: JSON.parse(localStorage.getItem(STORAGE_KEYS.POSTERS)),
        orders: JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)),
        settings: JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)),
        stats: JSON.parse(localStorage.getItem(STORAGE_KEYS.STATS)),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `legendsstream_backup_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importBackupData(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const backup = JSON.parse(e.target.result);
            
            if (backup.offers) localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(backup.offers));
            if (backup.posters) localStorage.setItem(STORAGE_KEYS.POSTERS, JSON.stringify(backup.posters));
            if (backup.orders) localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(backup.orders));
            if (backup.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(backup.settings));
            if (backup.stats) localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(backup.stats));
            
            alert('تم استيراد النسخة الاحتياطية بنجاح');
            location.reload();
        } catch (error) {
            alert('خطأ في ملف النسخة الاحتياطية');
        }
    };
    
    reader.readAsText(file);
}

// تقرير النجاح
function loadReportManagement() {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    const offers = JSON.parse(localStorage.getItem(STORAGE_KEYS.OFFERS)) || [];
    
    // إجمالي المبيعات التقديرية
    const totalSales = orders.reduce((sum, o) => sum + o.price, 0);
    document.getElementById('estimatedSales').textContent = totalSales + ' دج';
    
    // زبائن جدد هذا الأسبوع
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const newCustomers = orders.filter(o => o.timestamp > oneWeekAgo).length;
    document.getElementById('newCustomers').textContent = newCustomers;
    
    // العرض الأكثر مبيعاً
    document.getElementById('bestSeller').textContent = calculateTopSelling(orders);
    
    // أوقات الذروة
    const peakHours = calculatePeakHours(orders);
    document.getElementById('peakHours').textContent = peakHours;
    
    // معدل النمو
    const growthRate = calculateGrowthRate(orders);
    document.getElementById('growthRate').textContent = growthRate;
    
    // توصيات ذكية
    generateRecommendations(orders, offers);
}

function calculatePeakHours(orders) {
    const hourCounts = {};
    
    orders.forEach(order => {
        const hour = new Date(order.timestamp).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    let peakHour = null;
    let maxCount = 0;
    
    for (const [hour, count] of Object.entries(hourCounts)) {
        if (count > maxCount) {
            maxCount = count;
            peakHour = hour;
        }
    }
    
    return peakHour ? `${peakHour}:00 - ${parseInt(peakHour) + 1}:00` : '-';
}

function calculateGrowthRate(orders) {
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = now - (14 * 24 * 60 * 60 * 1000);
    
    const lastWeek = orders.filter(o => o.timestamp > oneWeekAgo).length;
    const previousWeek = orders.filter(o => o.timestamp <= oneWeekAgo && o.timestamp > twoWeeksAgo).length;
    
    if (previousWeek === 0) return '+100%';
    
    const growth = ((lastWeek - previousWeek) / previousWeek * 100).toFixed(0);
    return (growth > 0 ? '+' : '') + growth + '%';
}

function generateRecommendations(orders, offers) {
    const recommendations = [];
    const recommendationsList = document.getElementById('recommendationsList');
    
    if (!recommendationsList) return;
    
    // تحليل العروض
    const offerSales = {};
    offers.forEach(offer => {
        offerSales[offer.name] = 0;
    });
    
    orders.forEach(order => {
        if (offerSales[order.offer] !== undefined) {
            offerSales[order.offer]++;
        }
    });
    
    // توصيات بناءً على المبيعات
    const bestSeller = calculateTopSelling(orders);
    if (bestSeller !== '-') {
        recommendations.push(`✨ العرض "${bestSeller}" هو الأكثر مبيعاً - زود المخزون`);
    }
    
    // توصيات للعروض
    if (!offers.some(o => o.duration.includes('6 أشهر'))) {
        recommendations.push('💡 أضف عرض 6 أشهر - قد يزيد المبيعات');
    }
    
    if (offers.some(o => o.color === 'gold' && o.price < 3000)) {
        recommendations.push('💰 زد سعر العرض الذهبي - الطلب مرتفع');
    }
    
    if (offers.length < 4) {
        recommendations.push('📦 أضف باقة عائلية جديدة');
    }
    
    if (orders.length < 10) {
        recommendations.push('📢 تحتاج إلى تفعيل التسويق - المبيعات منخفضة');
    }
    
    // عرض التوصيات
    recommendationsList.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-lightbulb" style="color: gold;"></i> ${rec}`;
        recommendationsList.appendChild(li);
    });
    
    if (recommendations.length === 0) {
        recommendationsList.innerHTML = '<li>🎉 كل شيء مثالي! لا توجد توصيات</li>';
    }
}

// ==================== التهيئة ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeStorage();
    setupAdminAuth();
    
    // إغلاق لوحة التحكم
    const closeAdmin = document.getElementById('closeAdminPanel');
    if (closeAdmin) {
        closeAdmin.addEventListener('click', closeAdminPanel);
    }
    
    // تبديل التبويبات
    const adminTabs = document.querySelectorAll('.admin-tab');
    adminTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // إزالة التفعيل من جميع التبويبات
            adminTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
            
            // تفعيل التبويب الحالي
            tab.classList.add('active');
            const tabId = tab.dataset.tab;
            document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`).classList.add('active');
        });
    });
    
    // تطبيق الألوان الموسمية
    applySeasonalColors();
});

// ==================== تصدير الدوال للاستخدام العام ====================
window.refreshAdminData = loadAdminData;