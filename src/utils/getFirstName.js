/**
 * @module utils/getFirstName
 */
/**
 * Extracts the first name from a full name string.
 * Assumes the first name is the first word in the provided string.
 * Returns an empty string if no valid name is provided.
 *
 * @memberof module:utils/getFirstName
 * @param {string} fullName - The full name from which to extract the first name.
 * @returns {string} The first name, or an empty string if input is invalid.
 */
function getFirstName(fullName) {
  if (typeof fullName !== 'string' || !fullName) {
    return '';
  }
  return fullName.trim().split(' ')[0];
}

export default getFirstName;
