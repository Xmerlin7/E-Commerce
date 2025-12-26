import { initCartBadge } from "./ui/cartBadge.js";
import { initUserIcon } from "./ui/userIcon.js";
import { login, register } from "./state/auth.js";

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

    window.location.href = "./product.html";
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

    window.location.href = "./product.html";
  });
}

function init() {
  initCartBadge();
  initUserIcon();
  initRegister();
  initLogin();
}

init();
