// Common authentication functions
function isAuthenticated() {
    const token = localStorage.getItem('adminToken');
    if (!token) return false;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        if (payload.exp && (payload.exp * 1000) < Date.now()) {
            localStorage.clear();
            sessionStorage.clear();
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}

// Handle admin button click
function handleAdminClick(event) {
    event.preventDefault();
    if (isAuthenticated()) {
        window.location.href = '/admin.html';
    } else {
        window.location.href = '/admin-login.html';
    }
} 