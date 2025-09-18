export function formatPhone(value: string): string {
  if (!value) return "";

  let digits = value.replace(/\D/g, "");

  if (digits.length > 11) {
    digits = digits.substring(0, 11);
  }

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  } else {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
  }
}
