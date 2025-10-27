class WaterReminderNotifier {
    constructor() {
        this.notificationInterval = null;
        this.reminderFrequency = 60 * 60 * 1000; // 1 hour default
        this.isActive = false;
        this.notificationCount = 0;
        this.maxDailyNotifications = 12; // Reasonable limit
        
        this.init();
    }
    
    async init() {
        await this.requestPermission();
        this.setupNotificationSettings();
        this.startReminders();
    }
    
    async requestPermission() {
        if (!('Notification' in window)) {
            this.showPermissionError('Your browser does not support notifications');
            return false;
        }
        
        let permission = Notification.permission;
        
        if (permission === 'default') {
            permission = await Notification.requestPermission();
        }
        
        if (permission === 'granted') {
            this.showPermissionSuccess();
            return true;
        } else {
            this.showPermissionError('Please enable notifications to receive water reminders');
            return false;
        }
    }
    
    showPermissionSuccess() {
        // Show a subtle success message
        console.log('✅ Water reminders enabled successfully!');
        this.showWelcomeNotification();
    }
    
    showPermissionError(message) {
        const errorDiv = document.querySelector('.error');
        const errorText = document.querySelector('.error-text');
        
        if (errorDiv && errorText) {
            errorText.textContent = message + ' You can enable them in your browser settings.';
            errorDiv.classList.remove('hidden');
            
            // Auto-hide after 8 seconds
            setTimeout(() => {
                errorDiv.classList.add('hidden');
            }, 8000);
        }
    }
    
    showWelcomeNotification() {
        if (Notification.permission === 'granted') {
            const notification = new Notification('💧 Water Reminder Active!', {
                body: 'Great! You\'ll receive gentle reminders to stay hydrated throughout the day.',
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💧</text></svg>',
                tag: 'water-reminder-welcome',
                requireInteraction: false
            });
            
            notification.onclick = () => {
                window.focus();
                notification.close();
            };
            
            // Auto-close after 4 seconds
            setTimeout(() => notification.close(), 4000);
        }
    }
    
    createReminderNotification() {
        if (Notification.permission !== 'granted' || 
            this.notificationCount >= this.maxDailyNotifications) {
            return;
        }
        
        const messages = [
            {
                title: '💧 Time to Hydrate!',
                body: 'Your body needs water to function optimally. Take a moment to drink a glass of water.'
            },
            {
                title: '🥤 Water Break Reminder',
                body: 'Staying hydrated improves focus and energy. How about a refreshing glass of water?'
            },
            {
                title: '💦 Hydration Check!',
                body: 'Regular water intake supports your health and well-being. Time for another glass!'
            },
            {
                title: '🌊 Stay Hydrated',
                body: 'Your brain is 75% water. Keep it happy with regular hydration breaks!'
            },
            {
                title: '💧 Water Reminder',
                body: 'Proper hydration helps maintain healthy skin and supports your immune system.'
            }
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        const notification = new Notification(randomMessage.title, {
            body: randomMessage.body,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💧</text></svg>',
            tag: 'water-reminder',
            requireInteraction: false,
            silent: false
        });
        
        this.notificationCount++;
        
        // Handle notification click
        notification.onclick = () => {
            window.focus();
            notification.close();
            
            // If calculator is available, scroll to it
            const calculator = document.getElementById('waterForm');
            if (calculator) {
                calculator.scrollIntoView({ behavior: 'smooth' });
            }
        };
        
        // Auto-close after 6 seconds
        setTimeout(() => notification.close(), 6000);
        
        // Log for debugging
        console.log(`💧 Water reminder sent (${this.notificationCount}/${this.maxDailyNotifications})`);
    }
    
    startReminders() {
        if (Notification.permission === 'granted' && !this.isActive) {
            this.isActive = true;
            
            // Set up recurring notifications
            this.notificationInterval = setInterval(() => {
                this.createReminderNotification();
            }, this.reminderFrequency);
            
            console.log(`💧 Water reminders started (every ${this.reminderFrequency / 60000} minutes)`);
        }
    }
    
    stopReminders() {
        if (this.notificationInterval) {
            clearInterval(this.notificationInterval);
            this.notificationInterval = null;
            this.isActive = false;
            console.log('💧 Water reminders stopped');
        }
    }
    
    setReminderFrequency(minutes) {
        this.reminderFrequency = minutes * 60 * 1000;
        
        if (this.isActive) {
            this.stopReminders();
            this.startReminders();
        }
        
        console.log(`💧 Reminder frequency updated to ${minutes} minutes`);
    }
    
    resetDailyCount() {
        this.notificationCount = 0;
        console.log('💧 Daily notification count reset');
    }
    
    setupNotificationSettings() {
        // Add notification controls to the page
        this.addNotificationControls();
        
        // Reset notification count daily at midnight
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const msUntilMidnight = tomorrow.getTime() - now.getTime();
        
        setTimeout(() => {
            this.resetDailyCount();
            // Set up daily reset
            setInterval(() => this.resetDailyCount(), 24 * 60 * 60 * 1000);
        }, msUntilMidnight);
    }
    
    addNotificationControls() {
        // Add controls after DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            const footer = document.querySelector('footer');
            if (footer) {
                const controlsHTML = `
                    <div class="bg-white rounded-lg shadow-md p-4 mb-4">
                        <h3 class="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            🔔 Notification Settings
                        </h3>
                        <div class="flex flex-wrap gap-4 items-center">
                            <label class="flex items-center gap-2">
                                <input type="checkbox" id="notificationsToggle" ${this.isActive ? 'checked' : ''} 
                                       class="rounded border-gray-300 text-water-blue focus:ring-water-blue">
                                <span class="text-sm">Enable reminders</span>
                            </label>
                            <label class="flex items-center gap-2">
                                <span class="text-sm">Frequency:</span>
                                <select id="reminderFrequency" class="px-2 py-1 border rounded text-sm">
                                    <option value="30">Every 30 minutes</option>
                                    <option value="60" selected>Every hour</option>
                                    <option value="90">Every 90 minutes</option>
                                    <option value="120">Every 2 hours</option>
                                </select>
                            </label>
                            <button id="testNotification" 
                                    class="px-3 py-1 bg-water-blue text-white text-sm rounded hover:bg-water-dark transition-colors">
                                Test Notification
                            </button>
                        </div>
                    </div>
                `;
                
                footer.insertAdjacentHTML('beforebegin', controlsHTML);
                this.bindNotificationControls();
            }
        });
    }
    
    bindNotificationControls() {
        const toggle = document.getElementById('notificationsToggle');
        const frequency = document.getElementById('reminderFrequency');
        const testBtn = document.getElementById('testNotification');
        
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.requestPermission().then(granted => {
                        if (granted) this.startReminders();
                        else e.target.checked = false;
                    });
                } else {
                    this.stopReminders();
                }
            });
        }
        
        if (frequency) {
            frequency.addEventListener('change', (e) => {
                this.setReminderFrequency(parseInt(e.target.value));
            });
        }
        
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                if (Notification.permission === 'granted') {
                    this.createReminderNotification();
                } else {
                    this.requestPermission();
                }
            });
        }
    }
}

// Initialize the water reminder system
const waterReminder = new WaterReminderNotifier();
