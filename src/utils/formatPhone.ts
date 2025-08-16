export function formatPhoneNumber(phoneNumber: number | string): string {
  const digits = phoneNumber.toString().replace(/\D/g, "");

  const match = digits.match(/^1?(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phoneNumber.toString();
}
