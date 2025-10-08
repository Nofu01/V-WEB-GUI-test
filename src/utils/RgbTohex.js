// src/utils/rgbToHex.js
function rgbToHex(r, g, b) {
  const toInt = n => Number(n);
  const isByte = n => Number.isInteger(n) && n >= 0 && n <= 255;

  const rn = toInt(r), gn = toInt(g), bn = toInt(b);
  if (![rn, gn, bn].every(isByte)) return null;

  const toHex = n => n.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(rn)}${toHex(gn)}${toHex(bn)}`;
}
module.exports = rgbToHex;
