// Notification System - Toast notifications modernes
export const Notification = {
    container: null,
    
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
            `;
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 3000) {
        this.init();
        
        const toast = document.createElement('div');
        const colors = {
            error: '#ef4444',
            success: '#22c55e', 
            warning: '#f59e0b',
            info: '#38bdf8'
        };
        
        const icons = {
            error: '✕',
            success: '✓',
            warning: '!',
            info: 'i'
        };
        
        toast.style.cssText = `
            background: ${colors[type]};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
            cursor: pointer;
        `;
        
        toast.innerHTML = `
            <span style="font-weight: bold; font-size: 16px;">${icons[type]}</span>
            <span>${message}</span>
        `;
        
        // Auto-remove after duration
        const removeTimeout = setTimeout(() => {
            this.remove(toast);
        }, duration);
        
        // Click to dismiss
        toast.addEventListener('click', () => {
            clearTimeout(removeTimeout);
            this.remove(toast);
        });
        
        this.container.appendChild(toast);
    },

    remove(toast) {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    },

    error(message) {
        this.show(message, 'error', 5000);
    },

    success(message) {
        this.show(message, 'success', 3000);
    },

    warning(message) {
        this.show(message, 'warning', 4000);
    },

    info(message) {
        this.show(message, 'info', 3000);
    }
};

// Add CSS animations
const style = document.createElement('style');
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
