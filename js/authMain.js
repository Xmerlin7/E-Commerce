import { initCartBadge } from "./ui/cartBadge.js";
import { initUserIcon } from "./ui/userIcon.js";
import { login, register } from "./state/auth.js";
import { initCartLinkGuard } from "./utils/authGuard.js";

function getSafeNextUrl() {
  const next = new URLSearchParams(window.location.search).get("next");
  if (!next) return null;

  const n = String(next);
  if (n.startsWith("http://") || n.startsWith("https://")) return null;
  if (n.startsWith("//") || n.startsWith("javascript:")) return null;
  if (!n.startsWith("/") && !n.startsWith("./")) return null;

  return n;
}

function setError(key, message) {
  const el = document.querySelector(`.field-error[data-for="${key}"]`);
  if (!el) return;
  el.textContent = message || "";
}

function clearErrors(prefix) {
  document
    .querySelectorAll(`.field-error[data-for^="${prefix}"]`)
    .forEach((el) => (el.textContent = ""));
}

function showRegister() {
  const reg = document.getElementById("register-section");
  const login = document.getElementById("login-section");
  if (reg) reg.hidden = false;
  if (login) login.hidden = true;
  const success = document.getElementById("login-success");
  if (success) success.textContent = "";
}

function showLogin(message) {
  const reg = document.getElementById("register-section");
  const login = document.getElementById("login-section");
  if (reg) reg.hidden = true;
  if (login) login.hidden = false;
  const success = document.getElementById("login-success");
  if (success) success.textContent = message || "";
}

function initSwitchLinks() {
  const goLogin = document.getElementById("go-login");
  const goRegister = document.getElementById("go-register");

  if (goLogin)
    goLogin.addEventListener("click", (e) => {
      e.preventDefault();
      showLogin();
    });

  if (goRegister)
    goRegister.addEventListener("click", (e) => {
      e.preventDefault();
      showRegister();
    });

  // Allow direct linking: /auth.html#login
  if (window.location.hash === "#login") showLogin();
  else showRegister();
}

function initRegister() {
  const form = document.getElementById("register-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors("register-");

    const fd = new FormData(form);
    const result = register({
      username: fd.get("username"),
      email: fd.get("email"),
      password: fd.get("password"),
      confirm: fd.get("confirm"),
    });

    if (!result.ok) {
      const errors = result.errors || {};
      setError("register-username", errors.username);
      setError("register-email", errors.email);
      setError("register-password", errors.password);
      setError("register-confirm", errors.confirm);
      setError("register-form", errors.form);
      return;
    }

    // After creating account, go to login view
    showLogin("Account created. Please login.");
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
      const emailInput = loginForm.querySelector('input[name="email"]');
      if (emailInput) emailInput.value = String(fd.get("email") ?? "");
      const passInput = loginForm.querySelector('input[name="password"]');
      if (passInput) passInput.focus();
    }
  });
}

function initLogin() {
  const form = document.getElementById("login-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors("login-");

    const fd = new FormData(form);
    const result = login({
      email: fd.get("email"),
      password: fd.get("password"),
    });

    if (!result.ok) {
      const errors = result.errors || {};
      setError("login-email", errors.email);
      setError("login-password", errors.password);
      setError("login-form", errors.form);
      return;
    }

    const next = getSafeNextUrl();
    window.location.href = next || "./product.html";
  });
}

function init() {
  initCartBadge();
  initUserIcon();
  initCartLinkGuard();
  initSwitchLinks();
  initRegister();
  initLogin();
}

init();
