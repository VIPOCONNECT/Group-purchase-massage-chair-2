// timer.js - לוגיקת טיימר קמפיין
(function() {
    'use strict';
    
    const STORAGE_KEY = 'campaignEndDate';
    const TITLE_KEY = 'campaignTitle';
    
    // אלמנטים
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const messageEl = document.getElementById('timer-message');
    
    // פונקציה לקבלת תאריך סיום מה-localStorage
    function getCampaignEndDate() {
        const dateStr = localStorage.getItem(STORAGE_KEY);
        return dateStr ? new Date(dateStr) : null;
    }
    
    // פונקציה לקבלת כותרת הקמפיין
    function getCampaignTitle() {
        return localStorage.getItem(TITLE_KEY) || 'טיימר קמפיין';
    }
    
    // פונקציה לחישוב הזמן שנותר
    function calculateTimeRemaining(endDate) {
        const now = new Date().getTime();
        const end = endDate.getTime();
        const difference = end - now;
        
        if (difference <= 0) {
            return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        
        return {
            total: difference,
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
    }
    
    // פונקציה לעדכון התצוגה
    function updateDisplay(time) {
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
        
        daysEl.textContent = String(time.days).padStart(2, '0');
        hoursEl.textContent = String(time.hours).padStart(2, '0');
        minutesEl.textContent = String(time.minutes).padStart(2, '0');
        secondsEl.textContent = String(time.seconds).padStart(2, '0');
    }
    
    // פונקציה לעדכון הודעה
    function updateMessage(isEnded, title) {
        if (!messageEl) return;
        
        if (isEnded) {
            messageEl.innerHTML = `<h3>🎉 הקמפיין "${title}" הסתיים!</h3>`;
            messageEl.className = 'timer-message ended';
        } else {
            messageEl.innerHTML = `<h3>⏰ הקמפיין "${title}" מתקדם...</h3>`;
            messageEl.className = 'timer-message active';
        }
    }
    
    // פונקציה לעדכון הטיימר
    function updateTimer() {
        const endDate = getCampaignEndDate();
        const title = getCampaignTitle();
        
        if (!endDate) {
            updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            if (messageEl) {
                messageEl.innerHTML = '<h3>⚠️ לא הוגדר תאריך סיום לקמפיין</h3>';
                messageEl.className = 'timer-message not-set';
            }
            return;
        }
        
        const time = calculateTimeRemaining(endDate);
        updateDisplay(time);
        updateMessage(time.total <= 0, title);
        
        // אם הקמפיין הסתיים, עצור את הטיימר
        if (time.total <= 0) {
            clearInterval(window.timerInterval);
        }
    }
    
    // אתחול הטיימר
    function initTimer() {
        updateTimer();
        window.timerInterval = setInterval(updateTimer, 1000);
    }
    
    // אתחול כאשר הדף נטען
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTimer);
    } else {
        initTimer();
    }
    
    // חשיפה לשימוש חיצוני אם נדרש
    window.TimerAPI = {
        getCampaignEndDate,
        getCampaignTitle,
        calculateTimeRemaining,
        updateDisplay,
        updateTimer
    };
    
})();
