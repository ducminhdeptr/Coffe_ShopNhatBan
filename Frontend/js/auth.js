// ===== Auth Module =====
export function isAuthenticated() {
    const token = localStorage.getItem('cafe_token');
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expiry = payload.exp * 1000;
        if (Date.now() >= expiry) {
            logout();
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

export function getUser() {
    return localStorage.getItem('cafe_user') || 'Admin';
}

export function saveAuth(token, username) {
    localStorage.setItem('cafe_token', token);
    localStorage.setItem('cafe_user', username);
}

export function logout() {
    localStorage.removeItem('cafe_token');
    localStorage.removeItem('cafe_user');
    window.location.href = '/login.html';
}

export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}
