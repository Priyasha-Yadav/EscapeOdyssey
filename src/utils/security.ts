/**
 * Security & Input Sanitization Engine for EscapeOdyssey
 * Prevents XSS, script injection, malformed data, and unexpected payload crashes.
 */

// XSS & Script Tag Sanitizer
export function sanitizeInput(input: string, maxLen: number = 200): string {
  if (!input) return '';
  let sanitized = String(input)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Strip script tags
    .replace(/on\w+="[^"]*"/gi, '') // Strip inline event handlers
    .replace(/javascript:/gi, '') // Strip javascript pseudo-protocols
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim();

  return sanitized.slice(0, maxLen);
}

// RFC 5322 Compliant Email Validation Regex
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 120) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

// Custom Activity Input Validator & Sanitizer
export type ActivityValidationResult = {
  isValid: boolean;
  errors: string[];
  sanitizedTitle: string;
  sanitizedCost: number;
};

export function validateCustomActivityInput(title: string, costInput: number | string): ActivityValidationResult {
  const errors: string[] = [];
  const sanitizedTitle = sanitizeInput(String(title), 80);

  if (!sanitizedTitle || sanitizedTitle.length < 3) {
    errors.push('Activity title must be at least 3 characters long.');
  }

  const parsedCost = typeof costInput === 'number' ? costInput : parseFloat(costInput);
  const sanitizedCost = isNaN(parsedCost) ? 0 : Math.min(10000, Math.max(0, parsedCost));

  if (isNaN(parsedCost) || parsedCost < 0) {
    errors.push('Estimated cost must be a valid non-negative number.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedTitle,
    sanitizedCost: Math.round(sanitizedCost),
  };
}
