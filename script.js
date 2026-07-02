const HEART_COLORS = ["#ff2f5f", "#ff456c", "#e71946", "#ff6f8f", "#c90f35"];
const CALENDAR_MONTH_DAYS = 30.436875;
const EXPECTED_DUE_DATE = new Date(2026, 8, 17);
const PREGNANCY_LENGTH_DAYS = 280;
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

function numberValue(form, name) {
  const value = Number(new FormData(form).get(name));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function roundAndNormalize(primary, secondary, unitSize) {
  let first = Math.floor(primary);
  let second = Math.round(secondary);

  if (second >= unitSize) {
    first += Math.floor(second / unitSize);
    second %= unitSize;
  }

  return [first, second];
}

function formatUnit(value, one, twoFour, many) {
  const normalized = Math.abs(value);
  const word = normalized === 1 ? one : normalized >= 2 && normalized <= 4 ? twoFour : many;
  return `${value} ${word}`;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function daysBetween(startDate, endDate) {
  return Math.floor((startOfDay(endDate) - startOfDay(startDate)) / 86400000);
}

function addMonthsClamped(date, months) {
  const nextDate = new Date(date);
  const originalDay = nextDate.getDate();
  nextDate.setDate(1);
  nextDate.setMonth(nextDate.getMonth() + months);
  const lastDay = new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate();
  nextDate.setDate(Math.min(originalDay, lastDay));
  return nextDate;
}

function calendarDiff(startDate, endDate) {
  const start = startOfDay(startDate);
  const end = startOfDay(endDate);
  let months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();

  if (addMonthsClamped(start, months) > end) {
    months -= 1;
  }

  const anchor = addMonthsClamped(start, months);
  return { months, days: daysBetween(anchor, end) };
}

function pregnancyProgress(today = new Date()) {
  const pregnancyStart = addDays(EXPECTED_DUE_DATE, -PREGNANCY_LENGTH_DAYS);
  const elapsedDays = Math.max(0, daysBetween(pregnancyStart, today));
  const weeks = Math.floor(elapsedDays / 7);
  const days = elapsedDays % 7;
  const calendar = calendarDiff(pregnancyStart, addDays(pregnancyStart, elapsedDays));

  return {
    pregnancyStart,
    elapsedDays,
    weeks,
    days,
    calendarMonths: calendar.months,
    calendarDays: calendar.days,
  };
}

function calendarToPregnancy(months, days) {
  const totalDays = months * CALENDAR_MONTH_DAYS + days;
  const weeks = Math.floor(totalDays / 7);
  const remainingDays = totalDays - weeks * 7;
  const [normalizedWeeks, normalizedDays] = roundAndNormalize(weeks, remainingDays, 7);
  return { weeks: normalizedWeeks, days: normalizedDays, totalDays };
}

function pregnancyToCalendar(weeks, days) {
  const totalDays = weeks * 7 + days;
  const months = Math.floor(totalDays / CALENDAR_MONTH_DAYS);
  const remainingDays = totalDays - months * CALENDAR_MONTH_DAYS;
  const [normalizedMonths, normalizedDays] = roundAndNormalize(months, remainingDays, Math.round(CALENDAR_MONTH_DAYS));
  return { months: normalizedMonths, days: normalizedDays, totalDays };
}

function updateCalendarToPregnancy() {
  const form = document.querySelector("#calendar-to-pregnancy");
  if (!form) return;

  const months = numberValue(form, "months");
  const days = numberValue(form, "days");
  const result = calendarToPregnancy(months, days);
  form.elements.result.value = `${formatUnit(months, "měsíc", "měsíce", "měsíců")} a ${formatUnit(days, "den", "dny", "dní")} ≈ ${formatUnit(result.weeks, "týden", "týdny", "týdnů")} a ${formatUnit(result.days, "den", "dny", "dní")}`;
}

function updatePregnancyToCalendar() {
  const form = document.querySelector("#pregnancy-to-calendar");
  if (!form) return;

  const weeks = numberValue(form, "weeks");
  const days = numberValue(form, "days");
  const result = pregnancyToCalendar(weeks, days);
  form.elements.result.value = `${formatUnit(weeks, "týden", "týdny", "týdnů")} a ${formatUnit(days, "den", "dny", "dní")} ≈ ${formatUnit(result.months, "měsíc", "měsíce", "měsíců")} a ${formatUnit(result.days, "den", "dny", "dní")}`;
}

function initCalculator() {
  const toggle = document.querySelector(".calculator-toggle");
  const panel = document.querySelector("#calculator-panel");
  const forms = document.querySelectorAll(".calculator-form");

  toggle?.addEventListener("click", () => {
    if (!panel) return;
    const willOpen = panel.hidden;
    panel.hidden = !willOpen;
    toggle.setAttribute("aria-expanded", String(willOpen));

    if (willOpen) {
      updateCalendarToPregnancy();
      updatePregnancyToCalendar();
    }
  });

  forms.forEach((form) => {
    form.addEventListener("submit", (event) => event.preventDefault());
    form.addEventListener("input", () => {
      updateCalendarToPregnancy();
      updatePregnancyToCalendar();
    });
  });

  updateCalendarToPregnancy();
  updatePregnancyToCalendar();
}

function initPregnancyStatus() {
  const weeksOutput = document.querySelector("#pregnancy-weeks");
  const calendarOutput = document.querySelector("#pregnancy-calendar");
  if (!weeksOutput || !calendarOutput) return;

  const progress = pregnancyProgress();
  weeksOutput.textContent = `${formatUnit(progress.weeks, "týden", "týdny", "týdnů")} a ${formatUnit(progress.days, "den", "dny", "dní")}`;
  calendarOutput.textContent = `${formatUnit(progress.calendarMonths, "měsíc", "měsíce", "měsíců")} a ${formatUnit(progress.calendarDays, "den", "dny", "dní")}`;
}

document.addEventListener("pointerdown", handlePointer, { passive: true });

document.addEventListener("DOMContentLoaded", () => {
  initPregnancyStatus();
  initCalculator();
});

window.addEventListener("load", () => {
  const rect = document.querySelector(".card")?.getBoundingClientRect();
  if (!rect) return;
  setTimeout(() => burstAt(rect.left + rect.width / 2, rect.top + rect.height * 0.33), 420);
});

window.heartsCalculator = {
  calendarToPregnancy,
  pregnancyToCalendar,
  pregnancyProgress,
};
