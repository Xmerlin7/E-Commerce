function mod(n, m) {
  return ((n % m) + m) % m;
}

export function initProductSlider({
  containerId = "product-slider",
  products = [],
  take = 6,
  intervalMs = 3500,
} = {}) {
  const host = document.getElementById(containerId);
  if (!host) return;

  const list = Array.isArray(products) ? products.slice(0, take) : [];
  if (list.length === 0) {
    host.innerHTML = "";
    return;
  }

  host.innerHTML = `
		<div class="slider">
			<button class="slider-btn" type="button" data-action="prev" aria-label="Previous slide">‹</button>
			<a class="slider-link" href="#" aria-label="Open product details">
				<img class="slider-image" alt="" />
				<div class="slider-caption"></div>
			</a>
			<button class="slider-btn" type="button" data-action="next" aria-label="Next slide">›</button>
		</div>
	`;

  const link = host.querySelector(".slider-link");
  const img = host.querySelector(".slider-image");
  const caption = host.querySelector(".slider-caption");
  const prevBtn = host.querySelector('[data-action="prev"]');
  const nextBtn = host.querySelector('[data-action="next"]');

  let index = 0;
  let timerId = null;

  function render() {
    const p = list[mod(index, list.length)];
    if (!p || !link || !img || !caption) return;
    link.setAttribute("href", `./product.html?id=${p.id}`);
    img.setAttribute("src", p.image);
    img.setAttribute("alt", p.title);
    caption.textContent = p.title;
  }

  function stop() {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
  }

  function start() {
    stop();
    const ms = Number(intervalMs);
    if (!Number.isFinite(ms) || ms <= 0) return;
    timerId = window.setInterval(() => {
      index = mod(index + 1, list.length);
      render();
    }, ms);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      index = mod(index - 1, list.length);
      render();
      start();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      index = mod(index + 1, list.length);
      render();
      start();
    });
  }

  const slider = host.querySelector(".slider");
  if (slider) {
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
  }

  render();
  start();
}
