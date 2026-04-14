/**
 * Payment Form Validation Utilities
 * Provides regex patterns and validation functions for payment methods
 */

// UPI ID validation: format like yourname@upi or yourname@bank
export const UPI_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;

// IFSC Code validation: 11 characters - 4 letters, 0, 6 alphanumeric
// Example: HDFC0001234
export const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;

// Account number validation: 10-18 digits
export const ACCOUNT_NUMBER_PATTERN = /^\d{10,18}$/;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate UPI ID format
 */
export function validateUpiId(upiId: string): ValidationResult {
  if (!upiId || !upiId.trim()) {
    return { valid: false, error: 'UPI ID is required' };
  }

  const trimmed = upiId.trim();
  
  if (!UPI_PATTERN.test(trimmed)) {
    return { valid: false, error: 'Invalid UPI ID format (e.g., yourname@upi)' };
  }

  return { valid: true };
}

/**
 * Validate IFSC Code format
 */
export function validateIfscCode(ifscCode: string): ValidationResult {
  if (!ifscCode || !ifscCode.trim()) {
    return { valid: false, error: 'IFSC Code is required' };
  }

  const trimmed = ifscCode.trim().toUpperCase();
  
  if (!IFSC_PATTERN.test(trimmed)) {
    return { valid: false, error: 'Invalid IFSC Code format (11 chars: HDFC0001234)' };
  }

  return { valid: true };
}

/**
 * Validate Account Number format
 */
export function validateAccountNumber(accountNumber: string): ValidationResult {
  if (!accountNumber || !accountNumber.trim()) {
    return { valid: false, error: 'Account Number is required' };
  }

  const trimmed = accountNumber.trim();
  
  if (!ACCOUNT_NUMBER_PATTERN.test(trimmed)) {
    return { valid: false, error: 'Invalid Account Number (10-18 digits)' };
  }

  return { valid: true };
}

/**
 * Validate account numbers match
 */
export function validateAccountNumberMatch(
  accountNumber: string,
  confirmAccountNumber: string
): ValidationResult {
  if (accountNumber !== confirmAccountNumber) {
    return { valid: false, error: 'Account numbers do not match' };
  }

  return { valid: true };
}

/**
 * Validate Bank Account details
 */
export function validateBankAccount(data: {
  holderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  bankName: string;
  ifscCode: string;
}): ValidationResult {
  // Validate holder name
  if (!data.holderName || !data.holderName.trim()) {
    return { valid: false, error: 'Account holder name is required' };
  }

  if (data.holderName.trim().length < 3) {
    return { valid: false, error: 'Account holder name must be at least 3 characters' };
  }

  // Validate account number
  const accountValidation = validateAccountNumber(data.accountNumber);
  if (!accountValidation.valid) {
    return accountValidation;
  }

  // Validate account number confirmation
  const matchValidation = validateAccountNumberMatch(data.accountNumber, data.confirmAccountNumber);
  if (!matchValidation.valid) {
    return matchValidation;
  }

  // Validate bank name
  if (!data.bankName || !data.bankName.trim()) {
    return { valid: false, error: 'Bank name is required' };
  }

  if (data.bankName.trim().length < 2) {
    return { valid: false, error: 'Bank name must be at least 2 characters' };
  }

  // Validate IFSC code
  const ifscValidation = validateIfscCode(data.ifscCode);
  if (!ifscValidation.valid) {
    return ifscValidation;
  }

  return { valid: true };
}

/**
 * Validate UPI Account details
 */
export function validateUpiAccount(data: {
  upiId: string;
}): ValidationResult {
  return validateUpiId(data.upiId);
}
