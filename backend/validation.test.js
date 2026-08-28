import assert from "node:assert/strict";
import test from "node:test";
import {
  appointmentStatuses,
  isBrazilianPhone,
  isNonNegativeNumber,
  isPositiveInteger,
  isValidEmail,
  paymentStatuses,
} from "./validation.js";

test("accepts valid Brazilian phone numbers and rejects invalid values", () => {
  assert.equal(isBrazilianPhone("(31) 99999-9999"), true);
  assert.equal(isBrazilianPhone("123"), false);
  assert.equal(isBrazilianPhone(""), true);
});

test("validates email and non-negative numeric fields", () => {
  assert.equal(isValidEmail("person@example.com"), true);
  assert.equal(isValidEmail("invalid-email"), false);
  assert.equal(isNonNegativeNumber(0), true);
  assert.equal(isNonNegativeNumber(-1), false);
  assert.equal(isNonNegativeNumber(""), true);
});

test("validates positive integer identifiers and durations", () => {
  assert.equal(isPositiveInteger(1), true);
  assert.equal(isPositiveInteger("2"), true);
  assert.equal(isPositiveInteger(0), false);
  assert.equal(isPositiveInteger(1.5), false);
});

test("restricts appointment and payment statuses", () => {
  assert.equal(appointmentStatuses.has("scheduled"), true);
  assert.equal(appointmentStatuses.has("unknown"), false);
  assert.equal(paymentStatuses.has("paid"), true);
  assert.equal(paymentStatuses.has("refunded"), false);
});
