export function qParam(name) {
  const p = new URLSearchParams(window.location.search);
  const v = p.get(name);
  return v;
}

export function safeParseInt(value, fallback = NaN) {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : n;
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export function formatDateISO(iso) {
  if (!iso) return "";
  // yyyy-mm-dd -> mm/dd/yyyy for display
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}
