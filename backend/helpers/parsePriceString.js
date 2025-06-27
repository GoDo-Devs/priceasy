export default function parsePriceString(priceStr) {
  if (typeof priceStr !== "string") return null;

  let cleaned = priceStr.replace(/[R$\s]/g, "");
  cleaned = cleaned.replace(/\./g, "");
  cleaned = cleaned.replace(/,/g, ".");
  const value = parseFloat(cleaned);

  return isNaN(value) ? null : value;
}
