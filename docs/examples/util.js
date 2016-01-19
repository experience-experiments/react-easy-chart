export function escapeHTML(jsx) {
  return jsx.replace(/&/g, '&amp;')
  .replace(/</g, '&#60;')
  .replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;')
  .replace(/\'/g, '&#39;');
}
