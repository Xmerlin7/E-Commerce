const USERS_KEY = "users";
const SESSION_KEY = "session";

// Regex rules (simple + beginner-friendly)
// Username: 3-20 chars, letters/numbers/underscore, must start with letter
const USERNAME_RE = /^[A-Za-z][A-Za-z0-9_]{2,19}$/;
// Email: basic validation (not RFC-perfect, but fine for learning)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Password: min 8, at least 1 letter and 1 number
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function validateRegister({ username, email, password, confirm }) {
  const errors = {};

  const u = String(username ?? "").trim();
  const e = String(email ?? "").trim();
  const p = String(password ?? "");
  const c = String(confirm ?? "");

  if (!USERNAME_RE.test(u)) {
    errors.username =
      "Username must be 3-20 chars, start with a letter, and contain only letters, numbers, underscore.";
  }
  if (!EMAIL_RE.test(e)) {
    errors.email = "Please enter a valid email.";
  }
  if (!PASSWORD_RE.test(p)) {
    errors.password =
      "Password must be 8+ chars and include letters + numbers.";
  }
  if (p !== c) {
    errors.confirm = "Passwords do not match.";
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

export function validateLogin({ email, password }) {
  const errors = {};
  const e = String(email ?? "").trim();
  const p = String(password ?? "");

  if (!EMAIL_RE.test(e)) errors.email = "Please enter a valid email.";
  if (!p) errors.password = "Password is required.";

  return { ok: Object.keys(errors).length === 0, errors };
}

export function getUsers() {
  const users = readJson(USERS_KEY, []);
  return Array.isArray(users) ? users : [];
}

export function getSession() {
  return readJson(SESSION_KEY, null);
}

export function getCurrentUser() {
  const session = getSession();
  if (!session?.email) return null;
  const users = getUsers();
  return users.find((u) => u.email === session.email) ?? null;
}

export function register({ username, email, password, confirm }) {
  const validation = validateRegister({ username, email, password, confirm });
  if (!validation.ok) return { ok: false, errors: validation.errors };

  const users = getUsers();
  const u = String(username).trim();
  const e = String(email).trim().toLowerCase();

  if (users.some((x) => x.email === e)) {
    return { ok: false, errors: { email: "Email already registered." } };
  }
  if (users.some((x) => x.username === u)) {
    return { ok: false, errors: { username: "Username already taken." } };
  }

  // NOTE: For learning only. Do NOT store plaintext passwords in real apps.
  const newUser = { username: u, email: e, password };
  users.push(newUser);
  writeJson(USERS_KEY, users);

  // No auto-login: user must login after creating an account
  return { ok: true, user: { username: u, email: e } };
}

export function login({ email, password }) {
  const validation = validateLogin({ email, password });
  if (!validation.ok) return { ok: false, errors: validation.errors };

  const e = String(email).trim().toLowerCase();
  const users = getUsers();
  const user = users.find((u) => u.email === e);
  if (!user || user.password !== password) {
    return { ok: false, errors: { form: "Invalid email or password." } };
  }

  writeJson(SESSION_KEY, { email: e });
  window.dispatchEvent(new CustomEvent("auth:changed"));
  return { ok: true, user: { username: user.username, email: user.email } };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent("auth:changed"));
}
