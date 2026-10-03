import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory and initial users database file exist
function initDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(USERS_FILE)) {
    // Seed initial demo administrator user
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync('Password123!', salt, 100000, 64, 'sha512').toString('hex');
    
    const initialUsers = [
      {
        id: 'usr_demo_admin',
        name: 'Elena Vance',
        email: 'elena.vance@greenwood.edu',
        role: 'Chief Hydrologist',
        salt,
        hash,
        createdAt: '2026-09-15T08:00:00.000Z',
        tourCompleted: false
      }
    ];

    fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2), 'utf-8');
  }
}

function readUsers() {
  initDatabase();
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[Auth API] Error reading users file:', err);
    return [];
  }
}

function writeUsers(users) {
  initDatabase();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Auth API] Error writing users file:', err);
  }
}

// In-memory active session token store
const activeSessions = new Map();

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function sanitizeUser(user) {
  const { salt, hash, ...safeUser } = user;
  return safeUser;
}

export function authApiPlugin() {
  return {
    name: 'aquaint-auth-api-plugin',
    configureServer(server) {
      initDatabase();

      server.middlewares.use(async (req, res, next) => {
        // Only handle /api/auth/* routes
        if (!req.url.startsWith('/api/auth')) {
          return next();
        }

        // Parse query / path
        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        const pathname = parsedUrl.pathname;

        const sendJson = (statusCode, data) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        const getJsonBody = () => {
          return new Promise((resolve) => {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch (e) {
                resolve({});
              }
            });
          });
        };

        // 1. POST /api/auth/register
        if (pathname === '/api/auth/register' && req.method === 'POST') {
          const body = await getJsonBody();
          const { name, email, password, role } = body;

          // Server-side validation
          if (!name || name.trim().length < 2) {
            return sendJson(400, { error: 'Full name is required (minimum 2 characters).' });
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!email || !emailRegex.test(email.trim())) {
            return sendJson(400, { error: 'A valid email address is required.' });
          }

          if (!password || password.length < 6) {
            return sendJson(400, { error: 'Password must be at least 6 characters long.' });
          }

          const normalizedEmail = email.trim().toLowerCase();
          const users = readUsers();

          // Check duplicate
          const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
          if (existing) {
            return sendJson(409, { 
              error: 'An account with this email address already exists. Please log in.' 
            });
          }

          // Generate secure salt and hash
          const salt = crypto.randomBytes(16).toString('hex');
          const hash = hashPassword(password, salt);

          const newUser = {
            id: `usr_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            name: name.trim(),
            email: normalizedEmail,
            role: role || 'Facility Hydrologist',
            salt,
            hash,
            createdAt: new Date().toISOString(),
            tourCompleted: false
          };

          users.push(newUser);
          writeUsers(users);

          // Create session token
          const token = crypto.randomBytes(32).toString('hex');
          activeSessions.set(token, {
            userId: newUser.id,
            email: newUser.email,
            createdAt: Date.now()
          });

          return sendJson(201, {
            success: true,
            message: 'Account successfully registered.',
            token,
            user: sanitizeUser(newUser)
          });
        }

        // 2. POST /api/auth/login
        if (pathname === '/api/auth/login' && req.method === 'POST') {
          const body = await getJsonBody();
          const { email, password } = body;

          if (!email || !password) {
            return sendJson(400, { error: 'Both email and password are required.' });
          }

          const normalizedEmail = email.trim().toLowerCase();
          const users = readUsers();
          const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

          if (!user) {
            return sendJson(401, { error: 'Invalid email or password.' });
          }

          const hash = hashPassword(password, user.salt);
          if (hash !== user.hash) {
            return sendJson(401, { error: 'Invalid email or password.' });
          }

          // Create session token
          const token = crypto.randomBytes(32).toString('hex');
          activeSessions.set(token, {
            userId: user.id,
            email: user.email,
            createdAt: Date.now()
          });

          return sendJson(200, {
            success: true,
            message: 'Login successful.',
            token,
            user: sanitizeUser(user)
          });
        }

        // 3. GET /api/auth/me
        if (pathname === '/api/auth/me' && req.method === 'GET') {
          const authHeader = req.headers.authorization || '';
          const token = authHeader.replace(/^Bearer\s+/i, '');

          if (!token || !activeSessions.has(token)) {
            return sendJson(401, { error: 'Unauthorized: Invalid or expired session token.' });
          }

          const session = activeSessions.get(token);
          const users = readUsers();
          const user = users.find(u => u.id === session.userId);

          if (!user) {
            return sendJson(404, { error: 'User account not found.' });
          }

          return sendJson(200, {
            success: true,
            user: sanitizeUser(user)
          });
        }

        // 4. POST /api/auth/tour-status
        if (pathname === '/api/auth/tour-status' && req.method === 'POST') {
          const authHeader = req.headers.authorization || '';
          const token = authHeader.replace(/^Bearer\s+/i, '');

          if (!token || !activeSessions.has(token)) {
            return sendJson(401, { error: 'Unauthorized session.' });
          }

          const session = activeSessions.get(token);
          const body = await getJsonBody();
          const { tourCompleted } = body;

          const users = readUsers();
          const userIndex = users.findIndex(u => u.id === session.userId);

          if (userIndex === -1) {
            return sendJson(404, { error: 'User account not found.' });
          }

          users[userIndex].tourCompleted = Boolean(tourCompleted);
          writeUsers(users);

          return sendJson(200, {
            success: true,
            tourCompleted: users[userIndex].tourCompleted
          });
        }

        // 5. POST /api/auth/logout
        if (pathname === '/api/auth/logout' && req.method === 'POST') {
          const authHeader = req.headers.authorization || '';
          const token = authHeader.replace(/^Bearer\s+/i, '');

          if (token && activeSessions.has(token)) {
            activeSessions.delete(token);
          }

          return sendJson(200, {
            success: true,
            message: 'Logged out successfully.'
          });
        }

        return sendJson(404, { error: 'Auth API endpoint not found.' });
      });
    },

    configurePreviewServer(server) {
      // Also enable in npm run preview
      this.configureServer(server);
    }
  };
}
