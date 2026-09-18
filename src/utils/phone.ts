/**
 * Normalizes Indian mobile phone numbers into a standardized E.164 string format (+91XXXXXXXXXX).
 * Handles raw inputs like:
 * - 9876543210
 * - +919876543210
 * - 91 9876543210
 * - 09876543210
 * - +91 98490-12345
 */
export function normalizePhoneNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  if (!digitsOnly) return '';

  // 10 digits: standard Indian local mobile number
  if (digitsOnly.length === 10) {
    return `+91${digitsOnly}`;
  }

  // 11 digits starting with 0: e.g. 09876543210
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return `+91${digitsOnly.slice(1)}`;
  }

  // 12 digits starting with 91: e.g. 919876543210
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return `+${digitsOnly}`;
  }

  // Fallback if already prefixed or international format
  return phone.startsWith('+') ? `+${digitsOnly}` : `+91${digitsOnly.slice(-10)}`;
}
