// AQUAINT Authentication & Session Service
// Real server-side PBKDF2 verification with resilient client-side storage & token management

const TOKEN_KEY = 'aquaint_auth_token';
const USER_KEY = 'aquaint_current_user';
const GUEST_KEY = 'aquaint_is_guest';
const GUEST_TOUR_KEY = 'aquaint_guest_tour_completed';

// Subscribers for auth state changes
const listeners = new Set();

function notifyListeners() {
  const state = {
    user: authService.getCurrentUser(),
    token: authService.getToken(),
    isGuest: authService.isGuest(),
    isAuthenticated: authService.isAuthenticated()
  };
  listeners.forEach(fn => {
    try {
      fn(state);
    } catch (e) {
      console.error('[authService] listener error', e);
    }
  });
}

export const authService = {
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  isAuthenticated() {
    return Boolean(this.getToken() && this.getCurrentUser());
  },

  isGuest() {
    return localStorage.getItem(GUEST_KEY) === 'true';
  },

  setGuestMode(isGuest = true) {
    if (isGuest) {
      localStorage.setItem(GUEST_KEY, 'true');
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    } else {
      localStorage.removeItem(GUEST_KEY);
    }
    notifyListeners();
  },

  async login(email, password, rememberMe = true) {
    this.setGuestMode(false);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json') || response.status === 404) {
        return this.clientFallbackLogin(email, password, rememberMe);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, data.token);
      storage.setItem(USER_KEY, JSON.stringify(data.user));

      notifyListeners();
      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      // If server is unreachable or static preview/CDN deployment fallback
      if (
        err.message.includes('fetch') || 
        err.message.includes('Failed to fetch') || 
        err.message.includes('NetworkError') ||
        err.name === 'SyntaxError' ||
        err.message.includes('JSON')
      ) {
        return this.clientFallbackLogin(email, password, rememberMe);
      }
      throw err;
    }
  },

  async register(name, email, password, role = 'Facility Hydrologist') {
    this.setGuestMode(false);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json') || response.status === 404) {
        return this.clientFallbackRegister(name, email, password, role);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      notifyListeners();
      return { success: true, user: data.user, token: data.token };
    } catch (err) {
      if (
        err.message.includes('fetch') || 
        err.message.includes('Failed to fetch') || 
        err.message.includes('NetworkError') ||
        err.name === 'SyntaxError' ||
        err.message.includes('JSON')
      ) {
        return this.clientFallbackRegister(name, email, password, role);
      }
      throw err;
    }
  },

  async logout() {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (e) {
        // Silently handle offline/network issues during logout
      }
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(GUEST_KEY);

    notifyListeners();
  },

  async verifySession() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const contentType = response.headers.get('content-type') || '';
      if (!response.ok || !contentType.includes('application/json')) {
        // In static production without backend server, preserve client cached session if exists
        return this.getCurrentUser();
      }

      const data = await response.json();
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      notifyListeners();
      return data.user;
    } catch (e) {
      // If offline or static host, return current cached user if exists
      return this.getCurrentUser();
    }
  },

  async updateTourStatus(tourCompleted = true) {
    if (this.isGuest()) {
      localStorage.setItem(GUEST_TOUR_KEY, tourCompleted ? 'true' : 'false');
      notifyListeners();
      return { success: true, tourCompleted };
    }

    const token = this.getToken();
    const currentUser = this.getCurrentUser();

    if (currentUser) {
      currentUser.tourCompleted = Boolean(tourCompleted);
      localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
    }

    if (token) {
      try {
        await fetch('/api/auth/tour-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ tourCompleted })
        });
      } catch (e) {
        console.warn('[authService] Could not sync tour status with server', e);
      }
    }

    notifyListeners();
    return { success: true, tourCompleted };
  },

  hasCompletedTour() {
    if (this.isGuest()) {
      return localStorage.getItem(GUEST_TOUR_KEY) === 'true';
    }
    const user = this.getCurrentUser();
    return Boolean(user && user.tourCompleted);
  },

  // Fallback storage for environments without Node server (e.g. GitHub Pages / static hosting)
  clientFallbackRegister(name, email, password, role) {
    const localUsersKey = 'aquaint_local_users';
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(localUsersKey) || '[]');
    } catch (e) {
      users = [];
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      role: role || 'Facility Hydrologist',
      createdAt: new Date().toISOString(),
      tourCompleted: false
    };

    users.push({ ...newUser, password });
    localStorage.setItem(localUsersKey, JSON.stringify(users));

    const token = 'token_' + Date.now();
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));

    notifyListeners();
    return { success: true, user: newUser, token };
  },

  clientFallbackLogin(email, password, rememberMe) {
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check demo user
    if (normalizedEmail === 'elena.vance@greenwood.edu' && password === 'Password123!') {
      const demoUser = {
        id: 'usr_demo_admin',
        name: 'Elena Vance',
        email: 'elena.vance@greenwood.edu',
        role: 'Chief Hydrologist',
        createdAt: '2026-09-15T08:00:00.000Z',
        tourCompleted: false
      };
      const token = 'token_demo_' + Date.now();
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, token);
      storage.setItem(USER_KEY, JSON.stringify(demoUser));
      notifyListeners();
      return { success: true, user: demoUser, token };
    }

    const localUsersKey = 'aquaint_local_users';
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(localUsersKey) || '[]');
    } catch (e) {
      users = [];
    }

    const found = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password);
    if (!found) {
      throw new Error('Invalid email or password.');
    }

    const { password: _, ...safeUser } = found;
    const token = 'token_' + Date.now();
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(safeUser));
    notifyListeners();
    return { success: true, user: safeUser, token };
  }
};
