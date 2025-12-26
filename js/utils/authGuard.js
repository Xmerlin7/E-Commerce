import { getCurrentUser } from "../state/auth.js";

function currentPathWithQueryAndHash() {
  return (
    window.location.pathname + window.location.search + window.location.hash
  );
}

export function isAuthenticated() {
  return Boolean(getCurrentUser());
}

export function buildLoginUrl(next = currentPathWithQueryAndHash()) {
  const url = new URL("./auth.html", window.location.href);
  url.searchParams.set("next", String(next));
  url.hash = "login";
  return url.toString();
}

export function redirectToLogin({ next, replace = true } = {}) {
  const url = buildLoginUrl(next ?? currentPathWithQueryAndHash());
  if (replace) window.location.replace(url);
  else window.location.href = url;
}

export function requireAuth({ next } = {}) {
  if (isAuthenticated()) return true;
  redirectToLogin({ next });
  return false;
}

export function initCartLinkGuard() {
  const links = document.querySelectorAll('a[href$="cart.html"]');
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      if (isAuthenticated()) return;

      e.preventDefault();

      let next = "./cart.html";
      try {
        const resolved = new URL(
          a.getAttribute("href") || "./cart.html",
          window.location.href
        );
        next = resolved.pathname + resolved.search + resolved.hash;
      } catch {
        // ignore
      }

      redirectToLogin({ next });
    });
  });
}
