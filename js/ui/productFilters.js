function parseNullableNumber(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function getSelectedCategory(container) {
  const checked = container?.querySelector('input[name="category"]:checked');
  return checked ? checked.value : "all";
}

function matchesCategory(product, selected) {
  const cat = String(product?.category ?? "").toLowerCase();

  if (selected === "all") return true;
  if (selected === "mens") return cat === "men's clothing";
  if (selected === "womens") return cat === "women's clothing";
  if (selected === "electronics") return cat === "electronics";
  if (selected === "jewelry") return cat === "jewelery" || cat === "jewelry";

  return true;
}

export function initProductFilters({
  containerId = "product-filters",
  products = [],
  onFiltered,
} = {}) {
  const host = document.getElementById(containerId);
  if (!host) return;

  const list = Array.isArray(products) ? products : [];

  host.innerHTML = `
    <div class="filters">
      <div class="filters-row">
        <div class="filter-block" aria-label="Category filter">
          <div class="filter-title">Category</div>
          <label class="radio"><input type="radio" name="category" value="all" checked /> All</label>
          <label class="radio"><input type="radio" name="category" value="mens" /> Clothes (Men)</label>
          <label class="radio"><input type="radio" name="category" value="womens" /> Clothes (Women)</label>
          <label class="radio"><input type="radio" name="category" value="electronics" /> Electronics</label>
          <label class="radio"><input type="radio" name="category" value="jewelry" /> Jewelry</label>
        </div>

        <div class="filter-block" aria-label="Price filter">
          <div class="filter-title">Price</div>
          <label class="field">
            Min
            <input id="filter-min" type="number" min="0" step="0.01" placeholder="" />
          </label>
          <label class="field">
            Max
            <input id="filter-max" type="number" min="0" step="0.01" placeholder="" />
          </label>
        </div>
      </div>
    </div>
  `;

  const minEl = host.querySelector("#filter-min");
  const maxEl = host.querySelector("#filter-max");

  function apply() {
    const min = parseNullableNumber(minEl?.value);
    const max = parseNullableNumber(maxEl?.value);
    const selected = getSelectedCategory(host);

    const filtered = list.filter((p) => {
      const price = Number(p?.price ?? 0);
      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;
      if (!matchesCategory(p, selected)) return false;
      return true;
    });

    if (typeof onFiltered === "function") onFiltered(filtered);
  }

  // Instant updates
  host.addEventListener("input", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.matches("#filter-min") || t.matches("#filter-max")) apply();
  });

  host.addEventListener("change", (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.matches('input[name="category"]')) apply();
  });

  // Default state: show all products
  apply();
}
