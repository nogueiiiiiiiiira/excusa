export const appointmentStatuses = [
  "scheduled",
  "confirmed",
  "done",
  "canceled",
  "missed",
  "late",
];

export const paymentStatuses = ["pending", "paid"];

// convert empty string to null for database
export const toNumberOrNull = (value) => (value === "" ? null : Number(value));

// format date to datetime-local input value
export const toDateTimeLocal = (value) => {
  if (!value) {
    return "";
  }

  return String(value).replace(" ", "T").slice(0, 16);
};

// format date to brazilian short format
export const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
};

// format number to brazilian currency
export const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));

// format phone number with brazilian mask
export const formatBrazilianPhone = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }

  if (digits.length <= 3) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
};
