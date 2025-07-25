// admin.js - ניהול תאריך סיום קמפיין
(function() {
    'use strict';
    
    const STORAGE_KEY = 'campaignEndDate';
    const TITLE_KEY = 'campaignTitle';
    
    // אלמנטים
    const dateInput = document.getElementById('campaign-end-date');
    const titleInput = document.getElementById('campaign-title');
    const adminMessage = document.getElementById('admin-message');
    const currentEndDate = document.getElementById('current-end-date');
    const currentTitle = document.getElementById('current-title');
    const timeRemaining = document.getElementById('time-remaining');
    
    // פונקציה להצגת הודעה למשתמש
    function showMessage(message, type = 'success') {
        if (!adminMessage) return;
        
        adminMessage.textContent = message;
        adminMessage.className = `admin-message ${type}`;
        adminMessage.style.display = 'block';
        
        setTimeout(() => {
            adminMessage.style.display = 'none';
        }, 5000);
    }
    
    // פונקציה לטעינת נתונים קיימים
    function loadCurrentData() {
        const savedDate = localStorage.getItem(STORAGE_KEY);
        const savedTitle = localStorage.getItem(TITLE_KEY) || 'טיימר קמפיין';
        
        if (savedDate) {
            const date = new Date(savedDate);
            
            // עדכון תצוגה
            if (currentEndDate) {
                currentEndDate.textContent = date.toLocaleString('he-IL');
            }
            if (currentTitle) {
                currentTitle.textContent = savedTitle;
            }
            
            // חישוב זמן נותר
            const now = new Date().getTime();
            const end = date.getTime();
            const difference = end - now;
            
            if (difference <= 0) {
                if (timeRemaining) timeRemaining.textContent = 'הקמפיין הסתיים';
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                
                if (timeRemaining) {
                    timeRemaining.textContent = `${days} ימים, ${hours} שעות, ${minutes} דקות`;
                }
            }
            
            // עדכון שדה התאריך
            if (dateInput) {
                const dateString = date.toISOString().slice(0, 16);
                dateInput.value = dateString;
            }
            
            // עדכון שדה הכותרת
            if (titleInput) {
                titleInput.value = savedTitle;
            }
        } else {
            if (currentEndDate) currentEndDate.textContent = 'לא הוגדר';
            if (currentTitle) currentTitle.textContent = 'לא הוגדר';
            if (timeRemaining) timeRemaining.textContent = 'לא זמין';
        }
    }
    
    // פונקציה לשמירת תאריך חדש
    function saveCampaignDate() {
        if (!dateInput || !titleInput) return;
        
        const dateValue = dateInput.value;
        const titleValue = titleInput.value.trim();
        
        if (!dateValue) {
            showMessage('אנא בחר תאריך ושעה', 'error');
            return;
        }
        
        if (!titleValue) {
            showMessage('אנא הכנס כותרת לקמפיין', 'error');
            return;
        }
        
        const selectedDate = new Date(dateValue);
        const now = new Date();
        
        if (selectedDate <= now) {
            showMessage('תאריך הסיום חייב להיות בעתיד', 'error');
            return;
        }
        
        try {
            localStorage.setItem(STORAGE_KEY, selectedDate.toISOString());
            localStorage.setItem(TITLE_KEY, titleValue);
            
            showMessage('✅ התאריך נשמר בהצלחה!');
            loadCurrentData();
            
            // רענון הטיימר בחלונות אחרים
            if (window.opener && !window.opener.closed) {
                window.opener.location.reload();
            }
            
        } catch (error) {
            showMessage('❌ שגיאה בשמירת התאריך', 'error');
            console.error('Error saving campaign date:', error);
        }
    }
    
    // פונקציה לניקוי תאריך
    function clearCampaignDate() {
        if (confirm('האם אתה בטוח שברצונך למחוק את תאריך הסיום?')) {
            try {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(TITLE_KEY);
                
                showMessage('🗑️ התאריך נמחק בהצלחה');
                loadCurrentData();
                
                if (dateInput) dateInput.value = '';
                if (titleInput) titleInput.value = '';
                
                // רענון הטיימר בחלונות אחרים
                if (window.opener && !window.opener.closed) {
                    window.opener.location.reload();
                }
                
            } catch (error) {
                showMessage('❌ שגיאה במחיקת התאריך', 'error');
                console.error('Error clearing campaign date:', error);
            }
        }
    }
    
    // אתחול ערכי ברירת מחדל
    function setDefaultDate() {
        if (dateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 7);
            tomorrow.setHours(23, 59, 0, 0);
            
            const dateString = tomorrow.toISOString().slice(0, 16);
            dateInput.value = dateString;
        }
    }
    
    // אתחול כאשר הדף נטען
    function initAdmin() {
        loadCurrentData();
        setDefaultDate();
        
        // חשיפה לשימוש גלובלי
        window.saveCampaignDate = saveCampaignDate;
        window.clearCampaignDate = clearCampaignDate;
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdmin);
    } else {
        initAdmin();
    }
    
})();
