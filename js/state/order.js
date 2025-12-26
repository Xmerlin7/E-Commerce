const LAST_ORDER_KEY = "lastOrder";

export function saveLastOrder(order) {
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    // ignore
  }
}

export function loadLastOrder() {
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearLastOrder() {
  try {
    sessionStorage.removeItem(LAST_ORDER_KEY);
  } catch {
    // ignore
  }
}
