const HEART_COLORS = ["#ff2f5f", "#ff456c", "#e71946", "#ff6f8f", "#c90f35"];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function createHeart(x, y, index, total) {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.setAttribute("aria-hidden", "true");

  const angle = (Math.PI * 2 * index) / total + random(-0.38, 0.38);
  const distance = prefersReducedMotion.matches ? random(42, 88) : random(90, 245);
  const drift = random(-34, 34);
  const size = random(9, 24);

  const tx = Math.cos(angle) * distance + drift;
  const ty = Math.sin(angle) * distance - random(42, 118);

  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.style.setProperty("--x", `${tx}px`);
  heart.style.setProperty("--y", `${ty}px`);
  heart.style.setProperty("--size", `${size}px`);
  heart.style.setProperty("--scale", random(0.7, 1.45).toFixed(2));
  heart.style.setProperty("--rotate", `${random(-145, 145)}deg`);
  heart.style.setProperty("--duration", `${random(820, 1550)}ms`);
  heart.style.setProperty("--heart-color", HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)]);

  heart.addEventListener("animationend", () => heart.remove(), { once: true });
  document.body.appendChild(heart);
}

function burstAt(x, y) {
  const count = prefersReducedMotion.matches ? 9 : Math.floor(random(16, 28));
  for (let i = 0; i < count; i += 1) {
    createHeart(x, y, i, count);
  }
}

function handlePointer(event) {
  burstAt(event.clientX, event.clientY);
}

document.addEventListener("pointerdown", handlePointer, { passive: true });

document.querySelector(".hint")?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const rect = event.currentTarget.getBoundingClientRect();
  burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

window.addEventListener("load", () => {
  const rect = document.querySelector(".card")?.getBoundingClientRect();
  if (!rect) return;
  setTimeout(() => burstAt(rect.left + rect.width / 2, rect.top + rect.height * 0.33), 420);
});
