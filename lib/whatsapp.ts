// Format phone number for WhatsApp (handles Israeli, French, US formats)
export function formatPhoneForWhatsApp(phone: string): string {
  // Clean: remove spaces, dashes, parentheses, dots
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, '')

  // Handle numbers already with country code
  if (cleaned.startsWith('+')) {
    return cleaned.substring(1) // Remove + only
  }

  // Handle 00 prefix (international format)
  if (cleaned.startsWith('00')) {
    return cleaned.substring(2) // Remove 00
  }

  // Handle numbers starting with country code without +
  // Israeli: 972...
  if (cleaned.startsWith('972')) {
    return cleaned
  }
  // French: 33...
  if (cleaned.startsWith('33')) {
    return cleaned
  }
  // US: 1...
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    return cleaned
  }

  // Local format detection (starts with 0)
  if (cleaned.startsWith('0')) {
    // French mobile: 06xx, 07xx (10 digits)
    if ((cleaned.startsWith('06') || cleaned.startsWith('07')) && cleaned.length === 10) {
      return '33' + cleaned.substring(1)
    }

    // Israeli mobile: 05xx (10 digits)
    // Could be French or Israeli - default to Israeli since business is in Israel
    if (cleaned.startsWith('05') && cleaned.length === 10) {
      return '972' + cleaned.substring(1)
    }

    // Other Israeli: 02, 03, 04, 08, 09 (landlines)
    if (/^0[2-489]/.test(cleaned) && cleaned.length === 10) {
      return '972' + cleaned.substring(1)
    }

    // French landlines: 01, 02, 03, 04, 05, 09 - remaining 0x likely Israeli
    if (/^0[1-59]/.test(cleaned) && cleaned.length === 10) {
      return '972' + cleaned.substring(1)
    }
  }

  // US: 10 digits starting with 2-9 (area code)
  if (cleaned.length === 10 && /^[2-9]/.test(cleaned)) {
    return '1' + cleaned
  }

  // Fallback: return as-is
  return cleaned
}

export function getWhatsAppUrl(phone: string, message?: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone)
  if (!message) {
    return `https://wa.me/${formattedPhone}`
  }
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
}
