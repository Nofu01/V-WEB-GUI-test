/**
 * Converts a HEX color code to RGB format
 * @param {string} hex - HEX color code (with or without #)
 * @returns {object} RGB object with r, g, b values or null if invalid
 */
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Validate hex format
  if (!/^[0-9A-Fa-f]{6}$/.test(hex) && !/^[0-9A-Fa-f]{3}$/.test(hex)) {
    return null;
  }
  
  // Expand shorthand form (e.g., "03F") to full form (e.g., "0033FF")
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

module.exports = hexToRgb;
