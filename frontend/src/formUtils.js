export const appointmentStatuses = [
  "scheduled",
  "confirmed",
  "done",
  "canceled",
  "missed",
  "late",
];

export const paymentStatuses = ["pending", "paid"];

export const toNumberOrNull = (value) => (value === "" ? null : Number(value));

export const toDateTimeLocal = (value) => {
  if (!value) {
    return "";
  }

  return String(value).replace(" ", "T").slice(0, 16);
};

export const formatDateTime = (value) => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));

export const brazilianPhonePattern =
  "^\\(?[1-9]{2}\\)? ?(?:9 ?)?[0-9]{4,5}-?[0-9]{4}$";

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
