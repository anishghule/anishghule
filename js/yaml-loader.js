/**
 * Fetches and parses a YAML file.
 * Relies on js-yaml loaded via CDN (window.jsyaml).
 */
export async function loadYAML(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }
  const text = await response.text();
  return window.jsyaml.load(text);
}
