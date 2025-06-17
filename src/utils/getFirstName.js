/*
 For now, assume first name is the first word in the name property
 returns empty string if no name is provided
*/
function getFirstName(fullName) {
  if (typeof fullName !== 'string' || !fullName) {
    return '';
  }
  return fullName.trim().split(' ')[0];
}

export default getFirstName;
