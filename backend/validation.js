// valid appointment status values
export const appointmentStatuses = new Set([
  "scheduled",
  "confirmed",
  "done",
  "canceled",
  "missed",
  "late",
]);

// valid payment status values
export const paymentStatuses = new Set(["pending", "paid"]);

// check if value exists (not undefined, null or empty)
export const hasValue = (value) =>
  value !== undefined && value !== null && value !== "";

// check if value is a positive integer
export const isPositiveInteger = (value) =>
  Number.isInteger(Number(value)) && Number(value) > 0;

// check if value is a non-negative number
export const isNonNegativeNumber = (value) =>
  !hasValue(value) || (Number.isFinite(Number(value)) && Number(value) >= 0);

// check if phone has at least 10 digits
export const isBrazilianPhone = (value) =>
  !hasValue(value) || value.replace(/\D/g, "").length >= 10;

// validate email format with pattern
export const isValidEmail = (value) =>
  !hasValue(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
