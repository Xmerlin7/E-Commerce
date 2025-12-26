import { getCurrentUser, logout } from "../state/auth.js";
import { buildLoginUrl } from "../utils/authGuard.js";

function render() {
  const el = document.getElementById("user-area");
  if (!el) return;

  const user = getCurrentUser();
  if (!user) {
    el.innerHTML = `<a href="${buildLoginUrl()}" aria-label="Login">👤 Login</a>`;
    return;
  }

  el.innerHTML = `
		<span aria-label="Logged in user">👤 ${user.username}</span>
		<button id="logout-btn" type="button">Logout</button>
	`;

  const btn = document.getElementById("logout-btn");
  if (btn) {
    btn.addEventListener("click", () => {
      logout();
    });
  }
}

export function initUserIcon() {
  render();
  window.addEventListener("auth:changed", () => render());
}
