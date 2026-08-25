export const appointmentStatuses = new Set([
  "scheduled",
  "confirmed",
  "done",
  "canceled",
  "missed",
  "late",
]);

export const paymentStatuses = new Set(["pending", "paid"]);

export const hasValue = (value) =>
  value !== undefined && value !== null && value !== "";

export const isPositiveInteger = (value) =>
  Number.isInteger(Number(value)) && Number(value) > 0;

export const isNonNegativeNumber = (value) =>
  !hasValue(value) || (Number.isFinite(Number(value)) && Number(value) >= 0);

export const isBrazilianPhone = (value) =>
  !hasValue(value) ||
  /^(?:\(?[1-9]{2}\)?\s?)(?:9\s?)?[0-9]{4,5}-?[0-9]{4}$/.test(value);

export const isValidEmail = (value) =>
  !hasValue(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
