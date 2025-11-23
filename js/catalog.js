export async function loadCatalog() {
  try {
    const resp = await fetch("./json/habits.json?nocache=" + Date.now());
    if (!resp.ok) throw new Error("Failed to fetch catalog");
    const catalog = await resp.json();
    return catalog;
  } catch (err) {
    console.error("catalog.loadCatalog:", err);
    return [];
  }
}